"""
Agricultural Monitoring Dashboard - Integrated Version
====================================================

Advanced agricultural monitoring system with:
- Real hyperspectral data analysis (Indian Pines dataset)
- Sensor data processing and visualization
- AI-powered predictions and alerts
- Professional data visualization

Author: Agricultural Monitoring Team
Version: Integrated v1.0
Compatible with: Enhanced MATLAB Backend, Real Data Sources
"""

import streamlit as st
import numpy as np
import pandas as pd
import time
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import sys
import os

# Add the frontend directory to Python path for imports
frontend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, frontend_dir)

from agri_data_processor import AgriDataProcessor, format_alert_for_display

# Page configuration
st.set_page_config(
    page_title="Agri-AI Dashboard - Integrated",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Enhanced CSS styling
st.markdown("""
<style>
.main-header {
    font-size: 3rem;
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
.status-excellent { background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); }
.status-good { background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%); }
.status-warning { background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); }
.status-critical { background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); }
.health-zone {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin: 0.25rem 0;
    border-radius: 8px;
}
.zone-excellent { background-color: #d4edda; color: #155724; }
.zone-good { background-color: #d1ecf1; color: #0c5460; }
.zone-fair { background-color: #fff3cd; color: #856404; }
.zone-poor { background-color: #f8d7da; color: #721c24; }
.alert-critical { border-left: 5px solid #dc3545; background-color: #f8d7da; }
.alert-warning { border-left: 5px solid #ffc107; background-color: #fff3cd; }
.alert-info { border-left: 5px solid #17a2b8; background-color: #d1ecf1; }
.alert-normal { border-left: 5px solid #28a745; background-color: #d4edda; }
</style>
""", unsafe_allow_html=True)

# Initialize session state and data processor
if 'data_processor' not in st.session_state:
    st.session_state.data_processor = AgriDataProcessor()

if 'matlab_engine' not in st.session_state:
    st.session_state.matlab_engine = None
if 'engine_status' not in st.session_state:
    st.session_state.engine_status = "Not Started"
if 'analysis_results' not in st.session_state:
    st.session_state.analysis_results = None

# Main title
st.markdown('<h1 class="main-header">🌾 Agricultural AI Dashboard - Integrated</h1>', unsafe_allow_html=True)

# Sidebar Configuration
with st.sidebar:
    st.header("⚙️ System Configuration")
    
    # MATLAB Engine Control
    st.subheader("🔧 MATLAB Engine Status")
    
    engine_status_colors = {
        "Not Started": "🔴",
        "Starting": "🟡",
        "Ready": "🟢",
        "Error": "🔴"
    }
    
    st.markdown(f"{engine_status_colors.get(st.session_state.engine_status, '🔵')} **{st.session_state.engine_status}**")
    
    if st.button("🚀 Initialize MATLAB Engine", use_container_width=True):
        st.session_state.engine_status = "Starting"
        
        progress_container = st.empty()
        
        try:
            with progress_container.container():
                progress_bar = st.progress(0)
                status_text = st.empty()
                
                # Step 1: Import MATLAB engine
                status_text.text("Importing MATLAB engine...")
                progress_bar.progress(20)
                import matlab.engine
                time.sleep(0.5)
                
                # Step 2: Start engine
                status_text.text("Starting MATLAB engine...")
                progress_bar.progress(40)
                st.session_state.matlab_engine = matlab.engine.start_matlab()
                time.sleep(1)
                
                # Step 3: Add paths
                status_text.text("Adding project paths...")
                progress_bar.progress(70)
                
                # Get project root (assuming we're in frontend folder)
                project_root = os.path.dirname(frontend_dir)
                backend_path = os.path.join(project_root, 'backend')
                ai_path = os.path.join(project_root, 'ai')
                
                st.session_state.matlab_engine.addpath(backend_path)
                st.session_state.matlab_engine.addpath(ai_path)
                
                # Step 4: Test connection
                status_text.text("Testing MATLAB connection...")
                progress_bar.progress(90)
                test_result = st.session_state.matlab_engine.eval("disp('MATLAB Engine Ready');", nargout=0)
                
                progress_bar.progress(100)
                status_text.text("✅ MATLAB Engine Ready!")
                time.sleep(1)
                
            st.session_state.engine_status = "Ready"
            progress_container.empty()
            st.success("MATLAB Engine initialized successfully!")
            time.sleep(1)
            st.rerun()
            
        except Exception as e:
            st.session_state.engine_status = "Error"
            progress_container.empty()
            st.error(f"Failed to initialize MATLAB Engine: {str(e)}")
    
    # Analysis Configuration
    if st.session_state.engine_status == "Ready":
        st.divider()
        st.subheader("🎛️ Analysis Configuration")
        
        analysis_function = st.selectbox(
            "Analysis Function",
            ["run_main_analysis_enhanced", "run_main_analysis", "run_main_analysis_final"],
            help="Select which MATLAB analysis function to use"
        )
        
        auto_refresh = st.toggle("🔄 Auto-refresh (30s)", value=False)
        
        st.divider()
        st.subheader("📊 Data Overview")
        
        # Display data processor status
        if st.session_state.data_processor.last_analysis_time:
            st.write(f"**Last Analysis:** {st.session_state.data_processor.last_analysis_time.strftime('%H:%M:%S')}")
            st.write(f"**History Records:** {len(st.session_state.data_processor.analysis_history)}")
        else:
            st.write("**Status:** No analysis run yet")

# Main Dashboard Content
if st.session_state.engine_status != "Ready":
    # Show system requirements and preview
    col1, col2 = st.columns(2)
    
    with col1:
        st.warning("🔧 Please initialize the MATLAB Engine to access full functionality.")
        
        with st.expander("📋 System Requirements"):
            st.markdown("""
            **Required Components:**
            - ✅ MATLAB R2019b or later
            - ✅ MATLAB Engine for Python
            - ✅ Python packages (requirements.txt)
            - ✅ Hyperspectral data (Indian Pines dataset)
            - ✅ Sensor data (CSV format)
            
            **Data Sources:**
            - 📊 Indian Pines hyperspectral dataset (5.68 MB)
            - 📈 Simulated sensor data (73 records, 3 days)
            """)
    
    with col2:
        st.info("🔍 Dashboard Preview")
        preview_fig, preview_ax = plt.subplots(figsize=(8, 6))
        preview_data = np.random.rand(50, 50)
        preview_ax.imshow(preview_data, cmap='RdYlGn', aspect='auto')
        preview_ax.set_title('Health Map Preview (Sample Data)')
        st.pyplot(preview_fig)
        plt.close(preview_fig)

else:
    # Main Control Panel
    st.header("🎮 Analysis Control Panel")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        if st.button("🔍 Run Enhanced Analysis", type="primary", use_container_width=True):
            with st.spinner("🚀 Running comprehensive agricultural analysis..."):
                try:
                    # Call the enhanced MATLAB function
                    start_time = time.time()
                    
                    health_map, alert_message, stats = st.session_state.matlab_engine.eval(
                        f"[health_map, alert_message, stats] = {analysis_function}();",
                        nargout=3
                    )
                    
                    processing_time = time.time() - start_time
                    
                    # Process results through our data processor
                    results = st.session_state.data_processor.process_matlab_results(
                        health_map, alert_message, stats
                    )
                    
                    results['processing_time_seconds'] = processing_time
                    st.session_state.analysis_results = results
                    
                    st.success(f"✅ Analysis completed successfully! ({processing_time:.1f}s)")
                    
                except Exception as e:
                    st.error(f"❌ Analysis failed: {str(e)}")
                    st.warning("🔄 Using fallback data for demonstration...")
                    
                    # Create fallback results
                    fallback_health_map = np.random.rand(145, 145)
                    fallback_alert = f"Fallback mode: {str(e)}"
                    fallback_stats = {'overall_health_score': 0.65, 'temperature': 25.0}
                    
                    results = st.session_state.data_processor.process_matlab_results(
                        fallback_health_map, fallback_alert, fallback_stats
                    )
                    st.session_state.analysis_results = results
    
    with col2:
        if st.button("🔄 Refresh Dashboard", use_container_width=True):
            st.rerun()
    
    with col3:
        if st.button("🗑️ Clear Results", use_container_width=True):
            st.session_state.analysis_results = None
            st.session_state.data_processor.health_map_cache = None
            st.success("Results cleared!")
            st.rerun()
    
    with col4:
        if st.button("📊 Export Data", use_container_width=True):
            if st.session_state.analysis_results:
                export_data = st.session_state.data_processor.export_analysis_data(
                    st.session_state.analysis_results
                )
                st.download_button(
                    "💾 Download Analysis Data",
                    export_data,
                    f"agri_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                    "application/json"
                )
            else:
                st.info("No data to export. Run analysis first.")

    # Main Dashboard Display
    if st.session_state.analysis_results:
        results = st.session_state.analysis_results
        
        st.divider()
        
        # Key Metrics Row
        st.subheader("📊 Key Performance Indicators")
        
        kpi_col1, kpi_col2, kpi_col3, kpi_col4 = st.columns(4)
        
        with kpi_col1:
            health_score = results['stats'].get('overall_health_score', 0)
            st.metric(
                "🌿 Overall Health Score",
                f"{health_score:.3f}",
                delta=f"{health_score - 0.75:.3f}" if health_score else None,
                help="Composite health score from hyperspectral analysis"
            )
        
        with kpi_col2:
            healthy_percent = results['health_map_stats'].get('excellent_areas', 0) + \
                             results['health_map_stats'].get('good_areas', 0)
            st.metric(
                "✅ Healthy Areas",
                f"{healthy_percent:.1f}%",
                delta=f"{healthy_percent - 75:.1f}%" if healthy_percent else None,
                help="Percentage of area classified as healthy"
            )
        
        with kpi_col3:
            current_temp = results['stats'].get('temperature', 0)
            st.metric(
                "🌡️ Temperature",
                f"{current_temp:.1f}°C",
                delta=f"{results['stats'].get('temp_trend', 0):+.1f}°C",
                help="Current temperature with trend indicator"
            )
        
        with kpi_col4:
            stress_level = results['stats'].get('plant_stress_level', 0)
            st.metric(
                "⚠️ Plant Stress Level",
                f"{stress_level:.0f}%",
                delta=None,
                help="AI-computed plant stress indicator"
            )
        
        # Main Content Layout
        left_col, right_col = st.columns([2, 1])
        
        # Health Map Visualization
        with left_col:
            st.subheader("🗺️ Crop Health Analysis Map")
            
            if results['health_map'] is not None:
                # Create enhanced health map visualization
                health_fig = st.session_state.data_processor.create_health_map_visualization(
                    results['health_map']
                )
                st.pyplot(health_fig)
                plt.close(health_fig)
                
                # Health map statistics
                with st.expander("📈 Detailed Health Map Analysis"):
                    stat_col1, stat_col2, stat_col3 = st.columns(3)
                    
                    with stat_col1:
                        st.markdown("""
                        **Map Information:**
                        """)
                        st.write(f"• Resolution: {results['health_map'].shape[0]}×{results['health_map'].shape[1]}")
                        st.write(f"• Total Pixels: {results['health_map'].size:,}")
                        st.write(f"• Data Source: {results['stats'].get('data_source', 'unknown')}")
                    
                    with stat_col2:
                        st.markdown("""
                        **Health Distribution:**
                        """)
                        health_stats = results['health_map_stats']
                        st.write(f"• Mean Health: {health_stats.get('mean_health', 0):.3f}")
                        st.write(f"• Std Deviation: {health_stats.get('std_health', 0):.3f}")
                        st.write(f"• Range: {health_stats.get('min_health', 0):.2f} - {health_stats.get('max_health', 0):.2f}")
                    
                    with stat_col3:
                        st.markdown("""
                        **Area Classification:**
                        """)
                        for zone, percentage in [
                            ("Excellent", health_stats.get('excellent_areas', 0)),
                            ("Good", health_stats.get('good_areas', 0)),
                            ("Fair", health_stats.get('fair_areas', 0)),
                            ("Poor", health_stats.get('poor_areas', 0)),
                            ("Critical", health_stats.get('critical_areas', 0))
                        ]:
                            st.write(f"• {zone}: {percentage:.1f}%")
            
            else:
                st.error("Health map data not available")
        
        # Alerts and Sensor Data
        with right_col:
            st.subheader("🚨 System Alerts & Status")
            
            # Format and display alert
            alert_info = format_alert_for_display(
                results['alert_message'], 
                results['alert_severity']
            )
            
            alert_class = f"alert-{alert_info['color_class']}"
            st.markdown(f"""
            <div class="status-box {alert_class}" style="padding: 1rem; margin: 1rem 0; border-radius: 8px;">
                <strong>{alert_info['icon']} {alert_info['label']}</strong><br>
                {alert_info['message']}
            </div>
            """, unsafe_allow_html=True)
            
            # Current Sensor Readings
            st.subheader("📊 Current Sensor Readings")
            
            sensor_metrics = [
                ("🌡️ Temperature", results['stats'].get('temperature', 0), "°C"),
                ("💧 Humidity", results['stats'].get('humidity', 0), "%"),
                ("🌱 Soil Moisture", results['stats'].get('soil_moisture', 0), "%"),
                ("⚗️ pH Level", results['stats'].get('ph', 0), ""),
                ("☀️ Light Intensity", results['stats'].get('light_intensity', 0), " lux")
            ]
            
            for icon_name, value, unit in sensor_metrics:
                col1, col2 = st.columns([1, 2])
                with col1:
                    st.markdown(f"<div style='font-size: 1.5rem; text-align: center;'>{icon_name.split()[0]}</div>", unsafe_allow_html=True)
                with col2:
                    st.metric(icon_name.split()[1], f"{value:.1f}{unit}")
            
            # AI Predictions
            st.subheader("🔮 AI Predictions")
            
            predictions = [
                ("Temperature", results['stats'].get('predicted_temperature', 0), results['stats'].get('temperature', 0), "°C"),
                ("Humidity", results['stats'].get('predicted_humidity', 0), results['stats'].get('humidity', 0), "%"),
                ("Soil Moisture", results['stats'].get('predicted_soil_moisture', 0), results['stats'].get('soil_moisture', 0), "%")
            ]
            
            for param, predicted, current, unit in predictions:
                if predicted != 0:
                    delta = predicted - current
                    st.metric(
                        f"🔮 {param}",
                        f"{predicted:.1f}{unit}",
                        delta=f"{delta:+.1f}{unit}",
                        help=f"Predicted vs current {param.lower()}"
                    )
        
        # Historical Trends
        history_df = st.session_state.data_processor.get_analysis_history()
        if not history_df.empty and len(history_df) > 1:
            st.divider()
            st.subheader("📈 Historical Trends")
            
            trend_col1, trend_col2 = st.columns(2)
            
            with trend_col1:
                # Health score trend
                fig_health = px.line(
                    history_df, 
                    x='timestamp', 
                    y='health_score',
                    title='Health Score Trend',
                    labels={'health_score': 'Health Score', 'timestamp': 'Time'}
                )
                fig_health.update_traces(line=dict(color='#2E8B57', width=3))
                fig_health.update_layout(height=300)
                st.plotly_chart(fig_health, use_container_width=True)
            
            with trend_col2:
                # Temperature and soil moisture trend
                fig_sensors = make_subplots(
                    specs=[[{"secondary_y": True}]],
                    subplot_titles=('Environmental Conditions Trend',)
                )
                
                fig_sensors.add_trace(
                    go.Scatter(x=history_df['timestamp'], y=history_df['temperature'], 
                             name='Temperature (°C)', line=dict(color='red')),
                    secondary_y=False
                )
                
                fig_sensors.add_trace(
                    go.Scatter(x=history_df['timestamp'], y=history_df['soil_moisture'], 
                             name='Soil Moisture (%)', line=dict(color='blue')),
                    secondary_y=True
                )
                
                fig_sensors.update_yaxes(title_text="Temperature (°C)", secondary_y=False)
                fig_sensors.update_yaxes(title_text="Soil Moisture (%)", secondary_y=True)
                fig_sensors.update_layout(height=300)
                st.plotly_chart(fig_sensors, use_container_width=True)
        
        # Data Quality Assessment
        st.divider()
        quality_col1, quality_col2, quality_col3 = st.columns(3)
        
        with quality_col1:
            data_quality = results.get('data_quality_score', 0)
            quality_color = 'green' if data_quality > 0.8 else 'orange' if data_quality > 0.5 else 'red'
            st.metric(
                "📊 Data Quality Score",
                f"{data_quality:.2f}",
                help="Overall quality assessment of analysis data"
            )
        
        with quality_col2:
            processing_time = results.get('processing_time_seconds', 0)
            st.metric(
                "⏱️ Processing Time",
                f"{processing_time:.1f}s",
                help="Time taken for complete analysis"
            )
        
        with quality_col3:
            ndvi_score = results['stats'].get('ndvi_mean', 0)
            st.metric(
                "🌿 NDVI Score",
                f"{ndvi_score:.3f}",
                help="Normalized Difference Vegetation Index"
            )

    else:
        st.info("🔍 Click 'Run Enhanced Analysis' to start comprehensive agricultural monitoring")

# Auto-refresh functionality
if st.session_state.engine_status == "Ready" and 'auto_refresh' in locals() and auto_refresh:
    time.sleep(30)
    st.rerun()

# Footer
st.divider()
st.markdown("""
<div style="text-align: center; color: #666; padding: 2rem; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 15px;">
    <h4>🌾 Agricultural AI Dashboard - Integrated Version</h4>
    <p><strong>Real-time Agricultural Monitoring with AI-Powered Insights</strong></p>
    <p>Hyperspectral Analysis • Sensor Fusion • Predictive Analytics • SIH 2025 Project</p>
    <p><em>Version: Integrated v1.0 | Enhanced with Real Data Processing</em></p>
</div>
""", unsafe_allow_html=True)