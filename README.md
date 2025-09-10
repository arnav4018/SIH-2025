# Agri-Hackathon Project

## Overview
This project is an agricultural monitoring system that combines IoT sensors, AI/ML models, and a user-friendly dashboard to monitor crop health and environmental conditions.

## Team Structure & Responsibilities
- **Frontend** (Arnav & Radhika): MATLAB App Designer UI and presentation assets
- **Backend** (Suryansh): Core orchestration and integration logic
- **AI/ML** (Aryan): Image analysis models and stress prediction algorithms  
- **Data Management** (Neha): Dataset preparation and processing
- **IoT** (Harshit): Sensor device code and data collection

## Directory Structure
```
/agri-hackathon-project
├── /frontend/              # UI components and assets
│   ├── /app_designer_files/ # MATLAB App Designer files
│   └── /assets/            # Presentation slides, wireframes
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
└── /iot/                   # IoT device code
```

## Setup Instructions
1. Clone this repository
2. Each team member should work in their designated folder
3. Create a feature branch for new work: `git checkout -b [name]/[feature]`
4. Commit frequently with clear messages
5. Submit pull requests for review before merging to main

## Current Status
🔄 Project initialized - Directory structure created

## Key Integration Points
- **JSON Data Contract**: All team members must agree on data formats between IoT → Backend → Frontend
- **Stub Functions**: Backend stubs enable parallel development while AI models are being developed
- **Git Workflow**: Use feature branches and pull requests to avoid merge conflicts

## Next Steps
1. Suryansh: Create stub functions in `/backend/stubs/`
2. Harshit: Define IoT sensor data JSON format  
3. All team members: Agree on data contracts and interfaces
4. Begin parallel development in assigned folders
