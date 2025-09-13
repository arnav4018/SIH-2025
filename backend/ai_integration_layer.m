% AI Integration Layer for SIH-2025 Agricultural Monitoring System
% Purpose: Bridge between existing backend and new AI functions
% Created for seamless integration with analyze_image.m, predict_stress.m, generate_alert.m

function ai_layer = ai_integration_layer()
    % Create AI integration layer object with all necessary functions
    
    ai_layer = struct();
    ai_layer.generate_hyperspectral_data = @generate_hyperspectral_data;
    ai_layer.prepare_sensor_history = @prepare_sensor_history;
    ai_layer.call_analyze_image = @call_analyze_image;
    ai_layer.call_predict_stress = @call_predict_stress;
    ai_layer.call_generate_alert = @call_generate_alert;
    ai_layer.convert_health_map_to_legacy = @convert_health_map_to_legacy;
    ai_layer.create_current_stats = @create_current_stats;
end

function hyperspectral_data = generate_hyperspectral_data(image_path_or_size)
    % Generate synthetic hyperspectral data when real image is not available
    % Input: image_path (string) or size (numeric array [height, width])
    
    fprintf('AI Integration: Generating synthetic hyperspectral data...\n');
    
    if ischar(image_path_or_size) && exist(image_path_or_size, 'file')
        % Try to load actual image file
        try
            img = imread(image_path_or_size);
            if size(img, 3) == 3 % RGB image
                % Convert RGB to pseudo-hyperspectral
                height = size(img, 1);
                width = size(img, 2);
                num_bands = 50;
                
                hyperspectral_data = zeros(height, width, num_bands);
                
                % Use RGB as basis for spectral bands
                for band = 1:num_bands
                    if band <= 20  % Visible spectrum
                        weight_r = max(0, 1 - abs(band - 10) / 10);
                        weight_g = max(0, 1 - abs(band - 15) / 10);
                        weight_b = max(0, 1 - abs(band - 5) / 10);
                        
                        hyperspectral_data(:, :, band) = ...
                            weight_r * double(img(:, :, 1)) + ...
                            weight_g * double(img(:, :, 2)) + ...
                            weight_b * double(img(:, :, 3));
                    else  % NIR spectrum
                        % Simulate NIR based on vegetation (green channel)
                        nir_response = double(img(:, :, 2)) * (1.2 + 0.3 * randn());
                        hyperspectral_data(:, :, band) = nir_response;
                    end
                    
                    % Normalize and add realistic noise
                    band_data = hyperspectral_data(:, :, band);
                    band_data = band_data / max(band_data(:));
                    band_data = band_data + 0.02 * randn(size(band_data));
                    hyperspectral_data(:, :, band) = max(0, min(1, band_data));
                end
                
                fprintf('   Converted RGB image to %d-band hyperspectral data\n', num_bands);
                return;
            end
        catch ME
            fprintf('   Warning: Could not process image file: %s\n', ME.message);
        end
    end
    
    % Generate synthetic hyperspectral data
    if isnumeric(image_path_or_size) && length(image_path_or_size) >= 2
        height = image_path_or_size(1);
        width = image_path_or_size(2);
    else
        height = 128;
        width = 128;
    end
    
    num_bands = 50;
    hyperspectral_data = zeros(height, width, num_bands);
    
    % Create realistic field patterns
    [X, Y] = meshgrid(1:width, 1:height);
    
    % Base vegetation pattern
    vegetation_mask = (X > width*0.2) & (X < width*0.8) & (Y > height*0.2) & (Y < height*0.8);
    
    for band = 1:num_bands
        % Create base reflectance pattern
        base_reflectance = 0.3 + 0.2 * sin(X/20) .* cos(Y/25);
        
        if band <= 30  % Visible bands
            % Lower reflectance in visible spectrum for healthy vegetation
            band_data = base_reflectance .* (0.3 + 0.2 * vegetation_mask);
        else  % NIR bands
            % Higher reflectance in NIR for healthy vegetation
            band_data = base_reflectance .* (0.7 + 0.3 * vegetation_mask);
        end
        
        % Add problem areas
        problem_area1 = ((X - width*0.3).^2 + (Y - height*0.4).^2) < (width*0.1)^2;
        problem_area2 = ((X - width*0.7).^2 + (Y - height*0.6).^2) < (width*0.08)^2;
        
        band_data(problem_area1) = band_data(problem_area1) * 0.6; % Stressed area
        band_data(problem_area2) = band_data(problem_area2) * 1.4; % Waterlogged area
        
        % Add noise and clamp
        band_data = band_data + 0.05 * randn(height, width);
        hyperspectral_data(:, :, band) = max(0, min(1, band_data));
    end
    
    fprintf('   Generated %dx%dx%d synthetic hyperspectral data\n', height, width, num_bands);
