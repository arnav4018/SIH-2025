# Agricultural Monitoring Dashboard - Frontend

This directory contains the Streamlit-based frontend for the real-time agricultural monitoring system, designed to integrate seamlessly with the MATLAB backend.

## 📁 Frontend Structure

```
F:\SIH 2025\SIH-2025\
├── app.py                      # Main Streamlit dashboard (basic version)
├── app_enhanced.py             # Enhanced dashboard with advanced features
├── requirements.txt            # Python dependencies
├── .streamlit/
│   └── config.toml            # Streamlit configuration
├── frontend/
│   ├── app_designer_files/    # MATLAB App Designer files
│   └── assets/                # Static assets (images, styles)
└── README_FRONTEND.md         # This file
```

## 🚀 Quick Start

### Prerequisites

1. **MATLAB Installation**: MATLAB R2019b or later
2. **MATLAB Engine for Python**: 
   ```bash
   cd "C:\Program Files\MATLAB\R2023a\extern\tools\python"
   python setup.py install
   ```
3. **Python Environment**: Python 3.7-3.11

### Installation Steps

1. **Clone/Navigate to Project Directory**:
   ```bash
   cd "F:\SIH 2025\SIH-2025"
   ```

2. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Dashboard**:
   ```bash
   # Basic version
   streamlit run app.py
   
   # Or enhanced version with advanced features
   streamlit run app_enhanced.py
   ```

4. **Access Dashboard**:
   Open your browser to `http://localhost:8501`

## 📱 Application Versions

### Basic Version (`app.py`)
- **Purpose**: Simple, reliable dashboard for basic monitoring
- **Features**:
  - MATLAB Engine integration
  - Basic health map visualization
  - Simple sensor data display
  - Real-time alerts
- **Best for**: Initial testing and basic monitoring needs

### Enhanced Version (`app_enhanced.py`)
- **Purpose**: Advanced dashboard with comprehensive features
- **Features**:
  - Advanced MATLAB integration (3-output functions)
  - Professional data visualizations with Plotly
  - Historical trend analysis
  - Data export functionality
  - Enhanced UI/UX with custom styling
  - Analysis mode selection (Stub/Production)
  - Comprehensive sensor data display
- **Best for**: Production use and advanced analytics

## 🎮 Dashboard Usage Guide

### 1. System Initialization
1. **Start the Dashboard**: Run `streamlit run app.py` or `app_enhanced.py`
2. **Initialize MATLAB Engine**: Click "🚀 Initialize MATLAB Engine"
3. **Wait for Ready Status**: Engine status will show "🟢 Ready" when complete

### 2. Running Analysis
1. **Select Analysis Mode** (Enhanced version only):
   - **Stub Mode**: Uses placeholder data for testing
   - **Final Mode**: Uses real AI integration with MQTT data
2. **Click "🔍 Run Analysis"**: Executes the MATLAB backend analysis
3. **View Results**: Health map, alerts, and sensor data will populate

### 3. Dashboard Features

#### Health Map Visualization
- **2D Color Map**: Shows crop health across field area
- **Color Scale**: Green (healthy) to Red (unhealthy)
- **Interactive**: Hover for detailed pixel information
- **Statistics**: Detailed analysis in expandable sections

#### Sensor Data Display
- **Current Readings**: Temperature, humidity, soil moisture, pH
- **Historical Trends**: Charts showing data over time
- **Predictions**: AI-generated forecasts (when available)
- **Real-time Updates**: Auto-refresh capabilities

#### Alert System
- **Smart Categorization**: Critical, Warning, Info levels
- **Color Coding**: Red (critical), Yellow (warning), Blue (info)
- **Actionable Messages**: Clear, specific alert descriptions

### 4. Advanced Features (Enhanced Version)

#### Analysis History
- **Trend Tracking**: View health scores over time
- **Mode Comparison**: Compare stub vs. production results
- **Performance Metrics**: Analysis timing and accuracy

#### Data Export
- **JSON Export**: Complete analysis data with timestamps
- **Downloadable Reports**: For external analysis or reporting
- **Historical Data**: Export trend data for further processing

#### System Configuration
- **Auto-refresh**: Automatic dashboard updates
- **Debug Mode**: Technical system information
- **Customizable Settings**: Adjust refresh rates and display options

## 🔧 Configuration

### Streamlit Configuration (`.streamlit/config.toml`)

```toml
[theme]
primaryColor = "#2E8B57"        # Agricultural green
backgroundColor = "#FFFFFF"      # Clean white background
secondaryBackgroundColor = "#F0F8FF"  # Light blue accent
textColor = "#262730"           # Dark gray text

[server]
port = 8501                     # Default Streamlit port
maxUploadSize = 200             # Max file upload size (MB)
```

### MATLAB Integration Settings

The dashboard automatically configures MATLAB paths:
- Backend Path: `F:\SIH 2025\SIH-2025\backend`
- AI Functions Path: `F:\SIH 2025\SIH-2025\ai`

## 📊 Data Flow

