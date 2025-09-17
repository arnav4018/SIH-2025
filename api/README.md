# 🌐 AgriTech API Server - SIH 2025

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![WebSocket](https://img.shields.io/badge/WebSocket-Enabled-yellow.svg)](https://websockets.readthedocs.io/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green.svg)]()

High-performance **FastAPI-based backend server** for the SIH 2025 AgriTech Innovators project. This API server serves as the central communication hub between the React frontend, MATLAB backend, IoT devices, and AI models.

## 🌟 Key Features

### ⚡ **High Performance**
- **FastAPI Framework**: Modern, fast (high-performance) web framework
- **Async/Await Support**: Non-blocking operations for better concurrency
- **Automatic Documentation**: Interactive API docs with Swagger UI
- **Pydantic Integration**: Automatic request/response validation

### 🔄 **Real-time Communication**
- **WebSocket Support**: Bidirectional real-time communication
- **MQTT Integration**: IoT device data ingestion via MQTT
- **Event Broadcasting**: Live updates to connected clients
- **Connection Management**: Automatic reconnection and heartbeat

### 🧠 **AI & Backend Integration**
- **MATLAB Engine Integration**: Direct interface with MATLAB backend
- **AI Model Management**: Loading and execution of machine learning models
- **Analysis Pipeline**: Automated data processing and analysis
- **Result Caching**: Efficient storage and retrieval of analysis results

### 📊 **Data Management**
- **Multi-source Data**: Sensor data, analysis results, alerts, and metadata
- **Data Validation**: Robust input validation and sanitization  
- **Historical Storage**: Time-series data management
- **Export Capabilities**: Multiple data export formats

---

## 🚀 **Quick Start Guide**

### **🏁 For Judges & Evaluators**

#### **Option 1: Standalone API Server**
```bash
cd api
pip install -r requirements.txt
python app.py
```

🌐 **API Server**: http://localhost:8000  
📚 **API Docs**: http://localhost:8000/docs  
🔄 **WebSocket**: ws://localhost:8000/ws

#### **Option 2: With React Frontend**
```bash
# Terminal 1: Start API Server
cd api
python app.py

# Terminal 2: Start React Frontend
cd ../frontend-react
npm start
```

### **👨‍💻 For Development Team**

#### **Prerequisites**
- **Python 3.8+**: [Download here](https://python.org)
- **pip**: Python package manager
- **Virtual Environment** (recommended)

#### **Environment Setup**
```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Linux/Mac

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set environment variables (optional)
copy .env.example .env
# Edit .env with your configuration

# 4. Start development server
python app.py
```

#### **Environment Variables**
Create a `.env` file in the api directory:
```env
# Server Configuration
API_HOST=localhost
API_PORT=8000
API_DEBUG=true

# MQTT Configuration
MQTT_BROKER_HOST=localhost
MQTT_BROKER_PORT=1883
MQTT_USERNAME=
MQTT_PASSWORD=

# MATLAB Integration
MATLAB_ENGINE_ENABLED=true
MATLAB_BACKEND_PATH=../backend

# Database Configuration
DATABASE_URL=sqlite:///./agritech.db
```

---

## 📁 **Project Structure**

```
api/
├── 📋 README.md                    # This comprehensive guide
├── 🚀 app.py                       # Main FastAPI application
├── 📦 requirements.txt             # Python dependencies
├── 🔄 mqtt_data_forwarder.py      # MQTT to API bridge
├── ⚙️ .env.example                 # Environment variables template
├── 📊 models/                      # Data models and schemas
│   ├── sensor_models.py           # Sensor data models
│   ├── analysis_models.py         # AI analysis models
│   └── alert_models.py            # Alert and notification models
├── 🛣️ routes/                      # API route handlers
│   ├── sensor_routes.py           # Sensor data endpoints
│   ├── analysis_routes.py         # AI analysis endpoints
│   ├── alert_routes.py            # Alert management endpoints
│   └── websocket_routes.py        # WebSocket handlers
├── 🔧 services/                   # Business logic services
│   ├── matlab_service.py         # MATLAB backend integration
│   ├── mqtt_service.py           # MQTT client management
│   ├── analysis_service.py       # AI analysis orchestration
│   └── data_service.py           # Data processing utilities
├── 🛡️ middleware/                 # Custom middleware
│   ├── cors_middleware.py        # CORS configuration
│   ├── auth_middleware.py        # Authentication (future)
│   └── logging_middleware.py     # Request/response logging
└── 🧪 tests/                      # Test suite
    ├── test_api_endpoints.py     # API endpoint tests
    ├── test_websocket.py         # WebSocket functionality tests
    └── test_integration.py       # Integration tests
```

---

## 🌐 **API Endpoints**

### **🔍 Health & Status**

#### `GET /api/health`
Health check endpoint for monitoring
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime_seconds": 3600
}
```

#### `GET /api/system/status`
Comprehensive system status
```json
{
  "status": "operational",
  "connected_devices": 5,
  "matlab_engine_status": "ready",
  "mqtt_broker_connected": true,
  "uptime_seconds": 3600,
  "last_analysis": "2025-01-15T10:25:00Z"
}
```

### **📡 Sensor Data Management**

#### `GET /api/sensors/latest`
Latest sensor readings from all devices
```json
{
  "devices": [
    {
      "device_id": "ESP32_001",
      "timestamp": "2025-01-15T10:30:00Z",
      "temperature": 25.5,
      "humidity": 65.2,
      "soil_moisture": 45.8,
      "ph_level": 6.8,
      "light_intensity": 850,
      "battery_level": 85
    }
  ],
  "total_devices": 5,
  "last_update": "2025-01-15T10:30:00Z"
}
```

#### `GET /api/sensors/{device_id}`
Specific device sensor data
- **Parameters**: `device_id` (string)
- **Query params**: `limit`, `start_date`, `end_date`

#### `GET /api/data/history`
Historical sensor data with filtering
- **Query params**: `device_id`, `start_date`, `end_date`, `limit`, `metrics`

#### `GET /api/data/export`
Export historical data in various formats
- **Query params**: `format` (csv, json, xlsx), `date_range`, `devices`

### **🧠 AI Analysis Management**

#### `GET /api/analysis/results`
Latest AI analysis results
```json
{
  "analysis_id": "analysis_20250115_103000",
  "timestamp": "2025-01-15T10:30:00Z",
  "health_map": [[0.85, 0.92, 0.78], [0.90, 0.88, 0.95]],
  "statistics": {
    "overall_health_score": 0.89,
    "ndvi_mean": 0.75,
    "affected_area_percentage": 15.2
  },
  "confidence": 0.92,
  "recommendations": ["Increase irrigation in zone 3", "Monitor pH levels"]
}
```

#### `POST /api/analysis/run`
Trigger new AI analysis
```json
{
  "analysis_type": "full",
  "include_hyperspectral": true,
  "force_refresh": false,
  "analysis_function": "run_main_analysis_enhanced"
}
```

#### `GET /api/analysis/history`
Historical analysis results
- **Query params**: `limit`, `start_date`, `end_date`, `analysis_type`

### **🚨 Alert Management**

#### `GET /api/alerts`
Active alerts and notifications
```json
{
  "alerts": [
    {
      "alert_id": "alert_20250115_001",
      "severity": "warning",
      "message": "Soil moisture below optimal range in Zone 2",
      "timestamp": "2025-01-15T10:25:00Z",
      "device_id": "ESP32_002",
      "acknowledged": false
    }
  ],
  "total_active": 3,
  "critical_count": 0,
  "warning_count": 2,
  "info_count": 1
}
```

#### `POST /api/alerts/{alert_id}/dismiss`
Mark alert as dismissed
- **Parameters**: `alert_id` (string)

#### `GET /api/alerts/history`
Alert history with filtering
- **Query params**: `severity`, `start_date`, `end_date`, `device_id`

### **📱 Device Management**

#### `GET /api/devices`
List all connected IoT devices
```json
{
  "devices": [
    {
      "device_id": "ESP32_001",
      "device_type": "multi_sensor",
      "status": "online",
      "last_seen": "2025-01-15T10:30:00Z",
      "battery_level": 85,
      "signal_strength": -45,
      "location": {
        "latitude": 28.7041,
        "longitude": 77.1025
      }
    }
  ]
}
```

#### `GET /api/devices/{device_id}/status`
Individual device status and diagnostics
- **Parameters**: `device_id` (string)

#### `POST /api/devices/{device_id}/command`
Send command to IoT device
```json
{
  "command": "calibrate",
  "parameters": {
    "sensor_type": "ph",
    "calibration_value": 7.0
  }
}
```

---

## ⚡ **WebSocket Communication**

### **Connection Endpoint**
```
ws://localhost:8000/ws
```

### **Message Format**
```json
{
  "type": "event_type",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {},
  "device_id": "optional",
  "client_id": "optional"
}
```

### **📤 Outgoing Events (Server → Client)**

#### **Sensor Data Updates**
```json
{
  "type": "sensor_update",
  "device_id": "ESP32_001",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "temperature": 25.5,
    "humidity": 65.2,
    "soil_moisture": 45.8
  }
}
```

#### **Analysis Completion**
```json
{
  "type": "analysis_complete",
  "analysis_id": "analysis_20250115_103000",
  "timestamp": "2025-01-15T10:30:00Z",
  "results": {
    "health_score": 0.89,
    "confidence": 0.92
  }
}
```

#### **New Alert**
```json
{
  "type": "new_alert",
  "alert_id": "alert_20250115_001",
  "timestamp": "2025-01-15T10:30:00Z",
  "alert": {
    "severity": "warning",
    "message": "Temperature exceeds optimal range",
    "device_id": "ESP32_001"
  }
}
```

#### **Device Events**
```json
{
  "type": "device_connected",
  "device_id": "ESP32_003",
  "timestamp": "2025-01-15T10:30:00Z",
  "device_info": {
    "device_type": "multi_sensor",
    "battery_level": 90
  }
}
```

### **📥 Incoming Events (Client → Server)**

#### **Connection Management**
```json
{"type": "ping", "timestamp": "2025-01-15T10:30:00Z"}
{"type": "subscribe_device", "device_id": "ESP32_001"}
{"type": "unsubscribe_device", "device_id": "ESP32_001"}
```

#### **Analysis Requests**
```json
{
  "type": "request_analysis",
  "analysis_type": "quick",
  "parameters": {
    "include_hyperspectral": false
  }
}
```

---

## 🔧 **Development Guide**

### **🏗️ Architecture Patterns**

#### **Dependency Injection**
```python
from fastapi import Depends
from services.matlab_service import MATLABService

