# Agricultural Monitoring System - MATLAB Backend

This directory contains the MATLAB backend components for the real-time agricultural monitoring system. The backend is designed to integrate with a Python/Streamlit frontend via the MATLAB Engine.

## Project Structure

```
backend/
├── mqtt_listener.m              # MQTT subscriber for real-time sensor data
├── run_main_analysis.m          # Stubbed main analysis function (for testing)
├── run_main_analysis_final.m    # Final integrated analysis function
├── run_analysis.m              # Legacy analysis function
└── stubs/                      # Stub functions for development
    ├── analyze_image_stub.m
    └── predict_stress_stub.m
```

## Components Overview

### 1. MQTT Subscriber (`mqtt_listener.m`)

**Purpose**: Connects to a public MQTT broker and subscribes to agricultural sensor data.

**Features**:
- Connects to `broker.hivemq.com` on port 1883
- Subscribes to topic: `agri-hack/teamX/field1/sensors`
- Parses incoming JSON sensor data
- Validates sensor readings within expected ranges
- Saves latest data to `latest_sensor_data.mat` for analysis functions

**Expected JSON Format**:
```json
{
  "temperature": 25.5,
  "humidity": 65.2,
  "soil_moisture": 45.8,
  "ph": 6.5,
  "light_intensity": 850,
  "location": {"lat": 40.7128, "lon": -74.0060}
}
```

**Usage**:
```matlab
% Start MQTT listener (runs indefinitely)
mqtt_listener()

% Press Ctrl+C to stop
```

**Dependencies**:
- MATLAB IoT Toolbox (for MQTT communication)
- Internet connection to reach broker.hivemq.com

### 2. Main Analysis Functions

#### Stub Version (`run_main_analysis.m`)

**Purpose**: Placeholder implementation for frontend testing.

**Signature**:
```matlab
function [health_map, alert_message, stats] = run_main_analysis()
```

**Outputs**:
- `health_map`: 100x100 2D matrix with crop health values (0-1 scale)
- `alert_message`: Simple string alert ('Stub Data: All systems are nominal.')
- `stats`: Struct with fake sensor data and predictions (Python-compatible)

**Usage**:
```matlab
[map, alert, data] = run_main_analysis();
```

#### Final Version (`run_main_analysis_final.m`)

**Purpose**: Complete production implementation with AI integration.

**Integration Flow**:
1. Load latest sensor data from MQTT persistence layer
2. Call Aryan's AI functions (`analyze_image.m`, `predict_stress.m`)
3. Perform AI fusion and generate health map
4. Generate intelligent alerts based on combined outputs
5. Compile comprehensive statistics

**Signature**:
```matlab
function [health_map, alert_message, stats] = run_main_analysis_final()
```

**Advanced Features**:
- Real-time sensor data integration
- Multi-model AI fusion (image analysis + stress prediction + sensor data)
- Intelligent alert generation with context awareness
- Comprehensive statistics with confidence metrics
- Robust error handling with fallback modes

## AI Integration

### Image Analysis (`ai/analyze_image.m`)

