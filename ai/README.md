# AI Functions Documentation
## SIH-2025 Agricultural Monitoring System

This directory contains the upgraded AI functions for the agricultural monitoring system. All functions have been enhanced with deep learning capabilities and sophisticated analysis algorithms.

## Core Functions

### 1. `analyze_image.m`
**Purpose**: Process hyperspectral image data to generate a health map using CNN-based analysis.

**Function Signature**: 
```matlab
function health_map = analyze_image(image_data)
```

**Input**: 
- `image_data`: 3D matrix (height x width x spectral_bands) - hyperspectral image data

**Output**: 
- `health_map`: 2D matrix where each pixel represents health category
  - 1 = Healthy
  - 2 = Stressed  
  - 3 = Waterlogged

**Key Features**:
- Hyperspectral image preprocessing with noise reduction
- Calculation of vegetation indices (NDVI, GNDVI, Simple Ratio)
- 2D CNN model trained on simulated Indian Pines dataset
- Sliding window classification for pixel-level health assessment
- Automatic model training and saving for future use
- Fallback classification based on intensity analysis

**Required MATLAB Toolboxes**:
- Deep Learning Toolbox
- Image Processing Toolbox

### 2. `predict_stress.m`
**Purpose**: Predict future sensor values based on historical time-series data using LSTM networks.

**Function Signature**: 
```matlab
function prediction = predict_stress(sensor_history)
```

**Input**: 
- `sensor_history`: Time-series matrix (time_steps x features)
- Features: [temperature, humidity, soil_moisture]

**Output**: 
- `prediction`: Struct containing predicted future sensor values and trends

**Key Features**:
- Time-series data preprocessing and normalization
- LSTM network architecture for sequence prediction
- Synthetic training data generation with realistic sensor patterns
- 6-hour prediction horizon
- Trend analysis and confidence scoring
- Fallback prediction using statistical methods

**Required MATLAB Toolboxes**:
- Deep Learning Toolbox

### 3. `generate_alert.m`
**Purpose**: Combine insights from CNN and LSTM models to generate intelligent, actionable alerts.

**Function Signature**: 
```matlab
function alert_message = generate_alert(health_map, sensor_prediction, current_stats)
```

**Input**: 
- `health_map`: 2D matrix from CNN analysis
- `sensor_prediction`: Struct with LSTM predictions  
- `current_stats`: Struct with current field statistics

**Output**: 
- `alert_message`: String containing formatted alert with recommendations

**Key Features**:
- Rule-based fusion logic combining multiple data sources
- Three-tier priority system (INFO, WARNING, CRITICAL)
- Zone-specific problem identification
- Actionable recommendations based on conditions
- Confidence-based alert modifiers
- Timestamp integration

## Rule-Based Alert Logic

### Rule 1: Health Map Analysis
- **WARNING**: >25% stressed vegetation OR >15% waterlogged areas
- Identifies specific problem zones with location references

### Rule 2: Sensor Prediction Analysis
- **CRITICAL**: Predicted soil moisture <30%
- **WARNING**: Rapidly declining moisture trend
- Time-to-critical estimation

### Rule 3: Fusion Rules
- **CRITICAL**: High vegetation stress + moisture deficit
- **WARNING**: Waterlogged areas + high humidity (disease risk)
- Zone-specific irrigation recommendations

### Rule 4: Confidence Assessment
- Adjusts alert confidence based on prediction quality
- Recommends field verification for low-confidence predictions

## Example Usage

```matlab
% 1. Analyze hyperspectral image
image_data = load_hyperspectral_image('field_image.mat');
health_map = analyze_image(image_data);

% 2. Predict sensor values
sensor_history = load_sensor_data('sensor_log.csv');
sensor_prediction = predict_stress(sensor_history);

% 3. Generate intelligent alert
current_stats = struct('soil_moisture', 45, 'temperature', 28);
alert_message = generate_alert(health_map, sensor_prediction, current_stats);

fprintf('Alert: %s\n', alert_message);
```

## Model Training and Storage

### CNN Model
- **Path**: `models/hyperspectral_cnn_model.mat`
- **Architecture**: 2D CNN with batch normalization and dropout
- **Training Data**: 1000 synthetic patches simulating Indian Pines characteristics
- **Classes**: Healthy, Stressed, Waterlogged

### LSTM Model
- **Path**: `models/sensor_lstm_model.mat`
- **Architecture**: Stacked LSTM with dropout layers
- **Training Data**: 200 synthetic sensor sequences with realistic patterns
- **Features**: Temperature, Humidity, Soil Moisture

## Installation Requirements

1. **MATLAB R2020b or later**
2. **Deep Learning Toolbox**
3. **Image Processing Toolbox**
4. **Statistics and Machine Learning Toolbox** (recommended)

## Testing

Run the demonstration script to test all functions:
```matlab
run('demo_ai_functions.m')
```

This will:
- Generate synthetic test data
- Test each AI function individually
- Show sample outputs and alerts
- Verify system integration

## Integration with Backend

The functions are designed to be called by the backend orchestration script:

```matlab
% In your backend script (e.g., run_analysis.m)
try
    % Image analysis
    health_map = analyze_image(hyperspectral_data);
    
    % Sensor prediction
    prediction = predict_stress(sensor_history_data);
    
    % Alert generation
    alert = generate_alert(health_map, prediction, current_field_stats);
    
    % Send alert to dashboard/notification system
    send_alert_to_dashboard(alert);
    
catch ME
    fprintf('AI Analysis Error: %s\n', ME.message);
end
```

## Performance Considerations

- **First Run**: Model training may take 2-5 minutes per model
- **Subsequent Runs**: Fast inference using pre-trained models
- **Memory Usage**: ~100-500MB depending on image size
- **Recommended**: GPU acceleration for faster training (if available)

## Troubleshooting

### Common Issues

1. **"trainNetwork not found"**
   - Install Deep Learning Toolbox
   - Verify MATLAB version compatibility

2. **"Out of memory"** 
   - Reduce image size or patch size
   - Use fallback functions for critical systems

3. **Model training slow**
   - Enable GPU acceleration: `gpuDevice()`
   - Reduce training epochs or data size

### Fallback Mechanisms

All functions include robust fallback mechanisms:
- **CNN failure**: Intensity-based classification
- **LSTM failure**: Trend-based prediction
- **Alert failure**: Safe default warnings

## Version History

- **v2.0** (Current): Full deep learning implementation
- **v1.0**: Original stub implementation

## Contact

For technical support or feature requests, contact the development team.