async def get_analysis_results(
    matlab_service: MATLABService = Depends()
):
    return await matlab_service.get_latest_results()
```

#### **Error Handling**
```python
from fastapi import HTTPException

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"error": "Invalid input", "detail": str(exc)}
    )
```

#### **Background Tasks**
```python
from fastapi import BackgroundTasks

@app.post("/analysis/run")
async def trigger_analysis(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_analysis_task)
    return {"message": "Analysis started"}
```

### **🔌 MQTT Integration**

#### **MQTT Data Forwarder**
```python
# mqtt_data_forwarder.py
import paho.mqtt.client as mqtt
import asyncio
import websockets

class MQTTDataForwarder:
    def __init__(self):
        self.mqtt_client = mqtt.Client()
        self.websocket_clients = set()
    
    def on_message(self, client, userdata, message):
        # Forward MQTT data to WebSocket clients
        data = json.loads(message.payload)
        asyncio.create_task(self.broadcast_to_websockets(data))
```

#### **MQTT Topics**
```
agri/sensors/+/data        # Sensor data from devices
agri/devices/+/status      # Device status updates
agri/alerts/+/new          # New alerts from devices
agri/commands/+/execute    # Commands to devices
```

### **🧠 MATLAB Integration**

#### **MATLAB Engine Service**
```python
import matlab.engine

