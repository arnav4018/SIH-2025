# Agricultural Monitoring Dashboard - SIH 2025

## Overview
This project is an advanced agricultural monitoring system that combines IoT sensors, AI/ML models, and an interactive Streamlit dashboard to monitor crop health and environmental conditions in real-time.

## Team Structure & Responsibilities
- **Frontend** (Arnav & Radhika): Streamlit dashboard, MATLAB App Designer UI and presentation assets
- **Backend** (Suryansh): Core orchestration and integration logic
- **AI/ML** (Aryan): Image analysis models and stress prediction algorithms  
- **Data Management** (Neha): Dataset preparation and processing
- **IoT** (Harshit): Sensor device code and data collection

## Directory Structure
```
/SIH-2025
├── /frontend/              # Streamlit dashboard and UI components
│   ├── /.streamlit/        # Streamlit configuration
│   ├── /app_designer_files/ # MATLAB App Designer files
│   ├── /assets/            # Presentation slides, wireframes
│   ├── app.py              # Basic Streamlit dashboard
│   └── app_enhanced.py     # Enhanced dashboard with advanced features
├── /backend/               # Core application logic
│   ├── /stubs/             # Initial stub functions
│   └── run_analysis.m      # Main orchestration script
├── /ai/                    # AI/ML models and functions
│   ├── /models/            # Trained model files
│   ├── analyze_image.m     # Image analysis function
│   ├── predict_stress.m    # Stress prediction function
│   └── generate_alert.m    # Alert generation function
├── /data/                  # All datasets and processed data
│   ├── /raw/               # Original datasets
│   └── /processed/         # Cleaned and processed data
├── /iot/                   # IoT device code
├── agri_dashboard_env/     # Python virtual environment
├── start_dashboard.bat     # Quick launch script for dashboard
├── requirements.txt        # Python dependencies
└── SETUP.md               # Detailed setup instructions
```

## Quick Start

### Option 1: Quick Launch (Recommended)
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SIH-2025
   ```

2. **Run the dashboard**
   ```bash
   # Double-click start_dashboard.bat or run from command line
   start_dashboard.bat
   ```

### Option 2: Manual Setup
1. **Setup Python environment**
   ```bash
   python -m venv agri_dashboard_env
   agri_dashboard_env\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```

2. **Launch dashboard**
   ```bash
   # Basic dashboard
   streamlit run frontend/app.py
   
   # Enhanced dashboard (recommended)
   streamlit run frontend/app_enhanced.py
   ```

3. **Access the dashboard**
   - Open http://localhost:8501 in your browser

## Development Setup
1. Each team member should work in their designated folder
2. Create a feature branch for new work: `git checkout -b [name]/[feature]`
3. Commit frequently with clear messages
4. Submit pull requests for review before merging to main

## Current Status
✅ **Dashboard Operational** - Interactive Streamlit dashboard with real-time monitoring
✅ **Frontend Structure** - Organized frontend files with proper configuration
✅ **Environment Setup** - Python virtual environment and dependencies configured
🔄 **Integration in Progress** - Backend and AI model integration

## Key Integration Points
- **JSON Data Contract**: All team members must agree on data formats between IoT → Backend → Frontend
- **Stub Functions**: Backend stubs enable parallel development while AI models are being developed
- **Git Workflow**: Use feature branches and pull requests to avoid merge conflicts

## Next Steps
1. Suryansh: Create stub functions in `/backend/stubs/`
2. Harshit: Define IoT sensor data JSON format  
3. All team members: Agree on data contracts and interfaces
4. Begin parallel development in assigned folders