end

function sensor_history = prepare_sensor_history(sensor_data, hours_back)
    % Convert current sensor data to time-series history for LSTM
    % Input: sensor_data (struct), hours_back (integer, default 48)
    
    if nargin < 2
        hours_back = 48;
    end
    
    fprintf('AI Integration: Preparing sensor history data...\n');
    
    % Initialize history matrix (time_steps x 3 features)
    sensor_history = zeros(hours_back, 3);
    
    % Extract current values
    current_temp = get_sensor_value(sensor_data, 'temperature', 25.0);
    current_humidity = get_sensor_value(sensor_data, 'humidity', 60.0);
    current_moisture = get_sensor_value(sensor_data, 'soil_moisture', 50.0);
    
    % Generate realistic historical patterns
    time_hours = (hours_back:-1:1)'; % Most recent first
    
    % Temperature: diurnal cycle with trend
    base_temp = current_temp;
    daily_variation = 8 * sin(2*pi*time_hours/24 + pi/4); % Peak in afternoon
    random_trend = -0.1 * time_hours + 3 * randn(hours_back, 1);
    temperature_history = base_temp + daily_variation + random_trend;
    
    % Humidity: inverse correlation with temperature
    base_humidity = current_humidity;
    humidity_variation = -0.5 * daily_variation; % Inverse relationship
    humidity_noise = 5 * randn(hours_back, 1);
    humidity_history = base_humidity + humidity_variation + humidity_noise;
    humidity_history = max(20, min(95, humidity_history)); % Realistic bounds
    
    % Soil moisture: gradual decline with irrigation events
    base_moisture = current_moisture;
    gradual_decline = -0.2 * time_hours; % Gradual drying
    
    % Add periodic irrigation events (every 12-18 hours)
    irrigation_events = mod(time_hours, 15) == 0; % Irrigation every 15 hours
    irrigation_boost = irrigation_events * 15; % 15% moisture increase
    
    moisture_noise = 2 * randn(hours_back, 1);
    moisture_history = base_moisture + gradual_decline + irrigation_boost + moisture_noise;
    moisture_history = max(10, min(100, moisture_history)); % Realistic bounds
    
    % Combine into history matrix
    sensor_history(:, 1) = temperature_history;
    sensor_history(:, 2) = humidity_history;
    sensor_history(:, 3) = moisture_history;
    
    fprintf('   Created %d hours of sensor history\n', hours_back);
    fprintf('   Temperature range: %.1f - %.1f°C\n', min(temperature_history), max(temperature_history));
    fprintf('   Humidity range: %.1f - %.1f%%\n', min(humidity_history), max(humidity_history));
    fprintf('   Moisture range: %.1f - %.1f%%\n', min(moisture_history), max(moisture_history));
end

function value = get_sensor_value(sensor_data, field_name, default_value)
    % Safely extract sensor value with fallback
    if isfield(sensor_data, field_name) && ~isnan(sensor_data.(field_name))
        value = sensor_data.(field_name);
    else
        value = default_value;
    end
end

