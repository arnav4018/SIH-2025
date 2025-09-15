# AgriTech API Specification

**Version:** 1.0.0  
**Base URL:** `http://localhost:8000`  
**Protocol:** HTTP/HTTPS  
**Content-Type:** `application/json`

## Overview

The AgriTech API serves as the central communication layer between the React frontend and the MATLAB/Python backend systems. It provides RESTful endpoints for data exchange and WebSocket connections for real-time updates.

### Key Features

- **Real-time Data**: WebSocket connections for live sensor updates
- **AI Integration**: MATLAB backend analysis results
- **Device Management**: IoT sensor data collection and status monitoring
- **Alert System**: Intelligent alert generation and management
- **Historical Data**: Time-series data storage and retrieval
- **Error Handling**: Comprehensive error reporting and fallback mechanisms

---

## Authentication

Currently, the API operates without authentication for development purposes. In production, consider implementing:

- **API Keys** for service-to-service communication
- **JWT Tokens** for frontend authentication
- **Rate Limiting** to prevent abuse

---

## Base URL and Versioning

**Development:** `http://localhost:8000`  
**Production:** `https://your-domain.com`

All endpoints are prefixed with `/api` to distinguish API calls from static content.

---

## Common Data Types

### SensorReading

```json
{
  "device_id": "string",
  "timestamp": "string (ISO-8601)",
  "temperature": "number (-50 to 70)",
  "humidity": "number (0 to 100)",
  "soil_moisture": "number (0 to 100)",
  "ph_level": "number (0 to 14)",
  "light_intensity": "number (optional, ≥0)",
  "battery_level": "number (optional, 0 to 100)",
  "location": {
    "latitude": "number",
    "longitude": "number"
  }
}
```

### Alert

```json
{
  "alert_id": "string",
  "severity": "string (info|warning|error|critical)",
  "message": "string",
  "timestamp": "string (ISO-8601)",
  "device_id": "string (optional)",
  "location": {
    "latitude": "number",
    "longitude": "number"
  },
  "confidence": "number (0 to 1)"
}
```

### SystemStatus

```json
{
  "status": "string",
  "matlab_engine_status": "string",
  "connected_devices": "number",
  "last_analysis_time": "string (ISO-8601, optional)",
  "uptime_seconds": "number"
}
```

---

## Endpoints

### Health Check

#### GET `/api/health`

**Description:** Check API server health status

