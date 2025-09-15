"""
AgriTech API Server - Backend API Layer
=======================================

FastAPI-based API server for the AgriTech agricultural monitoring system.
Provides RESTful endpoints and WebSocket connections for the React frontend.

Features:
- RESTful API endpoints for sensor data, AI predictions, and alerts
- WebSocket support for real-time data streaming
- MATLAB backend integration
- MQTT data consumption
- Error handling and data validation

Author: AgriTech Innovators Team
Version: 1.0
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import os
import sys
from pydantic import BaseModel, Field
import matlab.engine
from pathlib import Path

# Add project paths for imports
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root / "frontend"))
sys.path.insert(0, str(project_root))

from frontend.agri_data_processor import AgriDataProcessor

# Initialize FastAPI app
app = FastAPI(
    title="AgriTech Monitoring API",
    description="Backend API for Agricultural Monitoring System",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Add CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
matlab_engine = None
data_processor = AgriDataProcessor()
connected_websockets: List[WebSocket] = []

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models for request/response validation
class SensorReading(BaseModel):
    device_id: str
    timestamp: datetime
    temperature: float = Field(..., ge=-50, le=70, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    soil_moisture: float = Field(..., ge=0, le=100, description="Soil moisture percentage")
    ph_level: float = Field(..., ge=0, le=14, description="pH level")
    light_intensity: Optional[float] = Field(None, ge=0, description="Light intensity in lux")
    battery_level: Optional[float] = Field(None, ge=0, le=100, description="Battery percentage")
    location: Optional[Dict[str, float]] = None

class SystemStatus(BaseModel):
    status: str
    matlab_engine_status: str
    connected_devices: int
    last_analysis_time: Optional[datetime]
    uptime_seconds: float

class AnalysisRequest(BaseModel):
    include_hyperspectral: bool = True
    analysis_function: str = "run_main_analysis_enhanced"
    force_refresh: bool = False

class AlertResponse(BaseModel):
    alert_id: str
    severity: str
    message: str
    timestamp: datetime
    device_id: Optional[str] = None
    location: Optional[Dict[str, float]] = None
    confidence: float

# Global state
app_start_time = datetime.now()
latest_sensor_data: Dict[str, SensorReading] = {}
system_alerts: List[AlertResponse] = []

async def initialize_matlab_engine():
    """Initialize MATLAB engine for backend processing"""
    global matlab_engine
    try:
        logger.info("Starting MATLAB engine...")
        matlab_engine = matlab.engine.start_matlab()
        
        # Add project paths
        backend_path = str(project_root / "backend")
        ai_path = str(project_root / "ai")
        matlab_engine.addpath(backend_path)
        matlab_engine.addpath(ai_path)
        
        logger.info("MATLAB engine initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize MATLAB engine: {e}")
        return False

async def broadcast_to_websockets(data: Dict[str, Any]):
    """Broadcast data to all connected WebSocket clients"""
    if connected_websockets:
        message = json.dumps(data, default=str)
        disconnected = []
        
        for websocket in connected_websockets:
            try:
                await websocket.send_text(message)
            except:
                disconnected.append(websocket)
        
        # Remove disconnected websockets
        for ws in disconnected:
            if ws in connected_websockets:
                connected_websockets.remove(ws)

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting AgriTech API Server...")
    await initialize_matlab_engine()

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "version": "1.0.0"
    }

# System status endpoint
@app.get("/api/system/status", response_model=SystemStatus)
async def get_system_status():
    """Get current system status"""
    return SystemStatus(
        status="operational",
        matlab_engine_status="ready" if matlab_engine else "not_ready",
        connected_devices=len(latest_sensor_data),
        last_analysis_time=data_processor.last_analysis_time,
        uptime_seconds=(datetime.now() - app_start_time).total_seconds()
    )

# Sensor data endpoints
@app.get("/api/sensors/latest")
async def get_latest_sensor_data():
    """Get latest sensor data from all devices"""
    return {
        "timestamp": datetime.now(),
        "devices": list(latest_sensor_data.values())
    }

@app.get("/api/sensors/{device_id}")
async def get_sensor_data(device_id: str):
    """Get sensor data for a specific device"""
    if device_id not in latest_sensor_data:
        raise HTTPException(status_code=404, detail="Device not found")
    
    return latest_sensor_data[device_id]

@app.post("/api/sensors/data")
async def receive_sensor_data(sensor_reading: SensorReading):
    """Receive new sensor data (typically from MQTT listener)"""
    latest_sensor_data[sensor_reading.device_id] = sensor_reading
    
    # Broadcast to WebSocket clients
    await broadcast_to_websockets({
        "type": "sensor_update",
        "device_id": sensor_reading.device_id,
        "data": sensor_reading.dict()
    })
    
    return {"status": "success", "message": "Sensor data received"}

# Analysis endpoints
@app.post("/api/analysis/run")
async def run_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """Trigger agricultural analysis"""
    if not matlab_engine:
        raise HTTPException(status_code=503, detail="MATLAB engine not available")
    
    try:
        # Run analysis in background
        background_tasks.add_task(perform_analysis, request.analysis_function)
        
        return {
            "status": "analysis_started",
            "message": "Analysis is running in background",
            "timestamp": datetime.now()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/analysis/results")
async def get_analysis_results():
    """Get latest analysis results"""
    if not hasattr(data_processor, 'last_results') or data_processor.last_results is None:
        return {
            "status": "no_results",
            "message": "No analysis results available"
        }
    
    results = data_processor.last_results
    return {
        "timestamp": data_processor.last_analysis_time,
        "health_map": results.get('health_map', []),
        "statistics": results.get('statistics', {}),
        "alerts": results.get('alerts', []),
        "confidence": results.get('confidence', 0.0)
    }

async def perform_analysis(analysis_function: str = "run_main_analysis_enhanced"):
    """Perform MATLAB analysis in background"""
    try:
        logger.info(f"Starting analysis with function: {analysis_function}")
        
        # Call MATLAB analysis function
        if analysis_function == "run_main_analysis_enhanced":
            health_map, alert_message, stats = matlab_engine.run_main_analysis_enhanced(nargout=3)
        else:
            health_map, alert_message, stats = matlab_engine.run_main_analysis(nargout=3)
        
        # Process results
        results = data_processor.process_matlab_results(health_map, alert_message, stats)
        data_processor.last_results = results
        data_processor.last_analysis_time = datetime.now()
        
        # Broadcast results to WebSocket clients
        await broadcast_to_websockets({
            "type": "analysis_complete",
            "timestamp": datetime.now(),
            "results": {
                "statistics": results.get('statistics', {}),
                "alerts": results.get('alerts', []),
                "confidence": results.get('confidence', 0.0)
            }
        })
        
        logger.info("Analysis completed successfully")
        
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        await broadcast_to_websockets({
            "type": "analysis_error",
            "timestamp": datetime.now(),
            "error": str(e)
        })

# Alert endpoints
@app.get("/api/alerts", response_model=List[AlertResponse])
async def get_alerts():
    """Get current system alerts"""
    return system_alerts

@app.post("/api/alerts")
async def create_alert(alert: AlertResponse):
    """Create a new system alert"""
    system_alerts.append(alert)
    
    # Broadcast alert to WebSocket clients
    await broadcast_to_websockets({
        "type": "new_alert",
        "alert": alert.dict()
    })
    
    return {"status": "success", "message": "Alert created"}

@app.delete("/api/alerts/{alert_id}")
async def dismiss_alert(alert_id: str):
    """Dismiss a system alert"""
    global system_alerts
    system_alerts = [alert for alert in system_alerts if alert.alert_id != alert_id]
    
    await broadcast_to_websockets({
        "type": "alert_dismissed",
        "alert_id": alert_id
    })
    
    return {"status": "success", "message": "Alert dismissed"}

# Historical data endpoint
@app.get("/api/data/history")
async def get_historical_data(
    device_id: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 100
):
    """Get historical sensor data"""
    # This would typically query a database
    # For now, return sample historical data
    
    if not start_date:
        start_date = datetime.now() - timedelta(days=7)
    if not end_date:
        end_date = datetime.now()
    
    # Generate sample historical data
    timestamps = pd.date_range(start_date, end_date, freq='1H')[:limit]
    
    historical_data = []
    for ts in timestamps:
        historical_data.append({
            "timestamp": ts,
            "device_id": device_id or "FIELD1_SENSOR_001",
            "temperature": 20 + 10 * np.sin(ts.hour * np.pi / 12) + np.random.normal(0, 2),
            "humidity": 60 + 20 * np.sin(ts.hour * np.pi / 12 + np.pi/2) + np.random.normal(0, 5),
            "soil_moisture": 45 + 15 * np.sin(ts.hour * np.pi / 24) + np.random.normal(0, 3)
        })
    
    return {
        "data": historical_data,
        "total_records": len(historical_data),
        "query_params": {
            "device_id": device_id,
            "start_date": start_date,
            "end_date": end_date,
            "limit": limit
        }
    }

# WebSocket endpoint for real-time data
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data streaming"""
    await websocket.accept()
    connected_websockets.append(websocket)
    
    try:
        # Send initial data
        initial_data = {
            "type": "connection_established",
            "timestamp": datetime.now(),
            "message": "Connected to AgriTech real-time data stream"
        }
        await websocket.send_text(json.dumps(initial_data, default=str))
        
        # Keep connection alive and handle messages
        while True:
            try:
                # Wait for messages from client
                message = await websocket.receive_text()
                client_data = json.loads(message)
                
                # Handle different message types
                if client_data.get("type") == "ping":
                    await websocket.send_text(json.dumps({
                        "type": "pong",
                        "timestamp": datetime.now()
                    }, default=str))
                
            except asyncio.TimeoutError:
                # Send keepalive ping
                await websocket.send_text(json.dumps({
                    "type": "keepalive",
                    "timestamp": datetime.now()
                }, default=str))
                
    except WebSocketDisconnect:
        if websocket in connected_websockets:
            connected_websockets.remove(websocket)
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        if websocket in connected_websockets:
            connected_websockets.remove(websocket)

# MQTT integration endpoint (to be called by MQTT listener)
@app.post("/api/mqtt/sensor")
async def receive_mqtt_data(data: Dict[str, Any]):
    """Receive sensor data from MQTT listener"""
    try:
        # Convert MQTT data to SensorReading
        sensor_reading = SensorReading(
            device_id=data.get("device_id", "unknown"),
            timestamp=datetime.fromisoformat(data.get("timestamp", datetime.now().isoformat())),
            temperature=data.get("temperature", 0.0),
            humidity=data.get("humidity", 0.0),
            soil_moisture=data.get("soil_moisture", 0.0),
            ph_level=data.get("ph_level", 7.0),
            light_intensity=data.get("light_intensity"),
            battery_level=data.get("battery_level"),
            location=data.get("location")
        )
        
        # Store and broadcast the data
        await receive_sensor_data(sensor_reading)
        
        return {"status": "success", "message": "MQTT data processed"}
        
    except Exception as e:
        logger.error(f"Failed to process MQTT data: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid MQTT data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)