function [health_map, ai_result] = call_analyze_image(image_path_or_data)
    % Call the new analyze_image function with proper data handling
    
    fprintf('AI Integration: Calling analyze_image function...\n');
    
    try
        % Add AI functions to path
        addpath('../ai');
        
        % Prepare hyperspectral data
        if ischar(image_path_or_data)
            hyperspectral_data = generate_hyperspectral_data(image_path_or_data);
        else
            hyperspectral_data = image_path_or_data;
        end
        
        % Call the new AI function
        health_map = analyze_image(hyperspectral_data);
        
        % Create result structure compatible with existing backend
        ai_result = struct();
        ai_result.status = 'success';
        ai_result.health_map = health_map;
        ai_result.health_score = mean(health_map(:) == 1); % Fraction of healthy pixels
        ai_result.stressed_pct = mean(health_map(:) == 2) * 100;
        ai_result.waterlogged_pct = mean(health_map(:) == 3) * 100;
        ai_result.confidence = 0.85; % High confidence for new AI model
        ai_result.vegetation_index = ai_result.health_score * 0.8 + 0.1;
        ai_result.disease_detected = ai_result.health_score < 0.6;
        ai_result.disease_confidence = max(0, 1 - ai_result.health_score);
        ai_result.anomaly_count = round(ai_result.stressed_pct + ai_result.waterlogged_pct);
        ai_result.processed_regions = numel(health_map);
        
        fprintf('   Image analysis completed successfully\n');
        fprintf('   Health score: %.2f, Stressed: %.1f%%, Waterlogged: %.1f%%\n', ...
                ai_result.health_score, ai_result.stressed_pct, ai_result.waterlogged_pct);
        
    catch ME
        fprintf('   Warning: AI image analysis failed: %s\n', ME.message);
        fprintf('   Falling back to synthetic data...\n');
        
        % Generate fallback health map
        health_map = ones(64, 64);  % All healthy as fallback
        health_map(30:35, 30:35) = 2;  % Small stressed area
        
        ai_result = struct();
        ai_result.status = 'fallback';
        ai_result.health_map = health_map;
        ai_result.health_score = 0.75;
        ai_result.stressed_pct = 15.0;
        ai_result.waterlogged_pct = 5.0;
        ai_result.confidence = 0.5;
        ai_result.error_message = ME.message;
    end
end

function [prediction, ai_result] = call_predict_stress(sensor_data)
    % Call the new predict_stress function with proper data handling
    
    fprintf('AI Integration: Calling predict_stress function...\n');
    
    try
        % Add AI functions to path
        addpath('../ai');
        
        % Prepare sensor history data
        sensor_history = prepare_sensor_history(sensor_data);
        
        % Call the new AI function
        prediction = predict_stress(sensor_history);
        
        % Create result structure compatible with existing backend
        ai_result = struct();
        ai_result.status = 'success';
        ai_result.prediction = prediction;
        ai_result.stress_level = calculate_stress_level(prediction);
        ai_result.stress_score = calculate_stress_score(prediction);
        ai_result.confidence = get_prediction_field(prediction, 'confidence', 0.8);
        ai_result.yield_impact = ai_result.stress_score * 0.4; % Estimate yield impact
        
        fprintf('   Stress prediction completed successfully\n');
        fprintf('   Predicted moisture: %.1f%%, Stress level: %.2f\n', ...
                get_prediction_field(prediction, 'soil_moisture', 50), ai_result.stress_score);
        
    catch ME
        fprintf('   Warning: AI stress prediction failed: %s\n', ME.message);
        fprintf('   Falling back to sensor-based analysis...\n');
        
        % Generate fallback prediction based on current sensor data
        prediction = struct();
        prediction.soil_moisture = get_sensor_value(sensor_data, 'soil_moisture', 45);
        prediction.temperature = get_sensor_value(sensor_data, 'temperature', 26);
        prediction.humidity = get_sensor_value(sensor_data, 'humidity', 65);
        prediction.confidence = 0.6;
        
        ai_result = struct();
        ai_result.status = 'fallback';
        ai_result.prediction = prediction;
        ai_result.stress_level = 'Medium';
        ai_result.stress_score = 0.5;
        ai_result.confidence = 0.6;
        ai_result.error_message = ME.message;
    end
end

function stress_level = calculate_stress_level(prediction)
    % Convert prediction to categorical stress level
    
    if isfield(prediction, 'soil_moisture')
        moisture = prediction.soil_moisture;
        if moisture < 25
            stress_level = 'High';
        elseif moisture < 40
            stress_level = 'Medium';
        else
            stress_level = 'Low';
        end
    else
        stress_level = 'Unknown';
    end
end

