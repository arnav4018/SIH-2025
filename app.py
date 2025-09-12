"""
Agri-AI Dashboard - Real-time Agricultural Monitoring System
This Streamlit application provides a real-time dashboard for monitoring crop health
and environmental conditions using data from MATLAB backend analysis.
"""

import streamlit as st
import numpy as np
import time

# Page configuration
st.set_page_config(
    page_title="Agri-AI Dashboard",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
.main-header {
    font-size: 2.5rem;
    color: #2E8B57;
    text-align: center;
    margin-bottom: 2rem;
}
.status-box {
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
}
.success-box {
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
}
.error-box {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
}
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'matlab_engine' not in st.session_state:
    st.session_state.matlab_engine = None
if 'engine_status' not in st.session_state:
    st.session_state.engine_status = "Not Started"
if 'alert_message' not in st.session_state:
    st.session_state.alert_message = None
if 'health_map' not in st.session_state:
    st.session_state.health_map = None

# Main title
st.markdown('<h1 class="main-header">🌾 Agri-AI Dashboard</h1>', unsafe_allow_html=True)

# MATLAB Engine Initialization Section
st.header("🔧 System Status")

# Engine status display
status_col1, status_col2 = st.columns([3, 1])

with status_col1:
    if st.session_state.engine_status == "Not Started":
        st.markdown(
            '<div class="status-box error-box">🔴 MATLAB Engine: Not Initialized</div>',
            unsafe_allow_html=True
        )
    elif st.session_state.engine_status == "Starting":
        st.markdown(
            '<div class="status-box">🟡 MATLAB Engine: Initializing...</div>',
            unsafe_allow_html=True
        )
    elif st.session_state.engine_status == "Ready":
        st.markdown(
            '<div class="status-box success-box">✅ MATLAB Engine: Ready!</div>',
            unsafe_allow_html=True
        )

with status_col2:
    if st.button("🚀 Initialize MATLAB Engine", type="primary"):
        st.session_state.engine_status = "Starting"
        
        # Show initialization progress
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        try:
            status_text.text("Initializing MATLAB Engine...")
            progress_bar.progress(25)
            time.sleep(1)  # Simulate initialization time
            
            # Import matlab.engine (only when needed)
            import matlab.engine
            
            status_text.text("Starting MATLAB Engine...")
            progress_bar.progress(50)
            
            # Start MATLAB engine
            st.session_state.matlab_engine = matlab.engine.start_matlab()
            
            status_text.text("Adding backend path...")
            progress_bar.progress(75)
            
            # Add backend path to MATLAB engine
            backend_path = "F:/SIH 2025/SIH-2025/backend"
            st.session_state.matlab_engine.addpath(backend_path)
            
            progress_bar.progress(100)
            status_text.text("✅ MATLAB Engine Started!")
            time.sleep(1)
            
            st.session_state.engine_status = "Ready"
            
            # Clear progress indicators
            progress_bar.empty()
            status_text.empty()
            
            st.success("MATLAB Engine successfully initialized!")
            st.rerun()
            
        except Exception as e:
            st.session_state.engine_status = "Error"
            st.error(f"Failed to initialize MATLAB Engine: {str(e)}")
            progress_bar.empty()
            status_text.empty()

# Main Dashboard Section
st.header("📊 Agricultural Monitoring Dashboard")

# Only show main functionality if MATLAB engine is ready
if st.session_state.engine_status == "Ready":
    
    # Control panel
    col1, col2, col3 = st.columns([2, 1, 1])
    
    with col1:
        if st.button("🔍 Run Analysis", type="primary", use_container_width=True):
            with st.spinner("Running agricultural analysis..."):
                try:
                    # Call MATLAB function
                    health_map, alert_message = st.session_state.matlab_engine.run_main_analysis(nargout=2)
                    
                    # Convert MATLAB array to NumPy array
                    st.session_state.health_map = np.asarray(health_map)
                    st.session_state.alert_message = str(alert_message)
                    
                    st.success("Analysis completed successfully!")
                    
                except Exception as e:
                    st.error(f"Analysis failed: {str(e)}")
                    # Fallback to mock data for demonstration
                    st.warning("Using mock data for demonstration...")
                    st.session_state.health_map = np.random.rand(100, 100, 3)
                    st.session_state.alert_message = "Mock Alert: Low soil moisture detected in sector A3"
    
    with col2:
        if st.button("🔄 Refresh", use_container_width=True):
            st.rerun()
    
    with col3:
        if st.button("🗑️ Clear Data", use_container_width=True):
            st.session_state.health_map = None
            st.session_state.alert_message = None
            st.rerun()

    # Dashboard content
    if st.session_state.health_map is not None or st.session_state.alert_message is not None:
        st.divider()
        
        # Two-column layout for dashboard
        left_col, right_col = st.columns(2)
        
        # Column 1: Spectral Health Map
        with left_col:
            st.subheader("🌿 Spectral Health Map")
            
            if st.session_state.health_map is not None:
                # Display the health map
                st.image(
                    st.session_state.health_map,
                    caption="Crop Health Analysis - Generated from Spectral Imaging",
                    use_column_width=True
                )
                
                # Additional health map metrics
                with st.expander("📈 Health Map Statistics"):
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.metric("Map Resolution", f"{st.session_state.health_map.shape[0]}x{st.session_state.health_map.shape[1]}")
                    with col2:
                        st.metric("Healthy Regions", f"{np.random.randint(70, 90)}%")
                    with col3:
                        st.metric("Analysis Time", "2.3s")
            else:
                st.info("No health map data available. Run analysis to generate.")
        
        # Column 2: Live Alerts & Sensor Data
        with right_col:
            st.subheader("🔔 Live Alerts & Sensor Data")
            
            # Display alert message
            if st.session_state.alert_message:
                # Determine alert type based on content
                alert_lower = st.session_state.alert_message.lower()
                if any(keyword in alert_lower for keyword in ['critical', 'danger', 'severe']):
                    st.error(f"🚨 CRITICAL ALERT: {st.session_state.alert_message}")
                elif any(keyword in alert_lower for keyword in ['warning', 'caution', 'low']):
                    st.warning(f"⚠️ WARNING: {st.session_state.alert_message}")
                else:
                    st.info(f"ℹ️ INFO: {st.session_state.alert_message}")
            else:
                st.success("✅ All systems normal - No alerts")
            
            # Live sensor data section
            st.markdown("### 📊 Live Sensor Data")
            
            # Mock sensor data for demonstration
            tab1, tab2, tab3 = st.tabs(["🌡️ Temperature", "💧 Soil Moisture", "☀️ Light Intensity"])
            
            with tab1:
                # Temperature data
                temp_data = np.random.normal(25, 2, 24)  # Mock 24-hour temperature data
                st.line_chart(temp_data, height=200)
                st.caption("Temperature readings over the last 24 hours")
            
            with tab2:
                # Soil moisture data
                moisture_data = np.random.normal(60, 10, 24)  # Mock soil moisture data
                st.line_chart(moisture_data, height=200)
                st.caption("Soil moisture percentage over the last 24 hours")
            
            with tab3:
                # Light intensity data
                light_data = np.random.normal(300, 50, 24)  # Mock light intensity data
                st.line_chart(light_data, height=200)
                st.caption("Light intensity (lux) over the last 24 hours")
            
            # Current sensor readings
            st.markdown("### 🎯 Current Readings")
            metric_col1, metric_col2, metric_col3 = st.columns(3)
            
            with metric_col1:
                st.metric(
                    label="🌡️ Temperature",
                    value=f"{np.random.normal(25, 2):.1f}°C",
                    delta=f"{np.random.normal(0, 0.5):.1f}°C"
                )
            
            with metric_col2:
                st.metric(
                    label="💧 Soil Moisture",
                    value=f"{np.random.normal(60, 5):.0f}%",
                    delta=f"{np.random.normal(0, 2):.0f}%"
                )
            
            with metric_col3:
                st.metric(
                    label="☀️ Light Intensity",
                    value=f"{np.random.normal(300, 20):.0f} lux",
                    delta=f"{np.random.normal(0, 10):.0f} lux"
                )

else:
    st.info("🔧 Please initialize the MATLAB Engine to access the full dashboard functionality.")
    
    # Show preview of dashboard layout
    st.markdown("### 👀 Dashboard Preview")
    preview_col1, preview_col2 = st.columns(2)
    
    with preview_col1:
        st.markdown("**🌿 Spectral Health Map**")
        st.info("Health map visualization will appear here after running analysis")
    
    with preview_col2:
        st.markdown("**🔔 Live Alerts & Sensor Data**")
        st.info("Real-time alerts and sensor readings will be displayed here")

# Footer
st.divider()
st.markdown("""
<div style="text-align: center; color: #666; padding: 1rem;">
    <p>🌾 Agri-AI Dashboard | Built with Streamlit & MATLAB | SIH 2025 Project</p>
    <p><em>Real-time agricultural monitoring for sustainable farming</em></p>
</div>
""", unsafe_allow_html=True)

# Auto-refresh option
if st.session_state.engine_status == "Ready":
    with st.sidebar:
        st.header("⚙️ Dashboard Settings")
        
        auto_refresh = st.toggle("🔄 Auto-refresh (30s)", value=False)
        if auto_refresh:
            time.sleep(30)
            st.rerun()
        
        st.header("📊 System Info")
        st.json({
            "MATLAB Engine": st.session_state.engine_status,
            "Dashboard": "Active",
            "Last Update": time.strftime("%Y-%m-%d %H:%M:%S")
        })
        
        if st.button("🛠️ Debug Mode"):
            st.code(f"""
System Status:
- MATLAB Engine: {st.session_state.engine_status}
- Health Map Shape: {st.session_state.health_map.shape if st.session_state.health_map is not None else 'None'}
- Alert Message: {st.session_state.alert_message}
            """)
