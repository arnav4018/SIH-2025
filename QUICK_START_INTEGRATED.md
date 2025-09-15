# 🚀 AgriTech Integrated System - Quick Start Guide

**Complete setup guide for the React + FastAPI + MATLAB integrated agricultural monitoring system**

---

## 📋 Prerequisites

### Required Software
- **Node.js**: 16.0+ ([Download](https://nodejs.org/))
- **Python**: 3.8+ ([Download](https://python.org/))
- **MATLAB**: R2019b+ (optional, for full analysis)
- **Git**: For repository cloning

### System Requirements
- **RAM**: 8GB+ recommended
- **Storage**: 2GB+ free space
- **Network**: Internet connection for package downloads

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/SIH-2025.git
cd SIH-2025
```

### Step 2: Start Backend API Server
```bash
# Navigate to API directory
cd api

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
python app.py
```
**✅ API Server running at:** http://localhost:8000

### Step 3: Start React Frontend
```bash
# Open new terminal window
# Navigate to React frontend
cd frontend-react

# Install Node.js dependencies
npm install

# Start development server
npm start
```
**✅ React Dashboard running at:** http://localhost:3000

### Step 4: Access the Dashboard
Open your browser and navigate to:
- **🌐 Main Dashboard:** http://localhost:3000
- **📊 API Documentation:** http://localhost:8000/api/docs

---

## 🔧 Detailed Setup Instructions

### Backend API Server

#### 1. Environment Setup
```bash
# Create virtual environment (recommended)
python -m venv agritech-env

# Activate virtual environment
# Windows:
agritech-env\Scripts\activate
# Linux/Mac:
source agritech-env/bin/activate

# Install dependencies
cd api
pip install -r requirements.txt
```

#### 2. Configuration (Optional)
Create `.env` file in `/api/` directory:
```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# MATLAB Integration
MATLAB_ENGINE_ENABLED=True
MATLAB_TIMEOUT=30

# MQTT Configuration
MQTT_BROKER=broker.hivemq.com
MQTT_PORT=1883
MQTT_USERNAME=
MQTT_PASSWORD=

# Database (if implemented)
DATABASE_URL=sqlite:///./agritech.db
```

#### 3. Start Services
```bash
# Start main API server
python app.py

# In separate terminal, start MQTT forwarder (optional)
python mqtt_data_forwarder.py
```

### React Frontend

#### 1. Environment Setup
```bash
cd frontend-react

# Install all dependencies
npm install

# Optional: Install additional development tools
npm install -g @types/node typescript
```

#### 2. Environment Configuration
Create `.env` file in `/frontend-react/` directory:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws

# Development Configuration
GENERATE_SOURCEMAP=true
REACT_APP_DEBUG=true

# Feature Flags
REACT_APP_ENABLE_WEBSOCKET=true
REACT_APP_ENABLE_MOCK_DATA=false
```

#### 3. Start Development Server
```bash
# Start React development server
npm start

# Build for production (optional)
npm run build
```

### MATLAB Backend (Optional)

#### 1. Setup MATLAB Engine for Python
```bash
# Find MATLAB installation
# Windows: Usually in C:\Program Files\MATLAB\R2023a
# Linux/Mac: /usr/local/MATLAB/R2023a

# Install MATLAB Engine for Python
cd "matlabroot\extern\engines\python"
python setup.py install
```

#### 2. Test MATLAB Integration
```python
# Test MATLAB engine connectivity
import matlab.engine

# Start MATLAB engine
eng = matlab.engine.start_matlab()

# Test basic operation
result = eng.sqrt(4.0)
print(f"MATLAB sqrt(4) = {result}")

# Close engine
eng.quit()
```

---

## 🧪 Verification Tests

### API Server Tests

#### Health Check
```bash
curl -X GET http://localhost:8000/api/health
```
Expected Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

#### System Status
```bash
curl -X GET http://localhost:8000/api/system/status
```

#### WebSocket Test
```javascript
// Open browser console and run:
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onopen = () => console.log('WebSocket connected');
ws.onmessage = (event) => console.log('Received:', JSON.parse(event.data));
```

### React Frontend Tests

#### Component Tests
```bash
cd frontend-react
npm test
```

#### Build Test
```bash
npm run build
# Check for successful build in /build directory
```

#### TypeScript Check
```bash
npx tsc --noEmit
```

---

## 🔄 Development Workflow

### Starting the Full System
```bash
# Terminal 1: Start API Server
cd api && python app.py

# Terminal 2: Start MQTT Forwarder (optional)
cd api && python mqtt_data_forwarder.py

# Terminal 3: Start React Frontend
cd frontend-react && npm start

# Terminal 4: MATLAB Testing (optional)
matlab -batch "run_main_analysis_api_integrated"
```

### Development Commands

#### Backend Development
```bash
# Format code
black app.py mqtt_data_forwarder.py

# Type checking
mypy app.py

# Run tests
python -m pytest tests/
```

#### Frontend Development
```bash
# Code formatting
npm run prettier

# Linting
npm run lint

# Type checking
npm run type-check

# Component testing
npm test -- --watchAll
```

---

## 🚨 Troubleshooting

### Common Issues

#### ❌ API Server Won't Start
```bash
# Check Python version
python --version  # Should be 3.8+

# Check port availability
netstat -an | findstr :8000  # Windows
lsof -i :8000  # Linux/Mac

# Install missing dependencies
pip install -r requirements.txt
```

#### ❌ React Frontend Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16.0+

# Clear npm cache
npm cache clean --force
```

#### ❌ MATLAB Engine Connection Failed
```matlab
% Test MATLAB path
which matlab  % Should return MATLAB installation path

% Test basic MATLAB functionality
version  % Check MATLAB version

% Reinstall MATLAB Engine for Python
cd(fullfile(matlabroot,'extern','engines','python'))
system('python setup.py install')
```

#### ❌ WebSocket Connection Issues
```javascript
// Check WebSocket URL
console.log('WebSocket URL:', 'ws://localhost:8000/ws');

// Check CORS settings
// Make sure API server allows WebSocket connections

// Browser console should show connection attempts
```

### Performance Troubleshooting

#### Slow API Responses
```bash
# Check API server logs
python app.py --log-level DEBUG

# Monitor system resources
htop  # Linux/Mac
taskmgr  # Windows
```

#### React App Slow Loading
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Check for memory leaks in browser dev tools
```

---

## 📊 System Monitoring

### API Metrics
- **Health Endpoint:** http://localhost:8000/api/health
- **System Status:** http://localhost:8000/api/system/status
- **Interactive Docs:** http://localhost:8000/api/docs

### React Development Tools
- **React Developer Tools** (Browser Extension)
- **Redux DevTools** (Browser Extension)
- **Browser Network Tab** for API monitoring

### Logging

#### API Server Logs
```bash
# View real-time logs
tail -f api/agritech-api.log

# MQTT forwarder logs
tail -f api/mqtt_forwarder.log
```

#### React Console Logs
Open browser Developer Tools → Console tab

---

## 🚀 Production Deployment

### API Server Production
```bash
# Install production dependencies
pip install gunicorn

# Start with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:8000
```

### React Frontend Production
```bash
# Build for production
npm run build

# Serve static files (example with serve)
npx serve -s build -l 3000

# Or deploy to Vercel, Netlify, etc.
```

### Environment Variables for Production
```env
# API Server (.env)
API_ENV=production
DEBUG=False
CORS_ORIGINS=https://your-domain.com
DATABASE_URL=postgresql://user:pass@localhost/agritech

# React App (.env.production)
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_WS_URL=wss://your-api-domain.com/ws
```

---

## 📚 Next Steps

### For Developers
1. **Explore API Documentation:** http://localhost:8000/api/docs
2. **Review React Components:** `/frontend-react/src/components/`
3. **Understand WebSocket Messages:** See `API_SPEC.md`
4. **Customize Dashboard:** Modify React components and themes

### For Users
1. **Access Dashboard:** http://localhost:3000
2. **Monitor Real-time Data:** Check WebSocket connection status
3. **Trigger Analysis:** Use "Run Analysis" button
4. **View Historical Data:** Check trends and charts

### For Judges/Evaluators
1. **Demo Scenarios:** Test different data inputs and analysis
2. **Performance Testing:** Monitor response times and system load
3. **Integration Verification:** Test complete data flow
4. **Feature Comparison:** Compare React vs Streamlit dashboards

---

## 📞 Support

### Documentation References
- **API Documentation:** `/API_SPEC.md`
- **React Frontend Guide:** `/frontend-react/README.md`
- **MATLAB Integration:** `/backend/README.md`
- **System Architecture:** Main `/README.md`

### Development Team Contacts
- **Backend Integration:** Suryansh Kumar
- **Frontend Development:** Arnav Sharma, Radhika Patel
- **AI/ML Integration:** Aryan Singh
- **System Architecture:** Full Team

### Common Resources
- **GitHub Repository:** Project source code
- **Issue Tracker:** Report bugs and feature requests
- **Wiki/Documentation:** Detailed technical guides

---

**🌾 Ready to explore the future of agricultural monitoring! 🚀**