function stress_score = calculate_stress_score(prediction)
    % Convert prediction to numerical stress score (0-1)
    
    score_components = [];
    
    % Soil moisture stress
    if isfield(prediction, 'soil_moisture')
        moisture = prediction.soil_moisture;
        moisture_stress = max(0, (50 - moisture) / 30); % Stress increases as moisture drops below 50%
        score_components(end+1) = moisture_stress;
    end
    
    % Temperature stress
    if isfield(prediction, 'temperature')
        temp = prediction.temperature;
        temp_stress = max(0, abs(temp - 25) / 15); % Optimal around 25°C
        score_components(end+1) = temp_stress;
    end
    
    if isempty(score_components)
        stress_score = 0.5; % Default moderate stress
    else
        stress_score = min(1, mean(score_components));
    end
end

function value = get_prediction_field(prediction, field_name, default_value)
    % Safely extract prediction field with fallback
    if isfield(prediction, field_name)
        value = prediction.(field_name);
    else
        value = default_value;
    end
end

function alert_message = call_generate_alert(health_map, sensor_prediction, current_stats)
    % Call the new generate_alert function with proper data handling
    
    fprintf('AI Integration: Calling generate_alert function...\n');
    
    try
        % Add AI functions to path
        addpath('../ai');
        
        % Call the new AI fusion function
        alert_message = generate_alert(health_map, sensor_prediction, current_stats);
        
        fprintf('   Alert generation completed successfully\n');
        
    catch ME
        fprintf('   Warning: AI alert generation failed: %s\n', ME.message);
        fprintf('   Generating fallback alert...\n');
        
        % Generate simple fallback alert
        alert_priority = 'INFO';
        alert_parts = {};
        
        % Check basic conditions
        if isfield(current_stats, 'soil_moisture') && current_stats.soil_moisture < 30
            alert_priority = 'WARNING';
            alert_parts{end+1} = 'Low soil moisture detected';
        end
        
        if isfield(current_stats, 'temperature') && current_stats.temperature > 35
            alert_priority = 'CRITICAL';
            alert_parts{end+1} = 'High temperature warning';
        end
        
        if isempty(alert_parts)
            alert_message = 'System: Field conditions appear normal';
        else
            timestamp = datestr(now, 'yyyy-mm-dd HH:MM:SS');
            alert_message = sprintf('[%s] [%s] %s', timestamp, alert_priority, strjoin(alert_parts, '. '));
        end
    end
end

function current_stats = create_current_stats(sensor_data, health_map)
    % Create current_stats structure for alert generation
    
    current_stats = struct();
    
    % Copy sensor data
    if isfield(sensor_data, 'soil_moisture')
        current_stats.soil_moisture = sensor_data.soil_moisture;
    end
    if isfield(sensor_data, 'temperature')
        current_stats.temperature = sensor_data.temperature;
    end
    if isfield(sensor_data, 'humidity')
        current_stats.humidity = sensor_data.humidity;
    end
    if isfield(sensor_data, 'ph')
        current_stats.ph = sensor_data.ph;
    end
    
    % Add health map statistics
    if exist('health_map', 'var') && ~isempty(health_map)
        current_stats.field_size = numel(health_map);
        current_stats.healthy_pixels = sum(health_map(:) == 1);
        current_stats.stressed_pixels = sum(health_map(:) == 2);
        current_stats.waterlogged_pixels = sum(health_map(:) == 3);
    end
    
    current_stats.measurement_timestamp = datestr(now, 'yyyy-mm-dd HH:MM:SS');
end

function legacy_health_map = convert_health_map_to_legacy(ai_health_map)
    % Convert new AI health map (1,2,3) to legacy format (0-1 scale)
    
    if isempty(ai_health_map)
        legacy_health_map = 0.5 * ones(100, 100); % Default moderate health
        return;
    end
    
    % Convert categorical to continuous scale
    legacy_health_map = zeros(size(ai_health_map));
    legacy_health_map(ai_health_map == 1) = 0.9;  % Healthy -> 0.9
    legacy_health_map(ai_health_map == 2) = 0.4;  % Stressed -> 0.4
    legacy_health_map(ai_health_map == 3) = 0.2;  % Waterlogged -> 0.2
    
    % Add some smooth transitions
    legacy_health_map = imgaussfilt(legacy_health_map, 0.5);
    legacy_health_map = max(0, min(1, legacy_health_map));
end