```
[User Interface] ←→ [Streamlit Dashboard] ←→ [MATLAB Engine] ←→ [MATLAB Backend]
                                                                        ↓
[Health Map Display] ←← [Python Processing] ←← [Analysis Results] ←← [AI Functions]
[Sensor Charts]                                                         ↑
[Alert System]                                                   [MQTT Data]
```

## 🎨 UI Components

### Main Dashboard Elements
- **Header**: Project branding and title
- **Status Panel**: Engine status and system health
- **Control Panel**: Analysis controls and settings
- **Metrics Row**: Key performance indicators
- **Health Map**: Central visualization component
- **Sensor Panel**: Real-time data displays
- **Alert Section**: System notifications

### Responsive Design
- **Desktop**: Full-width layout with side panels
- **Tablet**: Responsive columns adapt to screen size
- **Mobile**: Stacked layout for mobile viewing

## 🔍 Troubleshooting

### Common Issues

#### MATLAB Engine Initialization Fails
**Symptoms**: Error during engine startup
**Solutions**:
1. Verify MATLAB installation and license
2. Check MATLAB Engine for Python installation
3. Ensure Python version compatibility (3.7-3.11)
4. Run installation as administrator if needed

#### Dashboard Doesn't Load
**Symptoms**: Browser shows connection error
**Solutions**:
1. Check if port 8501 is available
2. Verify Streamlit installation: `pip install streamlit`
3. Try different port: `streamlit run app.py --server.port 8502`

#### Health Map Not Displaying
**Symptoms**: Analysis runs but no visualization
**Solutions**:
1. Check MATLAB backend function outputs
2. Verify NumPy array conversion
3. Check console for error messages
4. Try stub mode first for testing

#### Slow Performance
**Symptoms**: Dashboard takes long to respond
**Solutions**:
1. Disable auto-refresh during analysis
2. Clear browser cache
3. Check MATLAB Engine memory usage
4. Consider using stub mode for faster testing

### Debug Mode

The enhanced dashboard includes a debug mode:
```python
# Access via sidebar "🛠️ Debug Mode" button
System Status:
- MATLAB Engine: Ready/Error/Starting
- Health Map Shape: (100, 100) or None
- Alert Message: Current alert text
```

## 🔒 Security Considerations

### Data Protection
- **Local Processing**: All analysis runs locally
- **No Cloud Dependencies**: No data sent to external servers
- **Session Management**: Streamlit handles secure sessions

### Network Security
- **Local Network Only**: Dashboard accessible only on local network
- **CORS Protection**: Cross-origin requests are blocked
- **XSRF Protection**: Built-in protection against cross-site attacks

## 📈 Performance Optimization

### Memory Management
- **Session State**: Efficient storage of analysis results
- **Image Caching**: Health maps cached for faster display
- **Garbage Collection**: Automatic cleanup of old data

### Processing Optimization
- **Async Operations**: Non-blocking MATLAB calls where possible
- **Progress Indicators**: User feedback during long operations
- **Error Recovery**: Graceful handling of failed operations

## 🔄 Integration Points

### MATLAB Backend Integration
- **Function Calls**: Direct calls to MATLAB analysis functions
- **Data Conversion**: Automatic MATLAB-to-Python data conversion
- **Error Handling**: Comprehensive error catching and reporting

### Future Integrations
- **Database Connectivity**: For persistent data storage
- **API Endpoints**: For external system integration
- **Mobile App**: Responsive design ready for mobile apps

## 📝 Development Notes

### Adding New Features
1. **Backend First**: Implement MATLAB functions first
2. **Test Integration**: Use stub mode for initial testing
3. **UI Implementation**: Add Streamlit components
4. **Documentation**: Update this README with new features

### Code Structure
- **Modular Design**: Separate functions for different features
- **Error Handling**: Comprehensive try-catch blocks
- **User Experience**: Clear feedback and progress indicators
- **Performance**: Efficient data handling and caching

## 🤝 Contributing

### Code Style
- **Python**: Follow PEP 8 guidelines
- **Comments**: Clear documentation for all functions
- **Error Messages**: User-friendly error descriptions
- **Testing**: Test all new features in both modes

### Testing Checklist
- [ ] MATLAB Engine initialization works
- [ ] Both stub and final modes function correctly
- [ ] All visualizations display properly
- [ ] Error handling provides useful feedback
- [ ] Performance is acceptable for intended use

## 📞 Support

For technical issues or questions:
- **MATLAB Integration**: Check MATLAB installation and Python engine setup
- **Streamlit Issues**: Consult Streamlit documentation
- **Backend Integration**: Review MATLAB backend documentation
- **General Questions**: Check project documentation and README files

## 🚀 Future Roadmap

### Planned Features
- **Multi-field Support**: Monitor multiple agricultural areas
- **Advanced Analytics**: Statistical analysis and reporting
- **Mobile Optimization**: Enhanced mobile experience
- **Data Export**: Additional export formats (PDF, CSV)
- **User Authentication**: Multi-user support with authentication
- **Real-time Notifications**: Push notifications for critical alerts

### Version History
- **v1.0**: Basic Streamlit dashboard with MATLAB integration
- **v1.1**: Enhanced version with advanced features and improved UI
- **v2.0**: (Planned) Multi-field support and advanced analytics