**Parameters:** None

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200` - Service healthy
- `503` - Service unavailable

---

### System Status

#### GET `/api/system/status`

**Description:** Get current system operational status

**Parameters:** None

**Response:**
```json
{
  "status": "operational",
  "matlab_engine_status": "ready",
  "connected_devices": 5,
  "last_analysis_time": "2024-01-15T10:25:00Z",
  "uptime_seconds": 3600
}
```

**Status Codes:**
- `200` - Success
- `500` - Internal server error

---

### Sensor Data Management

#### GET `/api/sensors/latest`

**Description:** Retrieve latest sensor data from all connected devices

**Parameters:** None

**Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "devices": [
    {
      "device_id": "FIELD1_SENSOR_001",
      "timestamp": "2024-01-15T10:29:45Z",
      "temperature": 24.5,
      "humidity": 65.2,
      "soil_moisture": 42.8,
      "ph_level": 6.8,
      "light_intensity": 850.5,
      "battery_level": 87,
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `404` - No sensor data available

#### GET `/api/sensors/{device_id}`

**Description:** Retrieve sensor data for a specific device

**Parameters:**
- `device_id` (path) - Device identifier

**Response:**
```json
{
  "device_id": "FIELD1_SENSOR_001",
  "timestamp": "2024-01-15T10:29:45Z",
  "temperature": 24.5,
  "humidity": 65.2,
  "soil_moisture": 42.8,
  "ph_level": 6.8,
  "light_intensity": 850.5,
  "battery_level": 87,
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Device not found

#### POST `/api/sensors/data`

**Description:** Submit new sensor data (typically used by MQTT forwarder)

**Request Body:**
```json
{
  "device_id": "FIELD1_SENSOR_001",
  "timestamp": "2024-01-15T10:29:45Z",
  "temperature": 24.5,
  "humidity": 65.2,
  "soil_moisture": 42.8,
  "ph_level": 6.8,
  "light_intensity": 850.5,
  "battery_level": 87,
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Sensor data received"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid data format
- `422` - Validation errors

---

### Analysis Management

#### POST `/api/analysis/run`

**Description:** Trigger a new agricultural analysis using MATLAB backend

**Request Body:**
```json
{
  "include_hyperspectral": true,
  "analysis_function": "run_main_analysis_enhanced",
  "force_refresh": false
}
```

**Response:**
```json
{
  "status": "analysis_started",
  "message": "Analysis is running in background",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200` - Analysis started successfully
- `503` - MATLAB engine not available
- `500` - Analysis startup failed

#### GET `/api/analysis/results`

**Description:** Retrieve latest analysis results

**Parameters:** None

**Response:**
```json
{
  "timestamp": "2024-01-15T10:25:00Z",
  "health_map": [[0.85, 0.92], [0.78, 0.95]],
  "statistics": {
    "temperature": 24.5,
    "humidity": 65.2,
    "soil_moisture": 42.8,
    "overall_health_score": 0.87,
    "ndvi_mean": 0.75,
    "predicted_temperature": 25.1,
    "analysis_timestamp": "2024-01-15T10:25:00Z",
    "data_source": "integrated_analysis"
  },
  "alerts": [
    {
      "alert_id": "temp_warning_001",
      "severity": "warning",
      "message": "Temperature approaching upper threshold",
      "timestamp": "2024-01-15T10:25:00Z",
      "confidence": 0.85
    }
  ],
  "confidence": 0.92
}
```

**Response (No Results):**
```json
{
  "status": "no_results",
  "message": "No analysis results available"
}
```

**Status Codes:**
- `200` - Success (results available)
- `200` - Success (no results)
- `500` - Error retrieving results

---

### Alert Management

#### GET `/api/alerts`

**Description:** Retrieve all active system alerts

**Parameters:** None

**Response:**
```json
[
  {
    "alert_id": "temp_warning_001",
    "severity": "warning",
    "message": "Temperature approaching upper threshold",
    "timestamp": "2024-01-15T10:25:00Z",
    "device_id": "FIELD1_SENSOR_001",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "confidence": 0.85
  }
]
```

**Status Codes:**
- `200` - Success (array may be empty)

#### POST `/api/alerts`

**Description:** Create a new system alert

**Request Body:**
```json
{
  "severity": "warning",
  "message": "Custom alert message",
  "timestamp": "2024-01-15T10:30:00Z",
  "device_id": "FIELD1_SENSOR_001",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "confidence": 0.90
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Alert created"
}
```

**Status Codes:**
- `200` - Alert created successfully
- `400` - Invalid alert data

#### DELETE `/api/alerts/{alert_id}`

**Description:** Dismiss/delete a specific alert

**Parameters:**
- `alert_id` (path) - Alert identifier

**Response:**
```json
{
  "status": "success",
  "message": "Alert dismissed"
}
```

**Status Codes:**
- `200` - Alert dismissed successfully
- `404` - Alert not found

---

### Historical Data

#### GET `/api/data/history`

**Description:** Retrieve historical sensor data with filtering options

**Query Parameters:**
- `device_id` (optional) - Filter by specific device
- `start_date` (optional) - Start date (ISO-8601 format)
- `end_date` (optional) - End date (ISO-8601 format)
- `limit` (optional) - Maximum number of records (default: 100)

**Example:** `GET /api/data/history?device_id=FIELD1_SENSOR_001&limit=50`

**Response:**
```json
{
  "data": [
    {
      "timestamp": "2024-01-15T10:00:00Z",
      "device_id": "FIELD1_SENSOR_001",
      "temperature": 23.5,
      "humidity": 64.1,
      "soil_moisture": 41.2,
      "ph_level": 6.9,
      "light_intensity": 820.3
    }
  ],
  "total_records": 1,
  "query_params": {
    "device_id": "FIELD1_SENSOR_001",
    "start_date": "2024-01-14T10:00:00Z",
    "end_date": "2024-01-15T10:30:00Z",
    "limit": 50
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid query parameters

---

### MQTT Integration

#### POST `/api/mqtt/sensor`

**Description:** Receive sensor data from MQTT forwarder (internal use)

**Request Body:**
```json
{
  "device_id": "FIELD1_SENSOR_001",
  "timestamp": "2024-01-15T10:29:45Z",
  "temperature": 24.5,
  "humidity": 65.2,
  "soil_moisture": 42.8,
  "ph_level": 6.8,
  "light_intensity": 850.5,
  "battery_level": 87,
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "MQTT data processed"
}
```

**Status Codes:**
- `200` - Data processed successfully
- `400` - Invalid MQTT data format

---

## WebSocket Connection

### WebSocket Endpoint: `/ws`

**Connection URL:** `ws://localhost:8000/ws`

The WebSocket connection provides real-time updates for:
- Sensor data changes
- Analysis completion
- New alerts
- System status updates

#### Connection Flow

1. **Connect:** Establish WebSocket connection
2. **Authentication:** Send initial handshake (if required)
3. **Subscribe:** Receive real-time messages
4. **Heartbeat:** Maintain connection with ping/pong

#### Message Types

##### Connection Established
```json
{
  "type": "connection_established",
  "timestamp": "2024-01-15T10:30:00Z",
  "message": "Connected to AgriTech real-time data stream"
}
```

##### Sensor Update
```json
{
  "type": "sensor_update",
  "timestamp": "2024-01-15T10:30:00Z",
  "device_id": "FIELD1_SENSOR_001",
  "data": {
    "device_id": "FIELD1_SENSOR_001",
    "timestamp": "2024-01-15T10:30:00Z",
    "temperature": 24.7,
    "humidity": 65.5,
    "soil_moisture": 43.1
  }
}
```

##### Analysis Complete
```json
{
  "type": "analysis_complete",
  "timestamp": "2024-01-15T10:30:00Z",
  "results": {
    "statistics": {
      "overall_health_score": 0.87,
      "ndvi_mean": 0.75
    },
    "alerts": [],
    "confidence": 0.92
  }
}
```

##### Analysis Error
```json
{
  "type": "analysis_error",
  "timestamp": "2024-01-15T10:30:00Z",
  "error": "MATLAB engine connection failed"
}
```

##### New Alert
```json
{
  "type": "new_alert",
  "timestamp": "2024-01-15T10:30:00Z",
  "alert": {
    "alert_id": "temp_critical_002",
    "severity": "critical",
    "message": "Critical temperature threshold exceeded",
    "timestamp": "2024-01-15T10:30:00Z",
    "confidence": 0.95
  }
}
```

##### Alert Dismissed
```json
{
  "type": "alert_dismissed",
  "timestamp": "2024-01-15T10:30:00Z",
  "alert_id": "temp_warning_001"
}
```

##### Keepalive
```json
{
  "type": "keepalive",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Client Messages

##### Ping
```json
{
  "type": "ping",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "type": "pong",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid temperature value: must be between -50 and 70",
    "details": {
      "field": "temperature",
      "value": 150,
      "constraint": "range"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Request data validation failed | 400 |
| `NOT_FOUND` | Requested resource not found | 404 |
| `MATLAB_ENGINE_ERROR` | MATLAB backend unavailable | 503 |
| `INTERNAL_ERROR` | Unexpected server error | 500 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `WEBSOCKET_ERROR` | WebSocket connection issue | 1006 |

---

## Rate Limiting

### Current Limits (Development)

- **General API:** 100 requests per minute per IP
- **WebSocket:** 1 connection per IP
- **Analysis Trigger:** 5 requests per minute per IP

### Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1642248600
```

---

## Data Validation

### Sensor Data Constraints

| Field | Type | Range | Required |
|-------|------|--------|----------|
| `device_id` | string | 1-50 chars | Yes |
| `timestamp` | ISO-8601 | Valid date | Yes |
| `temperature` | number | -50 to 70 | Yes |
| `humidity` | number | 0 to 100 | Yes |
| `soil_moisture` | number | 0 to 100 | Yes |
| `ph_level` | number | 0 to 14 | Yes |
| `light_intensity` | number | ≥ 0 | No |
| `battery_level` | number | 0 to 100 | No |
| `location.latitude` | number | -90 to 90 | No |
| `location.longitude` | number | -180 to 180 | No |

---

## Performance Considerations

### Response Times

- **Health Check:** < 50ms
- **Sensor Data:** < 200ms
- **Historical Data:** < 500ms
- **Analysis Trigger:** < 100ms (async)
- **Analysis Results:** < 300ms

### Optimization

- **Caching:** Redis for frequently accessed data
- **Database:** Indexed queries for historical data
- **WebSocket:** Connection pooling and message queuing
- **Analysis:** Background processing with result caching

---

## Security Considerations

### Current Implementation (Development)

- No authentication required
- CORS enabled for localhost origins
- Basic input validation
- Error message sanitization

### Production Recommendations

- **API Keys:** For service authentication
- **HTTPS:** SSL/TLS encryption
- **Input Validation:** Comprehensive data sanitization
- **Rate Limiting:** Per-user/API key limits
- **Logging:** Security event monitoring
- **Network:** Firewall and VPN protection

---

## Integration Examples

### React Frontend Integration

```typescript
// API Service
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000
});

// Get latest sensor data
const sensorData = await api.get('/api/sensors/latest');

// Trigger analysis
await api.post('/api/analysis/run', {
  include_hyperspectral: true,
  analysis_function: 'run_main_analysis_enhanced'
});

// WebSocket connection
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  handleRealtimeUpdate(data);
};
```

### MATLAB Backend Integration

```matlab
% Check API connectivity
api_url = 'http://localhost:8000';
response = webread([api_url, '/api/health']);

% Send analysis results
options = weboptions('MediaType', 'application/json');
results = struct('timestamp', datestr(now), 'health_map', health_data);
webwrite([api_url, '/api/analysis/results'], jsonencode(results), options);
```

### Python MQTT Forwarder

```python
import aiohttp
import json

# Forward sensor data to API
async def forward_to_api(sensor_data):
    async with aiohttp.ClientSession() as session:
        url = 'http://localhost:8000/api/mqtt/sensor'
        async with session.post(url, json=sensor_data) as response:
            return response.status == 200
```

---

## Testing

### Health Check Test

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

### WebSocket Test

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => console.log('Received:', JSON.parse(event.data));
```

---

## Changelog

### Version 1.0.0
- Initial API specification
- RESTful endpoints for sensor data and analysis
- WebSocket real-time communication
- MATLAB backend integration
- MQTT data forwarding support

---

## Support and Contact

- **Development Team:** AgriTech Innovators
- **Backend Lead:** Suryansh Kumar
- **Frontend Team:** Arnav Sharma, Radhika Patel
- **Documentation:** Updated for SIH 2025 submission

For technical support or API questions, refer to the project documentation or contact the development team.