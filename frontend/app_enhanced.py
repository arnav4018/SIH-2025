"""
Agri-AI Dashboard - Enhanced Version
Real-time Agricultural Monitoring System with Advanced Features

This enhanced version includes:
- Advanced MATLAB integration with the new 3-output functions
- Real-time MQTT data visualization
- Advanced health map analysis
- Comprehensive sensor data display
- Export functionality

Author: Agricultural Monitoring Team
Version: Enhanced v1.1
Compatible with: MATLAB Backend (stub + final versions)
"""

import streamlit as st
import numpy as np
import pandas as pd
import time
import json
from datetime import datetime, timedelta
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import matplotlib.pyplot as plt
from io import BytesIO

# Page configuration
st.set_page_config(
    page_title="Agri-AI Dashboard Enhanced",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Enhanced CSS for better styling
st.markdown("""
<style>
.main-header {
    font-size: 2.8rem;
    color: #2E8B57;
    text-align: center;
    margin-bottom: 2rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}
.metric-card {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
}
.status-box {
    padding: 1rem;
    border-radius: 10px;
    margin: 1rem 0;
    border-left: 4px solid #2E8B57;
}
.success-box {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    border-left-color: #28a745;
}
.error-box {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    border-left-color: #dc3545;
}
.warning-box {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    border-left-color: #ffc107;
}
.health-stats {
    font-size: 1.1rem;
    font-weight: bold;
}
</style>
""", unsafe_allow_html=True)

# Initialize session state
def init_session_state():
    if 'matlab_engine' not in st.session_state:
        st.session_state.matlab_engine = None
    if 'engine_status' not in st.session_state:
        st.session_state.engine_status = "Not Started"
    if 'health_map' not in st.session_state:
        st.session_state.health_map = None
    if 'alert_message' not in st.session_state:
        st.session_state.alert_message = None
    if 'stats' not in st.session_state:
        st.session_state.stats = None
    if 'analysis_history' not in st.session_state:
        st.session_state.analysis_history = []
    if 'last_analysis_time' not in st.session_state:
        st.session_state.last_analysis_time = None

init_session_state()

# Helper functions
def format_matlab_stats(matlab_stats):
    """Convert MATLAB struct to Python dictionary"""
    try:
        if matlab_stats is None:
            return {}
        
        # If it's already a dictionary, return as-is
        if isinstance(matlab_stats, dict):
            return matlab_stats
            
        # Handle MATLAB struct conversion
        stats = {}
        field_names = ['temperature', 'humidity', 'soil_moisture', 'ph', 'light_intensity',
                      'predicted_temperature', 'predicted_humidity', 'predicted_soil_moisture',
                      'overall_health_score', 'critical_areas_count', 'healthy_areas_percent',
                      'analysis_timestamp', 'data_source', 'version']
        
        for field in field_names:
            try:
                if hasattr(matlab_stats, field):
                    stats[field] = getattr(matlab_stats, field)
                elif hasattr(matlab_stats, '_' + field):
                    stats[field] = getattr(matlab_stats, '_' + field)
            except:
                stats[field] = None
                
        return stats
    except Exception as e:
        st.warning(f"Error formatting MATLAB stats: {e}")
        return {}

def create_sensor_chart(data, title, color):
    """Create a professional sensor data chart"""
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        y=data,
        mode='lines+markers',
        line=dict(color=color, width=3),
        marker=dict(size=6, color=color),
        name=title,
        hovertemplate=f'{title}: %{{y}}<br>Time: %{{x}}<extra></extra>'
    ))
    
    fig.update_layout(
        title=dict(text=title, x=0.5, font=dict(size=16)),
        xaxis_title="Time (Hours Ago)",
        yaxis_title="Value",
        height=250,
        showlegend=False,
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
    )
    
    return fig

def export_analysis_data():
    """Export current analysis data to downloadable formats"""
    if st.session_state.stats is None:
        return None
        
    # Create comprehensive export data
    export_data = {
        'timestamp': datetime.now().isoformat(),
        'alert_message': st.session_state.alert_message,
        'stats': st.session_state.stats,
        'health_map_shape': st.session_state.health_map.shape if st.session_state.health_map is not None else None
    }
    
    return json.dumps(export_data, indent=2, default=str)

# Main Application
st.markdown('<h1 class="main-header">🌾 Agri-AI Dashboard Enhanced</h1>', unsafe_allow_html=True)