class MATLABService:
    def __init__(self):
        self.engine = None
        
    async def start_engine(self):
        self.engine = matlab.engine.start_matlab()
        self.engine.addpath('../backend')
        
    async def run_analysis(self, analysis_type: str):
        if analysis_type == "enhanced":
            result = self.engine.run_main_analysis_enhanced(nargout=3)
        return result
```

### **📊 Data Models**

#### **Sensor Data Model**
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SensorReading(BaseModel):
    device_id: str
    timestamp: datetime
    temperature: float
    humidity: float
    soil_moisture: float
    ph_level: float
    light_intensity: Optional[float] = None
    battery_level: Optional[float] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
```

#### **Analysis Result Model**
```python
class AnalysisResult(BaseModel):
    analysis_id: str
    timestamp: datetime
    health_map: List[List[float]]
    statistics: Dict[str, float]
    confidence: float
    recommendations: List[str]
```

---

## 🧪 **Testing**

### **Unit Testing**
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_api_endpoints.py -v
```

### **Integration Testing**
```bash
# Test with MATLAB backend
pytest tests/test_matlab_integration.py

# Test MQTT communication
pytest tests/test_mqtt_integration.py

# Test WebSocket functionality
pytest tests/test_websocket.py
```

### **API Testing**
```bash
# Test API endpoints manually
curl -X GET http://localhost:8000/api/health
curl -X GET http://localhost:8000/api/sensors/latest
curl -X POST http://localhost:8000/api/analysis/run -H "Content-Type: application/json" -d '{"analysis_type": "quick"}'
```

---

## 🚀 **Production Deployment**

### **🐳 Docker Deployment**

#### **Dockerfile**
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### **Docker Compose**
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - API_DEBUG=false
      - DATABASE_URL=postgresql://user:pass@db:5432/agritech
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: agritech
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:6-alpine
```

