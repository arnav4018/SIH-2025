% Demo Script for Integrated AI Agricultural Monitoring System
% Shows how to run the complete system with new AI functions
% Created for SIH-2025

fprintf('=== INTEGRATED AI AGRICULTURAL MONITORING DEMO ===\n');
fprintf('Demonstrating complete pipeline with CNN, LSTM, and Fusion Logic\n\n');

%% Step 1: Create sample sensor data (simulating MQTT input)
fprintf('Step 1: Creating sample sensor data...\n');

sensor_data = struct();
sensor_data.temperature = 28.3;           % °C
sensor_data.humidity = 72.5;              % %
sensor_data.soil_moisture = 38.2;         % % (getting low)
sensor_data.ph = 6.9;                     % pH
sensor_data.light_intensity = 920;        % lux
sensor_data.latitude = 40.7128;           % GPS coordinates
sensor_data.longitude = -74.0060;
sensor_data.timestamp = datetime('now');
sensor_data.data_quality = 0.92;          % High quality data
sensor_data.data_source = 'demo_mqtt_simulation';

% Save as MQTT would
save('latest_sensor_data.mat', 'sensor_data');

fprintf('   ✓ Sensor data created: %.1f°C, %.1f%% humidity, %.1f%% moisture\n', ...
        sensor_data.temperature, sensor_data.humidity, sensor_data.soil_moisture);

%% Step 2: Run the integrated AI analysis
fprintf('\nStep 2: Running integrated AI analysis pipeline...\n');

try
    % This will now use the new AI functions with CNN, LSTM, and fusion logic
    [health_map, alert_message, stats] = run_main_analysis_final();
    
    fprintf('   ✓ Analysis completed successfully!\n');
    
    %% Step 3: Display Results
    fprintf('\nStep 3: Analysis Results\n');
    fprintf('========================\n');
    
    % Health Map Statistics
    fprintf('HEALTH MAP (AI CNN Analysis):\n');
    fprintf('  Overall Health Score: %.2f/1.00\n', stats.overall_health_score);
    fprintf('  Healthy Areas: %.1f%%\n', stats.ai_healthy_pct);
    fprintf('  Stressed Areas: %.1f%%\n', stats.ai_stressed_pct);
    fprintf('  Waterlogged Areas: %.1f%%\n', stats.ai_waterlogged_pct);
    
    % Sensor Predictions
    fprintf('\nSENSOR PREDICTIONS (AI LSTM Analysis):\n');
    fprintf('  Current Soil Moisture: %.1f%%\n', stats.soil_moisture);
    fprintf('  Predicted Soil Moisture: %.1f%%\n', stats.predicted_soil_moisture);
    fprintf('  Current Temperature: %.1f°C\n', stats.temperature);
    fprintf('  Predicted Temperature: %.1f°C\n', stats.predicted_temperature);
    fprintf('  Prediction Confidence: %.1f%%\n', stats.prediction_confidence * 100);
    
    % AI Model Performance
    fprintf('\nAI MODEL PERFORMANCE:\n');
    fprintf('  AI Confidence: %.1f%%\n', stats.ai_confidence * 100);
    fprintf('  Sensor Data Weight: %.1f%%\n', stats.sensor_weight * 100);
    fprintf('  Image Analysis Weight: %.1f%%\n', stats.image_weight * 100);
    fprintf('  Stress Prediction Weight: %.1f%%\n', stats.stress_weight * 100);
    
    % Alert Information
    fprintf('\nALERT SYSTEM (AI Fusion Logic):\n');
    fprintf('  Alert Level: %s\n', stats.alert_level);
    fprintf('  Generated Alert:\n');
    fprintf('  %s\n', alert_message);
    
    % System Information
    fprintf('\nSYSTEM INFO:\n');
    fprintf('  Analysis Version: %s\n', stats.version);
    fprintf('  Data Source: %s\n', stats.data_source);
    fprintf('  Analysis Time: %s\n', stats.analysis_timestamp);
    fprintf('  Image Analysis Status: %s\n', stats.image_analysis_status);
    fprintf('  Stress Analysis Status: %s\n', stats.stress_analysis_status);
    
    %% Step 4: Demonstrate Advanced Features
    fprintf('\nStep 4: Advanced AI Features\n');
    fprintf('============================\n');
    
    % Show vegetation index
    fprintf('VEGETATION ANALYSIS:\n');
    fprintf('  Vegetation Index: %.3f\n', stats.vegetation_index);
    fprintf('  Disease Detected: %s\n', logical_to_string(stats.disease_detected));
    fprintf('  Anomaly Count: %d\n', stats.anomaly_count);
    
    % Show stress analysis
    fprintf('\nSTRESS ANALYSIS:\n');
    fprintf('  Stress Level: %s\n', stats.stress_level);
    fprintf('  Stress Score: %.2f/1.00\n', stats.stress_score);
    fprintf('  Estimated Yield Impact: %.1f%%\n', stats.yield_impact * 100);
    
    % Show trends
    if isfield(stats, 'moisture_trend')
        fprintf('\nTREND ANALYSIS:\n');
        fprintf('  Moisture Trend: %.2f %%/day\n', stats.moisture_trend);
        fprintf('  Temperature Trend: %.2f °C/day\n', stats.temperature_trend);
    end
    
    %% Step 5: Show Health Map Visualization Info
    fprintf('\nStep 5: Health Map Visualization Data\n');
    fprintf('=====================================\n');
    fprintf('Health map dimensions: %dx%d pixels\n', size(health_map, 1), size(health_map, 2));
    fprintf('Health value range: %.3f - %.3f\n', min(health_map(:)), max(health_map(:)));
    fprintf('Critical areas (health < 0.3): %d pixels\n', stats.critical_areas_count);
    
    % Suggest actions based on analysis
    fprintf('\nRECOMMENDED ACTIONS:\n');
    suggest_actions(stats, alert_message);
    
    fprintf('\n=== DEMO COMPLETED SUCCESSFULLY ===\n');
    fprintf('The integrated AI system is working with:\n');
    fprintf('✓ CNN-based hyperspectral image analysis\n');
    fprintf('✓ LSTM-based sensor prediction\n');
    fprintf('✓ AI fusion logic for intelligent alerts\n');
    fprintf('✓ Comprehensive health mapping\n');
    fprintf('✓ Zone-specific recommendations\n');
    