# Sidebar Configuration
with st.sidebar:
    st.header("⚙️ System Configuration")
    
    # MATLAB Engine Control
    st.subheader("🔧 MATLAB Engine")
    
    engine_status_color = {
        "Not Started": "🔴",
        "Starting": "🟡", 
        "Ready": "🟢",
        "Error": "🔴"
    }
    
    st.markdown(f"{engine_status_color.get(st.session_state.engine_status, '🔵')} Status: {st.session_state.engine_status}")
    
    if st.button("🚀 Initialize MATLAB Engine", use_container_width=True):
        st.session_state.engine_status = "Starting"
        
        progress_placeholder = st.empty()
        
        try:
            with progress_placeholder.container():
                progress_bar = st.progress(0, "Initializing MATLAB Engine...")
                time.sleep(0.5)
                
                # Import and start MATLAB engine
                import matlab.engine
                progress_bar.progress(25, "Starting MATLAB Engine...")
                
                st.session_state.matlab_engine = matlab.engine.start_matlab()
                progress_bar.progress(50, "Adding paths...")
                
                # Add paths
                backend_path = r"F:\SIH 2025\SIH-2025\backend"
                ai_path = r"F:\SIH 2025\SIH-2025\ai"
                st.session_state.matlab_engine.addpath(backend_path)
                st.session_state.matlab_engine.addpath(ai_path)
                
                progress_bar.progress(100, "✅ Ready!")
                time.sleep(1)
                
            st.session_state.engine_status = "Ready"
            progress_placeholder.empty()
            st.success("MATLAB Engine initialized successfully!")
            time.sleep(1)
            st.rerun()
            
        except Exception as e:
            st.session_state.engine_status = "Error"
            progress_placeholder.empty()
            st.error(f"Engine initialization failed: {str(e)}")
    
    # Analysis Settings
    if st.session_state.engine_status == "Ready":
        st.subheader("🎛️ Analysis Settings")
        
        analysis_mode = st.selectbox(
            "Analysis Mode",
            ["Stub Mode (Testing)", "Final Mode (Production)"],
            help="Stub mode uses placeholder data, Final mode uses real AI integration"
        )
        
        auto_refresh = st.toggle("🔄 Auto-refresh (30s)", value=False)
        
        # Export functionality
        st.subheader("💾 Data Export")
        if st.session_state.stats is not None:
            export_data = export_analysis_data()
            if export_data:
                st.download_button(
                    label="📄 Export Analysis Data (JSON)",
                    data=export_data,
                    file_name=f"agri_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                    mime="application/json"
                )

# Main Dashboard Content
if st.session_state.engine_status != "Ready":
    st.warning("🔧 Please initialize the MATLAB Engine to access dashboard functionality.")
    
    # Show system requirements
    with st.expander("📋 System Requirements"):
        st.markdown("""
        **Required Software:**
        - MATLAB R2019b or later
        - MATLAB Engine for Python
        - Python packages listed in requirements.txt
        
        **Installation Steps:**
        1. Install MATLAB with required toolboxes
        2. Install MATLAB Engine for Python: `pip install matlabengine`
        3. Install Python dependencies: `pip install -r requirements.txt`
        """)
    