### **☁️ Cloud Deployment**

#### **Vercel Deployment**
```bash
pip install vercel
vercel --prod
```

#### **Heroku Deployment**
```bash
# Procfile
web: uvicorn app:app --host 0.0.0.0 --port $PORT

# Deploy
git push heroku main
```

#### **AWS Lambda (with Mangum)**
```python
from mangum import Mangum
from app import app

handler = Mangum(app)
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **MATLAB Engine Connection**
```
Error: MATLAB engine failed to start
```
**Solutions**:
1. Verify MATLAB installation and license
2. Check MATLAB Engine for Python installation
3. Ensure Python version compatibility
4. Try starting MATLAB manually first

#### **MQTT Connection Issues**
```
Error: MQTT broker connection failed
```
**Solutions**:
1. Verify MQTT broker is running
2. Check network connectivity and firewall
3. Validate MQTT credentials
4. Test with MQTT client tools

#### **WebSocket Connection Drops**
```
WebSocket connection closed unexpectedly
```
**Solutions**:
1. Implement heartbeat/ping mechanism
2. Add connection retry logic
3. Check proxy/firewall WebSocket support
4. Monitor server resource usage

#### **High Memory Usage**
**Solutions**:
- Implement connection pooling
- Add data pagination for large datasets
- Use background tasks for heavy operations
- Monitor and clean up unused connections

### **🔍 Debug Mode**

#### **Enable Debug Logging**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

#### **API Request Logging**
```python
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url} - {process_time:.3f}s")
    return response
```

---

## 📈 **Performance Optimization**

### **⚡ Built-in Optimizations**
- **Async/Await**: Non-blocking I/O operations
- **Connection Pooling**: Efficient database connections
- **Response Caching**: Redis-based result caching
- **Background Tasks**: Heavy operations in background
- **Data Compression**: Gzip compression for responses

### **📊 Monitoring**
```python
from prometheus_client import Counter, Histogram
import time

REQUEST_COUNT = Counter('api_requests_total', 'Total API requests')
REQUEST_LATENCY = Histogram('api_request_duration_seconds', 'API request latency')

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    REQUEST_COUNT.inc()
    start_time = time.time()
    response = await call_next(request)
    REQUEST_LATENCY.observe(time.time() - start_time)
    return response
```

### **🎯 Performance Targets**
- **Response Time**: < 100ms for simple queries
- **Throughput**: > 1000 requests/second
- **WebSocket**: < 10ms message propagation
- **Analysis**: < 30s for complete analysis
- **Memory**: < 512MB baseline usage

---

## 🤝 **Contributing & Support**

### **👥 Team Members**
- **Suryansh Kumar**: Backend Development & API Architecture
- **Arnav Sharma**: Frontend Integration
- **Aryan Singh**: AI/ML Integration
- **Harshit Malhotra**: IoT/MQTT Integration

### **📞 Getting Help**
- **📚 Documentation**: Comprehensive guides in each directory
- **🐛 Issue Tracking**: GitHub Issues for bug reports
- **💬 Team Communication**: Daily standups and collaboration

### **📄 Related Documentation**
- **[🏠 Main Project README](../README.md)**: Complete system overview
- **[⚛️ React Frontend](../frontend-react/README.md)**: Frontend documentation
- **[🧠 AI Integration](../ai/README_ENHANCED.md)**: AI/ML model details
- **[📱 IoT Guide](../iot/README.md)**: IoT device integration

---

## 📄 **License & Acknowledgments**

### **📜 License**
This project is part of the **SIH 2025 AgriTech Innovators** submission and follows the project's licensing terms.

### **🙏 Acknowledgments**
- **Smart India Hackathon 2025** for the platform and challenge
- **FastAPI Community** for the excellent framework
- **Python Ecosystem** for powerful libraries and tools
- **Open Source Contributors** for all the amazing packages

---

**🌾 Built with ❤️ by the AgriTech Innovators Team | SIH 2025 | FastAPI Backend 🚀**