catch ME
    fprintf('❌ Demo failed: %s\n', ME.message);
    fprintf('Error in: %s (line %d)\n', ME.stack(1).name, ME.stack(1).line);
    
    % Show fallback information
    fprintf('\nFallback information:\n');
    fprintf('- Make sure you have the required MATLAB toolboxes:\n');
    fprintf('  * Deep Learning Toolbox\n');
    fprintf('  * Image Processing Toolbox\n');
    fprintf('- The system will use fallback methods if AI functions fail\n');
end

%% Cleanup
if exist('latest_sensor_data.mat', 'file')
    delete('latest_sensor_data.mat');
end

function str = logical_to_string(logical_val)
    if logical_val
        str = 'Yes';
    else
        str = 'No';
    end
end

function suggest_actions(stats, alert_message)
    % Suggest actions based on analysis results
    
    actions = {};
    
    % Check moisture levels
    if stats.soil_moisture < 30
        actions{end+1} = '💧 URGENT: Activate irrigation system immediately';
    elseif stats.soil_moisture < 40
        actions{end+1} = '💧 Monitor soil moisture closely, prepare irrigation';
    end
    
    % Check predictions
    if stats.predicted_soil_moisture < 35
        actions{end+1} = '📈 Predicted moisture drop - schedule preventive irrigation';
    end
    
    % Check disease
    if stats.disease_detected
        actions{end+1} = '🔬 Conduct field inspection for disease symptoms';
        actions{end+1} = '🧪 Consider soil and plant tissue testing';
    end
    
    % Check stressed areas
    if stats.ai_stressed_pct > 20
        actions{end+1} = sprintf('📍 Investigate %d%% of field showing stress', round(stats.ai_stressed_pct));
    end
    
    % Check waterlogged areas
    if stats.ai_waterlogged_pct > 10
        actions{end+1} = sprintf('🌊 Improve drainage in %d%% waterlogged areas', round(stats.ai_waterlogged_pct));
    end
    
    % Temperature concerns
    if stats.temperature > 35
        actions{end+1} = '🌡️ Consider shade structures or cooling strategies';
    end
    
    % Data quality
    if stats.ai_confidence < 0.7
        actions{end+1} = '📡 Check sensor connectivity and calibration';
    end
    
    % Show actions
    if isempty(actions)
        fprintf('✅ No immediate actions required - field conditions are good!\n');
    else
        for i = 1:length(actions)
            fprintf('%d. %s\n', i, actions{i});
        end
    end
    
    % Show next monitoring schedule
    fprintf('\nNEXT MONITORING:\n');
    fprintf('📅 Recommended next analysis: %s\n', datestr(now + hours(6), 'yyyy-mm-dd HH:MM'));
    if stats.alert_level == "CRITICAL"
        fprintf('⏰ Due to critical conditions, monitor every 2 hours\n');
    elseif stats.alert_level == "WARNING"
        fprintf('⏰ Due to warning conditions, monitor every 4 hours\n');
    else
        fprintf('⏰ Standard monitoring: every 6-8 hours\n');
    end
end
