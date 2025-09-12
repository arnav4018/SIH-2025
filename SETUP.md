# Agri-AI Dashboard Setup Guide

This guide will help you set up and run the Agri-AI Dashboard for agricultural monitoring.

## Prerequisites

### Required Software
1. **MATLAB** (R2019b or later) - Required for the analysis engine
2. **Python** (3.8 or later) - For the Streamlit dashboard
3. **Git** - For version control (if cloning from repository)

### Python Packages
The required Python packages are listed in `requirements.txt` and will be installed automatically.

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/arnav4018/SIH-2025.git
cd SIH-2025
```

### 2. Set Up Python Environment (Recommended)
Create a virtual environment to avoid conflicts:

```bash
# Windows
python -m venv agri_dashboard_env
agri_dashboard_env\Scripts\activate

# macOS/Linux  
python -m venv agri_dashboard_env
source agri_dashboard_env/bin/activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install MATLAB Engine for Python
If you have MATLAB installed:

```bash
# Navigate to your MATLAB installation directory
# Example path: C:\Program Files\MATLAB\R2023a\extern\engines\python
cd "C:\Program Files\MATLAB\R2023a\extern\engines\python"

# Install MATLAB Engine
python setup.py install
```

**Alternative for systems without MATLAB:**
```bash
pip install matlabengine
```

### 5. Verify MATLAB Integration (Optional)
Test MATLAB Engine connection:

```python
import matlab.engine
eng = matlab.engine.start_matlab()
print("MATLAB Engine started successfully!")
eng.quit()
```

## Running the Application

### 1. Navigate to Project Directory
```bash
cd F:\SIH\ 2025\SIH-2025
```

### 2. Start the Streamlit Dashboard
```bash
streamlit run app.py
```

### 3. Access the Dashboard
- Open your web browser
- Navigate to: `http://localhost:8501`
- The dashboard should load automatically

## Using the Dashboard

### Initial Setup
1. Click "🚀 Initialize MATLAB Engine" button
2. Wait for the engine to start (may take 30-60 seconds)
3. Once initialized, the system status will show "✅ MATLAB Engine: Ready!"

### Running Analysis
1. Click "🔍 Run Analysis" button
2. The system will process the agricultural data
3. Results will appear in two columns:
   - **Left**: Spectral Health Map visualization
   - **Right**: Live alerts and sensor data

### Dashboard Features
- **Real-time Health Maps**: Visual representation of crop health
- **Smart Alerts**: Automated warnings based on analysis
- **Sensor Data Visualization**: Live charts for temperature, soil moisture, and light intensity
- **Auto-refresh**: Optional automatic data updates
- **Debug Mode**: System diagnostics and status information

## Troubleshooting

### Common Issues

#### 1. MATLAB Engine Not Starting
**Error**: "Failed to initialize MATLAB Engine"

**Solutions**:
- Ensure MATLAB is properly installed
- Check MATLAB license is valid
- Verify MATLAB Engine for Python installation
- Try running MATLAB directly first

#### 2. Import Error: matlab.engine
**Error**: "ModuleNotFoundError: No module named 'matlab.engine'"

**Solutions**:
- Reinstall MATLAB Engine: `pip install matlabengine`
- Check Python environment is activated
- Verify MATLAB Engine installation path

#### 3. Port Already in Use
**Error**: "Port 8501 is already in use"

**Solutions**:
- Use a different port: `streamlit run app.py --server.port 8502`
- Kill existing Streamlit processes
- Restart your terminal/command prompt

#### 4. Function Not Found
**Error**: "Function 'run_main_analysis' not found"

**Solutions**:
- Ensure `backend/run_main_analysis.m` exists
- Check MATLAB can access the backend directory
- Verify file permissions

### Performance Tips

1. **MATLAB Engine**: Keep the engine running between analyses for better performance
2. **Memory Usage**: Close other applications if experiencing slowdowns
3. **Network**: Use local data sources for faster processing
4. **Browser**: Use Chrome or Firefox for best Streamlit experience

## Development Mode

For developers working on the dashboard:

### 1. Enable Debug Mode
- Click "🛠️ Debug Mode" in the sidebar
- View system status and diagnostics

### 2. Auto-refresh
- Enable "🔄 Auto-refresh (30s)" for continuous updates
- Useful for monitoring live data feeds

### 3. Code Changes
- Streamlit automatically reloads when Python files are modified
- MATLAB function changes require engine restart

## File Structure

```
SIH-2025/
├── app.py                 # Main Streamlit application
├── requirements.txt       # Python dependencies
├── SETUP.md              # This setup guide
├── backend/
│   └── run_main_analysis.m  # MATLAB analysis function
├── ai/                   # AI/ML models
├── data/                 # Datasets
├── frontend/             # Additional UI components
└── iot/                  # IoT sensor code
```

## Next Steps

1. **Customize Analysis**: Modify `backend/run_main_analysis.m` for specific agricultural requirements
2. **Add Real Data**: Connect IoT sensors and replace mock data
3. **Enhance UI**: Add more visualizations and dashboard features
4. **Deploy**: Set up production deployment with proper security

## Support

For technical support or questions:
- Check the project README.md
- Review MATLAB and Streamlit documentation
- Contact the development team

---

**Happy Farming with AI! 🌾🤖**
