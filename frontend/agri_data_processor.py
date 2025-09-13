"""
Agricultural Data Processing Module
==================================

This module provides Python functions to interface between MATLAB analysis
engine and the Streamlit dashboard, including data validation, transformation,
and visualization preparation.

Author: Agricultural Monitoring Team
Version: v1.0
Compatible with: MATLAB Engine, Streamlit Dashboard
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import json
import warnings
from typing import Dict, Tuple, List, Any, Optional

# Suppress matplotlib warnings
warnings.filterwarnings('ignore', category=UserWarning)

class AgriDataProcessor:
    """
    Main class for processing agricultural data from MATLAB analysis engine
    """
    
    def __init__(self):
        self.last_analysis_time = None
        self.analysis_history = []
        self.sensor_data_cache = None
        self.health_map_cache = None
        
    def process_matlab_results(self, health_map, alert_message, stats) -> Dict[str, Any]:
        """
        Process raw MATLAB results into Python-friendly format
        
        Args:
            health_map: MATLAB array representing crop health
            alert_message: String alert message from MATLAB
            stats: MATLAB struct with analysis statistics
            
        Returns:
            Dict containing processed results ready for dashboard display
        """
        processed_results = {}
        
        try:
            # Process health map
            if health_map is not None:
                health_array = np.array(health_map)
                if health_array.ndim == 2:
                    processed_results['health_map'] = health_array
                    processed_results['health_map_stats'] = self._compute_health_map_stats(health_array)
                else:
                    raise ValueError(f"Health map has incorrect dimensions: {health_array.shape}")
            else:
                processed_results['health_map'] = None
                processed_results['health_map_stats'] = {}
                
            # Process alert message
            processed_results['alert_message'] = str(alert_message) if alert_message else "No alerts"
            processed_results['alert_severity'] = self._classify_alert_severity(processed_results['alert_message'])
            
            # Process statistics
            processed_results['stats'] = self._process_matlab_stats(stats)
            
            # Add processing metadata
            processed_results['processing_time'] = datetime.now().isoformat()
            processed_results['data_quality_score'] = self._assess_data_quality(processed_results)
            
            # Cache results
            self.health_map_cache = processed_results['health_map']
            self.last_analysis_time = datetime.now()
            
            # Add to history
            self._update_analysis_history(processed_results)
            
        except Exception as e:
            print(f"Error processing MATLAB results: {e}")
            processed_results = self._create_fallback_results(str(e))
            
        return processed_results
    
    def _compute_health_map_stats(self, health_map: np.ndarray) -> Dict[str, float]:
        """Compute detailed statistics for the health map"""
        stats = {}
        
        # Basic statistics
        stats['mean_health'] = float(np.mean(health_map))
        stats['std_health'] = float(np.std(health_map))
        stats['min_health'] = float(np.min(health_map))
        stats['max_health'] = float(np.max(health_map))
        
        # Health classification
        excellent_threshold = 0.8
        good_threshold = 0.6
        fair_threshold = 0.4
        poor_threshold = 0.2
        
        total_pixels = health_map.size
        stats['excellent_areas'] = float(np.sum(health_map >= excellent_threshold) / total_pixels * 100)
        stats['good_areas'] = float(np.sum((health_map >= good_threshold) & (health_map < excellent_threshold)) / total_pixels * 100)
        stats['fair_areas'] = float(np.sum((health_map >= fair_threshold) & (health_map < good_threshold)) / total_pixels * 100)
        stats['poor_areas'] = float(np.sum((health_map >= poor_threshold) & (health_map < fair_threshold)) / total_pixels * 100)
        stats['critical_areas'] = float(np.sum(health_map < poor_threshold) / total_pixels * 100)
        
        # Spatial analysis
        stats['healthy_patches'] = self._count_connected_regions(health_map > good_threshold)
        stats['critical_patches'] = self._count_connected_regions(health_map < poor_threshold)
        
        return stats
    
    def _count_connected_regions(self, binary_map: np.ndarray) -> int:
        """Count connected regions in a binary map using simple flood fill"""
        try:
            from scipy import ndimage
            labeled_array, num_features = ndimage.label(binary_map)
            return int(num_features)
        except ImportError:
            # Fallback if scipy not available
            return int(np.sum(binary_map) / 10)  # Rough estimate
    
    def _classify_alert_severity(self, alert_message: str) -> str:
        """Classify alert severity based on message content"""
        alert_lower = alert_message.lower()
        
        if any(keyword in alert_lower for keyword in ['critical', 'severe', 'emergency', 'irrigation needed']):
            return 'critical'
        elif any(keyword in alert_lower for keyword in ['warning', 'caution', 'alert', 'stress']):
            return 'warning'
        elif any(keyword in alert_lower for keyword in ['info', 'forecast', 'trend']):
            return 'info'
        elif 'nominal' in alert_lower or 'no alerts' in alert_lower:
            return 'normal'
        else:
            return 'unknown'
    
    def _process_matlab_stats(self, matlab_stats) -> Dict[str, Any]:
        """Convert MATLAB struct to Python dictionary with type checking"""
        if matlab_stats is None:
            return {}
            
        stats = {}
        
        # Define expected fields and their types
        expected_fields = {
            'temperature': float,
            'humidity': float,
            'soil_moisture': float,
            'ph': float,
            'light_intensity': float,
            'predicted_temperature': float,
            'predicted_humidity': float,
            'predicted_soil_moisture': float,
            'overall_health_score': float,
            'critical_areas_count': int,
            'healthy_areas_percent': float,
            'ndvi_mean': float,
            'ndvi_std': float,
            'temp_trend': float,
            'humidity_trend': float,
            'moisture_trend': float,
            'plant_stress_level': float,
            'analysis_timestamp': str,
            'data_source': str,
            'version': str
        }
        
        # Process each field
        for field, expected_type in expected_fields.items():
            try:
                if hasattr(matlab_stats, field):
                    value = getattr(matlab_stats, field)
                elif hasattr(matlab_stats, f'_{field}'):
                    value = getattr(matlab_stats, f'_{field}')
                elif isinstance(matlab_stats, dict) and field in matlab_stats:
                    value = matlab_stats[field]
                else:
                    value = None
                
                if value is not None:
                    if expected_type == float:
                        stats[field] = float(value) if np.isfinite(float(value)) else 0.0
                    elif expected_type == int:
                        stats[field] = int(value) if np.isfinite(float(value)) else 0
                    elif expected_type == str:
                        stats[field] = str(value)
                else:
                    # Set default values
                    if expected_type == float:
                        stats[field] = 0.0
                    elif expected_type == int:
                        stats[field] = 0
                    elif expected_type == str:
                        stats[field] = 'unknown'
                        
            except Exception as e:
                print(f"Warning: Error processing field '{field}': {e}")
                # Set safe default
                if expected_type == float:
                    stats[field] = 0.0
                elif expected_type == int:
                    stats[field] = 0
                elif expected_type == str:
                    stats[field] = 'error'
        
        return stats
    
    def _assess_data_quality(self, results: Dict[str, Any]) -> float:
        """Assess overall data quality score (0-1)"""
        quality_score = 1.0
        
        # Penalize missing health map
        if results['health_map'] is None:
            quality_score -= 0.3
        
        # Check statistics completeness
        stats = results['stats']
        required_stats = ['temperature', 'humidity', 'soil_moisture', 'overall_health_score']
        missing_stats = sum(1 for stat in required_stats if stats.get(stat, 0) == 0)
        quality_score -= missing_stats * 0.1
        
        # Check for reasonable value ranges
        if stats.get('temperature', 0) < -50 or stats.get('temperature', 0) > 60:
            quality_score -= 0.1
        if stats.get('humidity', 0) < 0 or stats.get('humidity', 0) > 100:
            quality_score -= 0.1
        if stats.get('soil_moisture', 0) < 0 or stats.get('soil_moisture', 0) > 100:
            quality_score -= 0.1
            
        return max(0.0, quality_score)
    
    def _update_analysis_history(self, results: Dict[str, Any]):
        """Update the analysis history with current results"""
        history_entry = {
            'timestamp': datetime.now(),
            'health_score': results['stats'].get('overall_health_score', 0),
            'alert_severity': results['alert_severity'],
            'data_quality': results['data_quality_score'],
            'temperature': results['stats'].get('temperature', 0),
            'soil_moisture': results['stats'].get('soil_moisture', 0)
        }
        
        self.analysis_history.append(history_entry)
        
        # Keep only last 24 entries (24 hours if run hourly)
        if len(self.analysis_history) > 24:
            self.analysis_history = self.analysis_history[-24:]
    
    def _create_fallback_results(self, error_msg: str) -> Dict[str, Any]:
        """Create fallback results when processing fails"""
        return {
            'health_map': np.random.rand(100, 100) * 0.3 + 0.4,  # Moderate health
            'health_map_stats': {
                'mean_health': 0.55,
                'excellent_areas': 10.0,
                'good_areas': 30.0,
                'fair_areas': 40.0,
                'poor_areas': 15.0,
                'critical_areas': 5.0
            },
            'alert_message': f'Data processing error: {error_msg}',
            'alert_severity': 'warning',
            'stats': {
                'temperature': 25.0,
                'humidity': 60.0,
                'soil_moisture': 45.0,
                'overall_health_score': 0.55,
                'data_source': 'fallback_data',
                'analysis_timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            },
            'data_quality_score': 0.2,
            'processing_time': datetime.now().isoformat()
        }
    
    def get_analysis_history(self) -> pd.DataFrame:
        """Get analysis history as a pandas DataFrame"""
        if not self.analysis_history:
            return pd.DataFrame()
        
        return pd.DataFrame(self.analysis_history)
    
    def create_health_map_visualization(self, health_map: np.ndarray) -> plt.Figure:
        """Create a matplotlib figure for health map visualization"""
        fig, ax = plt.subplots(figsize=(10, 8))
        
        # Create the health map visualization
        im = ax.imshow(health_map, cmap='RdYlGn', aspect='auto', vmin=0, vmax=1)
        
        # Customize the plot
        ax.set_title('Crop Health Analysis Map', fontsize=16, fontweight='bold', pad=20)
        ax.set_xlabel('Field Width (meters)', fontsize=12)
        ax.set_ylabel('Field Length (meters)', fontsize=12)
        
        # Add colorbar
        cbar = plt.colorbar(im, ax=ax)
        cbar.set_label('Health Index (0=Critical, 1=Excellent)', rotation=270, labelpad=20)
        
        # Add grid for better readability
        ax.grid(True, alpha=0.3)
        
        # Add health zones overlay (optional)
        self._add_health_zones_overlay(ax, health_map)
        
        plt.tight_layout()
        return fig
    
    def _add_health_zones_overlay(self, ax, health_map: np.ndarray):
        """Add contour lines to show health zones"""
        try:
            # Create contour lines for different health levels
            levels = [0.2, 0.4, 0.6, 0.8]
            colors = ['red', 'orange', 'yellow', 'lightgreen']
            
            contours = ax.contour(health_map, levels=levels, colors=colors, alpha=0.6, linewidths=1)
            ax.clabel(contours, inline=True, fontsize=8, fmt='%.1f')
        except Exception:
            # Skip if contour fails
            pass
    
    def export_analysis_data(self, results: Dict[str, Any], format: str = 'json') -> str:
        """Export analysis data in specified format"""
        export_data = {
            'export_timestamp': datetime.now().isoformat(),
            'analysis_results': results,
            'analysis_history': [
                {**entry, 'timestamp': entry['timestamp'].isoformat()}
                for entry in self.analysis_history
            ]
        }
        
        if format.lower() == 'json':
            return json.dumps(export_data, indent=2, default=str)
        else:
            raise ValueError(f"Unsupported export format: {format}")

# Utility functions for dashboard integration
def create_sensor_trend_chart(history_df: pd.DataFrame, metric: str) -> plt.Figure:
    """Create a trend chart for sensor data"""
    fig, ax = plt.subplots(figsize=(10, 6))
    
    if not history_df.empty and metric in history_df.columns:
        ax.plot(history_df['timestamp'], history_df[metric], 'o-', linewidth=2, markersize=4)
        ax.set_title(f'{metric.replace("_", " ").title()} Trend', fontsize=14)
        ax.set_xlabel('Time', fontsize=12)
        ax.set_ylabel(metric.replace('_', ' ').title(), fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
    else:
        ax.text(0.5, 0.5, f'No data available for {metric}', 
                horizontalalignment='center', verticalalignment='center',
                transform=ax.transAxes, fontsize=12)
    
    plt.tight_layout()
    return fig

def format_alert_for_display(alert_message: str, severity: str) -> Dict[str, str]:
    """Format alert message for dashboard display"""
    severity_colors = {
        'critical': '🔴',
        'warning': '⚠️',
        'info': 'ℹ️',
        'normal': '✅',
        'unknown': '❓'
    }
    
    severity_labels = {
        'critical': 'CRITICAL',
        'warning': 'WARNING',
        'info': 'INFO',
        'normal': 'NORMAL',
        'unknown': 'UNKNOWN'
    }
    
    return {
        'icon': severity_colors.get(severity, '❓'),
        'label': severity_labels.get(severity, 'UNKNOWN'),
        'message': alert_message,
        'color_class': severity
    }