**Current Status**: Enhanced stub mode (ready for Aryan's implementation)

**Interface**:
```matlab
result = analyze_image(image_path)
% Returns struct with:
% - status: 'stub_mode', 'success', or 'error'
% - health_score: 0-1 vegetation health score
% - disease_detected: boolean
% - vegetation_index: NDVI-like index
% - findings: cell array of observations
```

### Stress Prediction (`ai/predict_stress.m`)

**Current Status**: Enhanced stub mode (ready for Aryan's implementation)

**Interface**:
```matlab
result = predict_stress(sensor_data)
% Returns struct with:
% - status: 'stub_mode', 'success', or 'error'
% - stress_level: 0-1 combined stress level
% - yield_impact: predicted yield reduction
% - recommendations: actionable advice
```

## Python Integration

The MATLAB backend is designed to be called from Python using the MATLAB Engine:

```python
import matlab.engine

# Start MATLAB engine
eng = matlab.engine.start_matlab()

# Add backend directory to MATLAB path
eng.addpath('F:\\SIH 2025\\SIH-2025\\backend', nargout=0)

# Call main analysis function
health_map, alert_message, stats = eng.run_main_analysis(nargout=3)

# Convert MATLAB data to Python
health_array = np.array(health_map)
alert_str = str(alert_message)
stats_dict = {key: eng.getfield(stats, key) for key in eng.fieldnames(stats)}
```

## Data Flow

```
[MQTT Broker] → [mqtt_listener.m] → [latest_sensor_data.mat]
                                           ↓
[analyze_image.m] ←← [run_main_analysis_final.m] ←← [latest_sensor_data.mat]
[predict_stress.m] ←←                          ↓
                                    [health_map, alert, stats]
                                           ↓
                               [Python/Streamlit Frontend]
```

## Configuration

### MQTT Settings

Edit `mqtt_listener.m` to configure:
- `broker_address`: MQTT broker URL (default: 'broker.hivemq.com')
- `broker_port`: MQTT port (default: 1883)
- `topic`: Sensor data topic (default: 'agri-hack/teamX/field1/sensors')

### Sensor Validation Ranges

Modify validation ranges in `parse_sensor_json()`:
- Temperature: -50°C to 60°C
- Humidity: 0% to 100%
- Soil Moisture: 0% to 100%
- pH: 0 to 14
- Light Intensity: 0 to 2000 lux

## Development Workflow

### Phase 1: Testing (Current)
1. Use `run_main_analysis.m` (stub version) for frontend integration
2. Test Python MATLAB Engine connectivity
3. Verify data format compatibility

### Phase 2: MQTT Integration
1. Start `mqtt_listener.m` to receive real sensor data
2. Switch to `run_main_analysis_final.m` for MQTT integration
3. Test with live sensor feeds

### Phase 3: AI Integration
1. Aryan implements `analyze_image.m` with CNN model
2. Aryan implements `predict_stress.m` with LSTM model
3. Full AI fusion becomes operational

## Troubleshooting

### MQTT Issues
- **Error**: "mqttclient not found"
  - **Solution**: Install MATLAB IoT Toolbox
  
- **Error**: Connection timeout
  - **Solution**: Check internet connection and broker.hivemq.com accessibility

### Python Integration Issues
- **Error**: "MATLAB engine not found"
  - **Solution**: Install MATLAB Engine for Python: `pip install matlabengine`
  
- **Error**: Function not found
  - **Solution**: Ensure backend directory is added to MATLAB path

### Data Format Issues
- **Error**: "NaN values in output"
  - **Solution**: Check sensor data quality and validation ranges

## Performance Notes

- **MQTT Listener**: Runs continuously, minimal CPU usage when idle
- **Stub Analysis**: ~1-2 seconds execution time
- **Final Analysis**: ~3-5 seconds with AI models (estimated)
- **Memory Usage**: ~50MB for health map and statistics

## Security Considerations

- MQTT connection is unencrypted (public broker)
- For production: Use secure MQTT broker with authentication
- Validate all incoming sensor data for safety
- Consider data encryption for sensitive agricultural information

## Version History

- **v1.0**: Initial stub implementation with MQTT listener
- **v1.1**: Enhanced AI function stubs with realistic data
- **v2.0**: (Future) Full AI integration with trained models

## Contact

For technical questions about the MATLAB backend:
- MQTT Integration: Backend Team
- AI Functions: Aryan
- Python Integration: Frontend Team

## Dependencies Summary

**Required**:
- MATLAB R2019b or later
- MATLAB IoT Toolbox (for MQTT)

**Optional**:
- MATLAB Deep Learning Toolbox (for AI models)
- MATLAB Image Processing Toolbox (for image analysis)
- MATLAB Statistics and Machine Learning Toolbox (for advanced analytics)

**Python Requirements**:
- `matlabengine` package
- Compatible Python version (3.7-3.11)
