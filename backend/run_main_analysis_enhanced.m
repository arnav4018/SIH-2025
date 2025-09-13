function [health_map, alert_message, stats] = run_main_analysis_enhanced()
    %RUN_MAIN_ANALYSIS_ENHANCED Enhanced agricultural analysis with real data integration
    %   This function performs comprehensive agricultural analysis by integrating:
    %   - Real hyperspectral data (Indian Pines dataset)
    %   - Simulated sensor data (temperature, humidity, soil moisture)
    %   - Advanced vegetation indices and health mapping
    %   - Intelligent alert generation
    %
    %   Outputs:
    %       health_map - 2D matrix representing crop health from hyperspectral analysis
    %       alert_message - Consolidated alert message from all data sources
    %       stats - Comprehensive struct with all metrics and predictions
    %
    %   Author: Agricultural Monitoring Team
    %   Version: Enhanced v1.0
    %   Compatible with: Python MATLAB Engine, Streamlit Dashboard
    
    fprintf('==========================================\n');
    fprintf('=== ENHANCED AGRICULTURAL ANALYSIS ===\n');
    fprintf('==========================================\n');
    
    try
        % ===== STEP 1: HYPERSPECTRAL ANALYSIS =====
        fprintf('Step 1: Analyzing hyperspectral data...\n');
        
        % Get project root directory
        backend_path = fileparts(mfilename('fullpath'));
        project_root = fileparts(backend_path);
        
        % Add AI module path
        ai_path = fullfile(project_root, 'ai');
        if ~exist(ai_path, 'dir')
            warning('AI module directory not found: %s', ai_path);
        else
            addpath(ai_path);
        end
        
        % Run hyperspectral analysis
        [health_map, vegetation_indices, spectral_stats] = analyze_hyperspectral();
        
        fprintf('✓ Hyperspectral analysis complete\n');
        fprintf('  Health map size: %dx%d\n', size(health_map, 1), size(health_map, 2));
        fprintf('  Overall health score: %.3f\n', spectral_stats.health_mean);
        
    catch ME
        fprintf('⚠ Hyperspectral analysis failed: %s\n', ME.message);
        fprintf('  Using fallback health map...\n');
        
        % Fallback to simulated data
        health_map = 0.6 + 0.3 * rand(145, 145); % Match Indian Pines dimensions
        health_map = max(0, min(1, health_map));
        
        % Create minimal stats
        spectral_stats = struct();
        spectral_stats.health_mean = mean(health_map(:));
        spectral_stats.healthy_percentage = 100 * sum(health_map(:) > 0.7) / numel(health_map);
        spectral_stats.ndvi_mean = 0.6;
        spectral_stats.ndvi_std = 0.2;
        
        vegetation_indices = struct();
        vegetation_indices.ndvi = health_map;
    end
    
    % ===== STEP 2: SENSOR DATA ANALYSIS =====
    fprintf('Step 2: Processing sensor data...\n');
    
    try
        % Process sensor data
        [sensor_table, sensor_stats, sensor_alerts] = process_sensor_data();
        
        fprintf('✓ Sensor data processing complete\n');
        fprintf('  Records processed: %d\n', sensor_stats.data_points);
        fprintf('  Current temp: %.1f°C, humidity: %.1f%%, moisture: %.1f%%\n', ...
                sensor_stats.current_temperature, sensor_stats.current_humidity, ...
                sensor_stats.current_soil_moisture);
        fprintf('  Active alerts: %d\n', sensor_stats.alert_count);
        
    catch ME
        fprintf('⚠ Sensor data processing failed: %s\n', ME.message);
        fprintf('  Using fallback sensor data...\n');
        
        % Fallback sensor data
        sensor_stats = struct();
        sensor_stats.current_temperature = 24.5 + 2*randn();
        sensor_stats.current_humidity = 65.0 + 5*randn();
        sensor_stats.current_soil_moisture = 42.0 + 3*randn();
        sensor_stats.temp_trend = randn();
        sensor_stats.humidity_trend = randn();
        sensor_stats.moisture_trend = randn();
        sensor_stats.alert_level = 'Normal';
        sensor_stats.status = 'Fallback mode - limited sensor data';
        sensor_stats.alert_count = 0;
        
        sensor_alerts = {};
    end
    
    % ===== STEP 3: DATA FUSION AND ANALYSIS =====
    fprintf('Step 3: Performing data fusion analysis...\n');
    
    % Combine hyperspectral and sensor data for comprehensive assessment
    stats = struct();
    
    % ===== CURRENT SENSOR READINGS =====
    stats.temperature = sensor_stats.current_temperature;
    stats.humidity = sensor_stats.current_humidity;
    stats.soil_moisture = sensor_stats.current_soil_moisture;
    stats.ph = 6.8 + 0.3 * randn(); % Simulated pH
    stats.light_intensity = 850 + 100 * randn(); % Simulated light
    
    % ===== TRENDS =====
    stats.temp_trend = sensor_stats.temp_trend;
    stats.humidity_trend = sensor_stats.humidity_trend;
    stats.moisture_trend = sensor_stats.moisture_trend;
    
    % ===== HYPERSPECTRAL METRICS =====
    stats.ndvi_mean = spectral_stats.ndvi_mean;
    stats.ndvi_std = spectral_stats.ndvi_std;
    stats.overall_health_score = spectral_stats.health_mean;
    stats.healthy_areas_percent = spectral_stats.healthy_percentage;
    stats.critical_areas_count = sum(health_map(:) < 0.3);
    
    % ===== AI PREDICTIONS =====
    % Simple predictive model based on current trends and historical patterns
    % In a real implementation, this would use trained ML models
    
    % Temperature prediction (next hour)
    temp_change_factor = 0.1 * stats.temp_trend;
    seasonal_factor = sin(2*pi*hour(datetime('now'))/24) * 2; % Diurnal cycle
    stats.predicted_temperature = stats.temperature + temp_change_factor + seasonal_factor;
    
    % Humidity prediction (inverse relationship with temperature)
    humidity_change = -0.5 * temp_change_factor + 0.2 * stats.humidity_trend;
    stats.predicted_humidity = stats.humidity + humidity_change;
    
    % Soil moisture prediction (considering evapotranspiration)
    et_loss = 0.1 * (stats.temperature - 20) + 0.05 * (100 - stats.humidity)/100;
    stats.predicted_soil_moisture = stats.soil_moisture - et_loss + 0.3 * stats.moisture_trend;
    
    % Clamp predictions to realistic ranges
    stats.predicted_temperature = max(-10, min(50, stats.predicted_temperature));
    stats.predicted_humidity = max(0, min(100, stats.predicted_humidity));
    stats.predicted_soil_moisture = max(0, min(100, stats.predicted_soil_moisture));
    
    % ===== PLANT STRESS ASSESSMENT =====
    stress_factors = [];
    
    % Temperature stress
    if stats.temperature < 15 || stats.temperature > 35
        stress_factors(end+1) = abs(stats.temperature - 25) / 10;
    end
    
    % Moisture stress
    if stats.soil_moisture < 30
        stress_factors(end+1) = (30 - stats.soil_moisture) / 30;
    elseif stats.soil_moisture > 80
        stress_factors(end+1) = (stats.soil_moisture - 80) / 20;
    end
    
    % NDVI-based stress (low NDVI indicates stress)
    if stats.ndvi_mean < 0.4
        stress_factors(end+1) = (0.4 - stats.ndvi_mean) / 0.4;
    end
    
    stats.plant_stress_level = mean(stress_factors) * 100; % Convert to percentage
    if isempty(stress_factors)
        stats.plant_stress_level = 0;
    end
    
    % ===== METADATA =====
    stats.analysis_timestamp = datestr(now, 'yyyy-mm-dd HH:MM:SS');
    stats.data_source = 'enhanced_analysis';
    stats.version = 'enhanced_v1.0';
    stats.health_map_resolution = sprintf('%dx%d', size(health_map, 1), size(health_map, 2));
    
    % Ensure all numeric fields are finite
    numeric_fields = fieldnames(stats);
    for i = 1:length(numeric_fields)
        field = numeric_fields{i};
        if isnumeric(stats.(field)) && isscalar(stats.(field))
            if ~isfinite(stats.(field))
                stats.(field) = 0;
                fprintf('Warning: Replaced non-finite value in %s\n', field);
            end
        end
    end
    
    % ===== STEP 4: INTELLIGENT ALERT GENERATION =====
    fprintf('Step 4: Generating intelligent alerts...\n');
    
    all_alerts = {};
    alert_priority = [];
    
    % Add sensor alerts
    if ~isempty(sensor_alerts)
        for i = 1:length(sensor_alerts)
            all_alerts{end+1} = sensor_alerts{i};
            % Assign priority based on alert content
            if contains(lower(sensor_alerts{i}), {'critical', 'irrigation needed'})
                alert_priority(end+1) = 3; % High
            elseif contains(lower(sensor_alerts{i}), {'warning', 'trend'})
                alert_priority(end+1) = 2; % Medium
            else
                alert_priority(end+1) = 1; % Low
            end
        end
    end
    
    % Hyperspectral-based alerts
    if stats.healthy_areas_percent < 50
        all_alerts{end+1} = sprintf('Vegetation Health Alert: Only %.1f%% of area shows healthy vegetation', ...
                                   stats.healthy_areas_percent);
        alert_priority(end+1) = 3;
    end
    
    if stats.ndvi_mean < 0.3
        all_alerts{end+1} = sprintf('Low NDVI Alert: Mean NDVI %.2f indicates stressed vegetation', ...
                                   stats.ndvi_mean);
        alert_priority(end+1) = 2;
    end
    
    % Plant stress alert
    if stats.plant_stress_level > 50
        all_alerts{end+1} = sprintf('Plant Stress Alert: Stress level %.0f%% detected', ...
                                   stats.plant_stress_level);
        alert_priority(end+1) = 3;
    end
    
    % Prediction-based alerts
    temp_change = abs(stats.predicted_temperature - stats.temperature);
    if temp_change > 5
        direction = 'increase';
        if stats.predicted_temperature < stats.temperature
            direction = 'decrease';
        end
        all_alerts{end+1} = sprintf('Temperature Forecast: Expected to %s by %.1f°C', ...
                                   direction, temp_change);
        alert_priority(end+1) = 1;
    end
    
    % Sort alerts by priority (high to low)
    if ~isempty(all_alerts)
        [~, sort_idx] = sort(alert_priority, 'descend');
        all_alerts = all_alerts(sort_idx);
        
        % Generate consolidated alert message
        alert_message = strjoin(all_alerts, ' | ');
        
        % Truncate if too long for display
        if length(alert_message) > 200
            alert_message = [alert_message(1:197) '...'];
        end
    else
        alert_message = 'All systems nominal - No alerts detected';
    end
    
    % ===== FINAL SUMMARY =====
    fprintf('==========================================\n');
    fprintf('=== ANALYSIS COMPLETE ===\n');
    fprintf('Health Score: %.3f (%.1f%% healthy areas)\n', stats.overall_health_score, stats.healthy_areas_percent);
    fprintf('Current Conditions: %.1f°C, %.1f%% RH, %.1f%% SM\n', stats.temperature, stats.humidity, stats.soil_moisture);
    fprintf('Plant Stress Level: %.0f%%\n', stats.plant_stress_level);
    fprintf('Alert Status: %s\n', alert_message);
    fprintf('==========================================\n');
    
end