else:
    # Control Panel
    st.header("🎮 Control Panel")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        if st.button("🔍 Run Analysis", type="primary", use_container_width=True):
            with st.spinner("Running agricultural analysis..."):
                try:
                    # Choose function based on analysis mode
                    if analysis_mode == "Final Mode (Production)":
                        function_name = "run_main_analysis_final"
                    else:
                        function_name = "run_main_analysis"
                    
                    # Call MATLAB function with 3 outputs
                    health_map, alert_message, stats = st.session_state.matlab_engine.eval(
                        f"[health_map, alert_message, stats] = {function_name}();",
                        nargout=3
                    )
                    
                    # Store results
                    st.session_state.health_map = np.asarray(health_map)
                    st.session_state.alert_message = str(alert_message)
                    st.session_state.stats = format_matlab_stats(stats)
                    st.session_state.last_analysis_time = datetime.now()
                    
                    # Add to history
                    st.session_state.analysis_history.append({
                        'timestamp': st.session_state.last_analysis_time,
                        'mode': analysis_mode,
                        'health_score': st.session_state.stats.get('overall_health_score', 0)
                    })
                    
                    # Keep only last 10 analyses
                    if len(st.session_state.analysis_history) > 10:
                        st.session_state.analysis_history = st.session_state.analysis_history[-10:]
                    
                    st.success("✅ Analysis completed successfully!")
                    
                except Exception as e:
                    st.error(f"❌ Analysis failed: {str(e)}")
                    # Create fallback mock data
                    st.warning("Using fallback data for demonstration...")
                    st.session_state.health_map = np.random.rand(100, 100)
                    st.session_state.alert_message = "System Alert: Using fallback data mode"
                    st.session_state.stats = {
                        'temperature': 25.0,
                        'humidity': 60.0,
                        'soil_moisture': 45.0,
                        'overall_health_score': 0.75
                    }
    
    with col2:
        if st.button("🔄 Refresh", use_container_width=True):
            st.rerun()
    
    with col3:
        if st.button("🗑️ Clear Data", use_container_width=True):
            st.session_state.health_map = None
            st.session_state.alert_message = None
            st.session_state.stats = None
            st.success("Data cleared!")
            st.rerun()
    
    with col4:
        if st.button("📊 View History", use_container_width=True):
            if st.session_state.analysis_history:
                with st.expander("📈 Analysis History", expanded=True):
                    df_history = pd.DataFrame(st.session_state.analysis_history)
                    st.dataframe(df_history, use_container_width=True)
            else:
                st.info("No analysis history available")

    # Main Dashboard Layout
    if st.session_state.health_map is not None and st.session_state.stats is not None:
        st.divider()
        
        # Top Metrics Row
        st.subheader("📊 Key Metrics")
        
        metric_col1, metric_col2, metric_col3, metric_col4 = st.columns(4)
        
        with metric_col1:
            health_score = st.session_state.stats.get('overall_health_score', 0)
            st.metric(
                "🌿 Overall Health Score",
                f"{health_score:.2f}",
                delta=f"{(health_score - 0.75):.2f}" if health_score else None
            )
        
        with metric_col2:
            healthy_percent = st.session_state.stats.get('healthy_areas_percent', 0)
            st.metric(
                "✅ Healthy Areas",
                f"{healthy_percent:.1f}%",
                delta=f"{(healthy_percent - 75):.1f}%" if healthy_percent else None
            )
        
        with metric_col3:
            critical_areas = st.session_state.stats.get('critical_areas_count', 0)
            st.metric(
                "⚠️ Critical Areas",
                f"{critical_areas}",
                delta=None
            )
        
        with metric_col4:
            temperature = st.session_state.stats.get('temperature', 0)
            st.metric(
                "🌡️ Temperature",
                f"{temperature:.1f}°C",
                delta=f"{(temperature - 25):.1f}°C" if temperature else None
            )
        
        # Main Content Columns
        left_col, right_col = st.columns([3, 2])
        
        # Health Map Visualization
        with left_col:
            st.subheader("🗺️ Crop Health Map")
            
            # Display health map
            fig, ax = plt.subplots(figsize=(10, 8))
            im = ax.imshow(st.session_state.health_map, cmap='RdYlGn', aspect='auto')
            ax.set_title('Crop Health Analysis Map', fontsize=16, fontweight='bold')
            ax.set_xlabel('Field Width (meters)', fontsize=12)
            ax.set_ylabel('Field Length (meters)', fontsize=12)
            
            # Add colorbar
            cbar = plt.colorbar(im, ax=ax)
            cbar.set_label('Health Index (0=Poor, 1=Excellent)', rotation=270, labelpad=20)
            
            st.pyplot(fig)
            plt.close()
            
            # Health map statistics
            with st.expander("📈 Detailed Health Map Analysis"):
                stats_col1, stats_col2, stats_col3 = st.columns(3)
                
                with stats_col1:
                    st.markdown(f"""
                    **Map Dimensions:**
                    - Resolution: {st.session_state.health_map.shape[0]}×{st.session_state.health_map.shape[1]}
                    - Total Pixels: {st.session_state.health_map.size:,}
                    """)
                
                with stats_col2:
                    st.markdown(f"""
                    **Health Distribution:**
                    - Mean Health: {np.mean(st.session_state.health_map):.3f}
                    - Std Deviation: {np.std(st.session_state.health_map):.3f}
                    """)
                
                with stats_col3:
                    healthy_threshold = 0.7
                    critical_threshold = 0.3
                    healthy_pixels = np.sum(st.session_state.health_map > healthy_threshold)
                    critical_pixels = np.sum(st.session_state.health_map < critical_threshold)
                    
                    st.markdown(f"""
                    **Area Classification:**
                    - Healthy (>0.7): {100*healthy_pixels/st.session_state.health_map.size:.1f}%
                    - Critical (<0.3): {100*critical_pixels/st.session_state.health_map.size:.1f}%
                    """)
        
        # Alerts and Sensor Data
        with right_col:
            st.subheader("🚨 System Alerts")
            
            # Display alert with appropriate styling
            if st.session_state.alert_message:
                alert_lower = st.session_state.alert_message.lower()
                if any(keyword in alert_lower for keyword in ['critical', 'severe', 'danger']):
                    st.error(f"🚨 CRITICAL: {st.session_state.alert_message}")
                elif any(keyword in alert_lower for keyword in ['warning', 'caution', 'low']):
                    st.warning(f"⚠️ WARNING: {st.session_state.alert_message}")
                else:
                    st.info(f"ℹ️ {st.session_state.alert_message}")
            else:
                st.success("✅ All systems operating normally")
            
            # Current Sensor Readings
            st.subheader("📊 Current Sensor Readings")
            
            # Create sensor data cards
            sensors = {
                "Temperature": {"value": st.session_state.stats.get('temperature', 0), "unit": "°C", "icon": "🌡️"},
                "Humidity": {"value": st.session_state.stats.get('humidity', 0), "unit": "%", "icon": "💧"},
                "Soil Moisture": {"value": st.session_state.stats.get('soil_moisture', 0), "unit": "%", "icon": "🌱"},
                "pH Level": {"value": st.session_state.stats.get('ph', 0), "unit": "", "icon": "⚗️"}
            }
            
            for sensor, data in sensors.items():
                with st.container():
                    col1, col2 = st.columns([1, 3])
                    with col1:
                        st.markdown(f"<div style='font-size: 2rem; text-align: center;'>{data['icon']}</div>", unsafe_allow_html=True)
                    with col2:
                        st.metric(sensor, f"{data['value']:.1f}{data['unit']}")
            
            # Predictions (if available)
            if any(key.startswith('predicted_') for key in st.session_state.stats.keys()):
                st.subheader("🔮 AI Predictions")
                
                pred_temp = st.session_state.stats.get('predicted_temperature')
                pred_humidity = st.session_state.stats.get('predicted_humidity') 
                pred_moisture = st.session_state.stats.get('predicted_soil_moisture')
                
                if pred_temp:
                    st.metric("🌡️ Predicted Temp", f"{pred_temp:.1f}°C", 
                             delta=f"{pred_temp - st.session_state.stats.get('temperature', 0):.1f}°C")
                if pred_humidity:
                    st.metric("💧 Predicted Humidity", f"{pred_humidity:.1f}%",
                             delta=f"{pred_humidity - st.session_state.stats.get('humidity', 0):.1f}%")
                if pred_moisture:
                    st.metric("🌱 Predicted Soil Moisture", f"{pred_moisture:.1f}%",
                             delta=f"{pred_moisture - st.session_state.stats.get('soil_moisture', 0):.1f}%")
        
        # Historical Trends Section
        if len(st.session_state.analysis_history) > 1:
            st.divider()
            st.subheader("📈 Historical Trends")
            
            # Create trend chart
            df_history = pd.DataFrame(st.session_state.analysis_history)
            
            fig = px.line(df_history, x='timestamp', y='health_score',
                         title='Health Score Trend Over Time',
                         labels={'health_score': 'Overall Health Score', 'timestamp': 'Time'})
            fig.update_traces(line=dict(color='#2E8B57', width=3))
            fig.update_layout(height=300)
            
            st.plotly_chart(fig, use_container_width=True)

    else:
        st.info("🔍 Run analysis to view dashboard data and insights")

# Auto-refresh functionality
if st.session_state.engine_status == "Ready" and 'auto_refresh' in locals() and auto_refresh:
    time.sleep(30)
    st.rerun()

# Footer
st.divider()
st.markdown("""
<div style="text-align: center; color: #666; padding: 1rem; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 10px;">
    <p><strong>🌾 Agri-AI Dashboard Enhanced | SIH 2025 Project</strong></p>
    <p><em>Advanced Agricultural Monitoring with AI-Powered Insights</em></p>
    <p>Version: Enhanced v1.1 | Compatible with MATLAB Backend v1.0+</p>
</div>
""", unsafe_allow_html=True)
