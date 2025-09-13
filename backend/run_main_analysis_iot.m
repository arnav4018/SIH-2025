function [health_map, alert_message, stats] = run_main_analysis_iot()
    %RUN_MAIN_ANALYSIS_IOT Enhanced analysis with real IoT MQTT data integration
    %   This function integrates real-time IoT sensor data from MQTT sources
    %   with hyperspectral analysis to provide comprehensive agricultural monitoring.
    %
    %   Features:
    %   - Loads real IoT sensor data from MQTT data manager
    %   - Combines with hyperspectral analysis for complete assessment
    %   - Generates intelligent alerts based on real-time conditions
    %   - Provides device-specific monitoring and statistics
    %
    %   Outputs:
    %       health_map - 2D matrix from hyperspectral analysis
    %       alert_message - Consolidated alerts from all data sources
    %       stats - Comprehensive struct with IoT and spectral data
    %
    %   Author: Agricultural Monitoring Team
    %   Version: IoT-Integrated v1.0
    %   Compatible with: MQTT Data Manager, Python Dashboard
    
    fprintf('================================================\n');
    fprintf('=== AGRICULTURAL ANALYSIS - IoT INTEGRATED ===\n');
    fprintf('================================================\n');
    
    % Initialize results structure
    stats = struct();
    
    try
        % ===== STEP 1: LOAD REAL IOT SENSOR DATA =====
        fprintf('Step 1: Loading real-time IoT sensor data...\n');
        
        [iot_data, iot_success] = load_iot_sensor_data();
        
        if iot_success && ~isempty(iot_data)
            fprintf('✓ IoT data loaded successfully\n');
            fprintf('  Active devices: %d\n', length(iot_data.devices));
            fprintf('  Last update: %s\n', iot_data.timestamp);
            
            % Process IoT data
            [current_readings, device_stats, iot_alerts] = process_iot_data(iot_data);
            
        else
            fprintf('⚠ IoT data not available, using fallback sensor data\n');
            
            % Load CSV fallback data
            try
                project_root = fileparts(fileparts(mfilename('fullpath')));
                csv_path = fullfile(project_root, 'data', 'simulated_sensors.csv');
                [current_readings, device_stats, iot_alerts] = load_fallback_sensor_data(csv_path);
            catch
                % Ultimate fallback - simulated data
                [current_readings, device_stats, iot_alerts] = generate_fallback_data();
            end
        end
        
    catch ME
        fprintf('⚠ Error loading IoT data: %s\n', ME.message);
        [current_readings, device_stats, iot_alerts] = generate_fallback_data();
    end
    
    % ===== STEP 2: HYPERSPECTRAL ANALYSIS =====
    fprintf('Step 2: Performing hyperspectral analysis...\n');
    
    try
        % Get project paths
        backend_path = fileparts(mfilename('fullpath'));
        project_root = fileparts(backend_path);
        ai_path = fullfile(project_root, 'ai');
        
        if exist(ai_path, 'dir')
            addpath(ai_path);
        end
        
        % Run hyperspectral analysis
        [health_map, vegetation_indices, spectral_stats] = analyze_hyperspectral();
        
        fprintf('✓ Hyperspectral analysis complete\n');
        fprintf('  Health map: %dx%d pixels\n', size(health_map, 1), size(health_map, 2));
        fprintf('  Mean NDVI: %.3f\n', spectral_stats.ndvi_mean);
        
    catch ME
        fprintf('⚠ Hyperspectral analysis failed: %s\n', ME.message);
        
        % Fallback health map
        health_map = 0.6 + 0.3 * rand(145, 145);
        health_map = max(0, min(1, health_map));
        
        spectral_stats = struct();
        spectral_stats.health_mean = mean(health_map(:));
        spectral_stats.healthy_percentage = 100 * sum(health_map(:) > 0.7) / numel(health_map);
        spectral_stats.ndvi_mean = 0.6;
        spectral_stats.ndvi_std = 0.2;
    end
    
    % ===== STEP 3: DATA FUSION AND ANALYSIS =====
    fprintf('Step 3: Performing IoT-spectral data fusion...\n');
    
    % Combine IoT sensor data with spectral analysis
    stats = merge_iot_spectral_data(current_readings, device_stats, spectral_stats);
    
    % ===== STEP 4: ADVANCED IoT ANALYTICS =====
    fprintf('Step 4: Performing advanced IoT analytics...\n');
    
    % Multi-device analysis
    if length(iot_data.devices) > 1
        stats = perform_multi_device_analysis(stats, iot_data.devices);
    end
    
    % Spatial correlation (if location data available)
    if isfield(current_readings, 'latitude') && ~isnan(current_readings.latitude)
        stats = add_spatial_analysis(stats, iot_data.devices);
    end
    
    % ===== STEP 5: PREDICTIVE ANALYTICS =====
    fprintf('Step 5: Generating predictive analytics...\n');
    
    % Enhanced predictions using IoT trends
    stats = generate_iot_predictions(stats, device_stats);
    
    % Plant stress assessment with IoT integration
    stats = assess_plant_stress_iot(stats, current_readings, spectral_stats);
    
    % ===== STEP 6: INTELLIGENT ALERT GENERATION =====
    fprintf('Step 6: Generating intelligent alerts...\n');
    
    all_alerts = {};
    alert_priorities = [];
    
    % Add IoT-based alerts
    if ~isempty(iot_alerts)
        for i = 1:length(iot_alerts)
            all_alerts{end+1} = iot_alerts{i};
            alert_priorities(end+1) = classify_alert_priority(iot_alerts{i});
        end
    end
    
    % Cross-validate alerts with hyperspectral data
    hyperspectral_alerts = generate_hyperspectral_alerts(spectral_stats, current_readings);
    for i = 1:length(hyperspectral_alerts)
        all_alerts{end+1} = hyperspectral_alerts{i};
        alert_priorities(end+1) = classify_alert_priority(hyperspectral_alerts{i});
    end
    
    % System health alerts
    system_alerts = check_system_health(device_stats, iot_data);
    for i = 1:length(system_alerts)
        all_alerts{end+1} = system_alerts{i};
        alert_priorities(end+1) = classify_alert_priority(system_alerts{i});
    end
    
    % Sort and consolidate alerts
    if ~isempty(all_alerts)
        [~, sort_idx] = sort(alert_priorities, 'descend');
        all_alerts = all_alerts(sort_idx);
        alert_message = strjoin(all_alerts(1:min(3, length(all_alerts))), ' | ');
        
        if length(alert_message) > 200
            alert_message = [alert_message(1:197) '...'];
        end
    else
        alert_message = 'All systems optimal - No alerts detected';
    end
    
    % ===== FINALIZE STATISTICS =====
    
    % Add system metadata
    stats.analysis_timestamp = datestr(now, 'yyyy-mm-dd HH:MM:SS');
    stats.data_source = 'iot_integrated';
    stats.version = 'iot_v1.0';
    stats.iot_integration = iot_success;
    stats.active_devices = length(iot_data.devices);
    stats.alert_count = length(all_alerts);
    
    % Ensure all fields are finite
    field_names = fieldnames(stats);
    for i = 1:length(field_names)
        field = field_names{i};
        if isnumeric(stats.(field)) && isscalar(stats.(field))
            if ~isfinite(stats.(field))
                stats.(field) = 0;
                fprintf('Warning: Fixed non-finite value in %s\n', field);
            end
        end
    end
    
    % ===== FINAL SUMMARY =====
    fprintf('================================================\n');
    fprintf('=== IoT-INTEGRATED ANALYSIS COMPLETE ===\n');
    fprintf('Health Score: %.3f | IoT Devices: %d | Alerts: %d\n', ...
            stats.overall_health_score, stats.active_devices, stats.alert_count);
    fprintf('Current Conditions: %.1f°C, %.1f%% RH, %.1f%% SM\n', ...
            stats.temperature, stats.humidity, stats.soil_moisture);
    fprintf('Data Quality: IoT=%.2f | Spectral=%.2f\n', ...
            stats.iot_data_quality, stats.spectral_data_quality);
    fprintf('================================================\n');
    
end

function [iot_data, success] = load_iot_sensor_data()
    %LOAD_IOT_SENSOR_DATA Load real-time IoT data from MQTT data manager
    
    success = false;
    iot_data = struct('devices', [], 'timestamp', datestr(now));
    
    try
        % Try to load JSON export from IoT data manager
        json_files = {'latest_sensor_data.json', 'iot_sensor_data.json'};
        
        for i = 1:length(json_files)
            if exist(json_files{i}, 'file')
                fprintf('Loading IoT data from: %s\n', json_files{i});
                
                % Read JSON file
                fid = fopen(json_files{i}, 'r');
                if fid == -1
                    continue;
                end
                
                raw_data = fread(fid, inf, 'char=>char')';
                fclose(fid);
                
                % Parse JSON
                iot_data = parse_json_data(raw_data);
                success = true;
                return;
            end
        end
        
        % Try to load from database export (CSV)
        csv_files = {'live_sensor_data.csv'};
        for i = 1:length(csv_files)
            if exist(csv_files{i}, 'file')
                fprintf('Loading IoT data from CSV: %s\n', csv_files{i});
                iot_data = load_iot_from_csv(csv_files{i});
                success = true;
                return;
            end
        end
        
    catch ME
        fprintf('Error loading IoT data: %s\n', ME.message);
    end
end

function iot_data = parse_json_data(json_str)
    %PARSE_JSON_DATA Parse JSON string to MATLAB struct
    
    try
        % Use MATLAB's JSON decoder
        iot_data = jsondecode(json_str);
    catch
        % Manual parsing for basic JSON
        iot_data = struct();
        iot_data.devices = [];
        iot_data.timestamp = datestr(now);
        
        % Extract timestamp
        timestamp_match = regexp(json_str, '"timestamp":\s*"([^"]+)"', 'tokens');
        if ~isempty(timestamp_match)
            iot_data.timestamp = timestamp_match{1}{1};
        end
        
        % Simple device parsing (basic implementation)
        device_matches = regexp(json_str, '"device_id":\s*"([^"]+)"', 'tokens');
        if ~isempty(device_matches)
            for i = 1:length(device_matches)
                device = struct();
                device.device_id = device_matches{i}{1};
                device.temperature = extract_json_number(json_str, 'temperature');
                device.humidity = extract_json_number(json_str, 'humidity');
                device.soil_moisture = extract_json_number(json_str, 'soil_moisture');
                iot_data.devices(end+1) = device;
            end
        end
    end
end

function value = extract_json_number(json_str, field_name)
    %EXTRACT_JSON_NUMBER Extract numeric value from JSON string
    pattern = sprintf('"%s":\\s*([0-9.-]+)', field_name);
    match = regexp(json_str, pattern, 'tokens');
    if ~isempty(match)
        value = str2double(match{1}{1});
    else
        value = NaN;
    end
end

function [current_readings, device_stats, alerts] = process_iot_data(iot_data)
    %PROCESS_IOT_DATA Process IoT data and extract meaningful information
    
    % Initialize outputs
    current_readings = struct();
    device_stats = struct();
    alerts = {};
    
    if isempty(iot_data.devices)
        % No devices - use defaults
        current_readings.temperature = 25.0;
        current_readings.humidity = 60.0;
        current_readings.soil_moisture = 45.0;
        current_readings.ph = 6.8;
        current_readings.light_intensity = 850;
        current_readings.latitude = NaN;
        current_readings.longitude = NaN;
        
        device_stats.data_quality = 0;
        device_stats.device_count = 0;
        return;
    end
    
    % Process multiple devices
    temps = [];
    humidities = [];
    moistures = [];
    phs = [];
    lights = [];
    qualities = [];
    
    for i = 1:length(iot_data.devices)
        device = iot_data.devices(i);
        
        % Collect valid readings
        if isfield(device, 'temperature') && ~isnan(device.temperature)
            temps(end+1) = device.temperature;
        end
        if isfield(device, 'humidity') && ~isnan(device.humidity)
            humidities(end+1) = device.humidity;
        end
        if isfield(device, 'soil_moisture') && ~isnan(device.soil_moisture)
            moistures(end+1) = device.soil_moisture;
        end
        if isfield(device, 'ph') && ~isnan(device.ph)
            phs(end+1) = device.ph;
        end
        if isfield(device, 'light_intensity') && ~isnan(device.light_intensity)
            lights(end+1) = device.light_intensity;
        end
        if isfield(device, 'data_quality')
            qualities(end+1) = device.data_quality;
        end
        
        % Generate device-specific alerts
        device_alerts = check_device_alerts(device);
        alerts = [alerts, device_alerts];
    end
    
    % Calculate aggregate readings
    current_readings.temperature = mean(temps, 'omitnan');
    current_readings.humidity = mean(humidities, 'omitnan');
    current_readings.soil_moisture = mean(moistures, 'omitnan');
    current_readings.ph = mean(phs, 'omitnan');
    current_readings.light_intensity = mean(lights, 'omitnan');
    
    % Use location from first device with valid coordinates
    current_readings.latitude = NaN;
    current_readings.longitude = NaN;
    for i = 1:length(iot_data.devices)
        device = iot_data.devices(i);
        if isfield(device, 'latitude') && ~isnan(device.latitude)
            current_readings.latitude = device.latitude;
            current_readings.longitude = device.longitude;
            break;
        end
    end
    
    % Calculate device statistics
    device_stats.data_quality = mean(qualities, 'omitnan');
    device_stats.device_count = length(iot_data.devices);
    device_stats.temp_variance = var(temps, 'omitnan');
    device_stats.moisture_variance = var(moistures, 'omitnan');
    device_stats.active_sensors = sum(~isnan([temps, humidities, moistures]));
    
    % Replace NaN values with defaults
    if isnan(current_readings.temperature)
        current_readings.temperature = 25.0;
    end
    if isnan(current_readings.humidity)
        current_readings.humidity = 60.0;
    end
    if isnan(current_readings.soil_moisture)
        current_readings.soil_moisture = 45.0;
    end
    if isnan(current_readings.ph)
        current_readings.ph = 6.8;
    end
    if isnan(current_readings.light_intensity)
        current_readings.light_intensity = 850;
    end
end

function device_alerts = check_device_alerts(device)
    %CHECK_DEVICE_ALERTS Generate alerts for individual device
    
    device_alerts = {};
    device_id = 'Unknown';
    
    if isfield(device, 'device_id')
        device_id = device.device_id;
    end
    
    % Temperature alerts
    if isfield(device, 'temperature') && ~isnan(device.temperature)
        temp = device.temperature;
        if temp < 5
            device_alerts{end+1} = sprintf('Critical: %s temperature %.1f°C', device_id, temp);
        elseif temp > 40
            device_alerts{end+1} = sprintf('Critical: %s high temperature %.1f°C', device_id, temp);
        elseif temp < 10 || temp > 35
            device_alerts{end+1} = sprintf('Warning: %s temperature %.1f°C out of range', device_id, temp);
        end
    end
    
    % Moisture alerts
    if isfield(device, 'soil_moisture') && ~isnan(device.soil_moisture)
        moisture = device.soil_moisture;
        if moisture < 20
            device_alerts{end+1} = sprintf('Critical: %s low soil moisture %.1f%%', device_id, moisture);
        elseif moisture < 30
            device_alerts{end+1} = sprintf('Warning: %s soil moisture %.1f%% below optimal', device_id, moisture);
        end
    end
    
    % Battery alerts
    if isfield(device, 'battery_level') && ~isnan(device.battery_level)
        battery = device.battery_level;
        if battery < 15
            device_alerts{end+1} = sprintf('Critical: %s low battery %.0f%%', device_id, battery);
        elseif battery < 25
            device_alerts{end+1} = sprintf('Warning: %s battery %.0f%% needs attention', device_id, battery);
        end
    end
end

function [current_readings, device_stats, alerts] = load_fallback_sensor_data(csv_path)
    %LOAD_FALLBACK_SENSOR_DATA Load data from CSV fallback
    
    try
        data = readtable(csv_path);
        
        % Use most recent readings
        current_readings = struct();
        current_readings.temperature = data.temperature(end);
        current_readings.humidity = data.humidity(end);
        current_readings.soil_moisture = data.soil_moisture(end);
        current_readings.ph = 6.8;
        current_readings.light_intensity = 850;
        current_readings.latitude = NaN;
        current_readings.longitude = NaN;
        
        device_stats = struct();
        device_stats.data_quality = 0.8;
        device_stats.device_count = 1;
        device_stats.temp_variance = var(data.temperature);
        device_stats.moisture_variance = var(data.soil_moisture);
        device_stats.active_sensors = 3;
        
        alerts = {};
        
    catch
        [current_readings, device_stats, alerts] = generate_fallback_data();
    end
end

function [current_readings, device_stats, alerts] = generate_fallback_data()
    %GENERATE_FALLBACK_DATA Generate simulated data when no real data available
    
    current_readings = struct();
    current_readings.temperature = 24.5 + 3*randn();
    current_readings.humidity = 65.0 + 8*randn();
    current_readings.soil_moisture = 42.0 + 5*randn();
    current_readings.ph = 6.8 + 0.3*randn();
    current_readings.light_intensity = 850 + 100*randn();
    current_readings.latitude = NaN;
    current_readings.longitude = NaN;
    
    device_stats = struct();
    device_stats.data_quality = 0.5;  % Lower quality for fallback
    device_stats.device_count = 0;
    device_stats.temp_variance = 2.0;
    device_stats.moisture_variance = 5.0;
    device_stats.active_sensors = 0;
    
    alerts = {'System: Using fallback sensor data - IoT connection needed'};
end

function stats = merge_iot_spectral_data(current_readings, device_stats, spectral_stats)
    %MERGE_IOT_SPECTRAL_DATA Combine IoT and spectral analysis results
    
    stats = struct();
    
    % Current sensor readings from IoT
    stats.temperature = current_readings.temperature;
    stats.humidity = current_readings.humidity;
    stats.soil_moisture = current_readings.soil_moisture;
    stats.ph = current_readings.ph;
    stats.light_intensity = current_readings.light_intensity;
    
    % Location data
    stats.latitude = current_readings.latitude;
    stats.longitude = current_readings.longitude;
    
    % Hyperspectral metrics
    stats.overall_health_score = spectral_stats.health_mean;
    stats.healthy_areas_percent = spectral_stats.healthy_percentage;
    stats.ndvi_mean = spectral_stats.ndvi_mean;
    stats.ndvi_std = spectral_stats.ndvi_std;
    
    % IoT-specific metrics
    stats.iot_data_quality = device_stats.data_quality;
    stats.spectral_data_quality = 1.0;  % Assume good quality for hyperspectral
    stats.device_count = device_stats.device_count;
    stats.active_sensors = device_stats.active_sensors;
    
    % Data variability (multi-device analysis)
    stats.temp_variance = device_stats.temp_variance;
    stats.moisture_variance = device_stats.moisture_variance;
    
    % Initialize trend data (would be calculated from historical data)
    stats.temp_trend = randn() * 0.5;  % Placeholder
    stats.humidity_trend = randn() * 2;
    stats.moisture_trend = randn() * 1;
end

function priority = classify_alert_priority(alert_msg)
    %CLASSIFY_ALERT_PRIORITY Assign priority to alert messages
    
    alert_lower = lower(alert_msg);
    
    if contains(alert_lower, 'critical')
        priority = 3;
    elseif contains(alert_lower, {'warning', 'low', 'high'})
        priority = 2;
    else
        priority = 1;
    end
end

function stats = generate_iot_predictions(stats, device_stats)
    %GENERATE_IOT_PREDICTIONS Generate predictions based on IoT data trends
    
    % Simple prediction model (in real system, would use historical data)
    stats.predicted_temperature = stats.temperature + stats.temp_trend * 0.5;
    stats.predicted_humidity = stats.humidity + stats.humidity_trend * 0.3;
    stats.predicted_soil_moisture = stats.soil_moisture + stats.moisture_trend * 0.2;
    
    % Add environmental predictions
    hour_of_day = hour(datetime('now'));
    daily_temp_cycle = 5 * sin(2*pi*(hour_of_day-6)/24);  % Peak at 2 PM
    stats.predicted_temperature = stats.predicted_temperature + daily_temp_cycle;
    
    % Clamp to reasonable ranges
    stats.predicted_temperature = max(-10, min(50, stats.predicted_temperature));
    stats.predicted_humidity = max(0, min(100, stats.predicted_humidity));
    stats.predicted_soil_moisture = max(0, min(100, stats.predicted_soil_moisture));
end

function stats = assess_plant_stress_iot(stats, current_readings, spectral_stats)
    %ASSESS_PLANT_STRESS_IOT Assess plant stress using both IoT and spectral data
    
    stress_factors = [];
    
    % Temperature stress
    optimal_temp_range = [15, 30];
    if stats.temperature < optimal_temp_range(1) || stats.temperature > optimal_temp_range(2)
        temp_stress = min(abs(stats.temperature - optimal_temp_range(1)), ...
                         abs(stats.temperature - optimal_temp_range(2))) / 10;
        stress_factors(end+1) = temp_stress;
    end
    
    % Moisture stress
    if stats.soil_moisture < 30
        moisture_stress = (30 - stats.soil_moisture) / 30;
        stress_factors(end+1) = moisture_stress;
    elseif stats.soil_moisture > 80
        moisture_stress = (stats.soil_moisture - 80) / 20;
        stress_factors(end+1) = moisture_stress;
    end
    
    % Spectral stress (low NDVI indicates stress)
    if stats.ndvi_mean < 0.4
        spectral_stress = (0.4 - stats.ndvi_mean) / 0.4;
        stress_factors(end+1) = spectral_stress;
    end
    
    % pH stress
    optimal_ph_range = [6.0, 7.5];
    if stats.ph < optimal_ph_range(1) || stats.ph > optimal_ph_range(2)
        ph_stress = min(abs(stats.ph - optimal_ph_range(1)), ...
                       abs(stats.ph - optimal_ph_range(2))) / 2;
        stress_factors(end+1) = ph_stress;
    end
    
    % Calculate overall stress level
    if ~isempty(stress_factors)
        stats.plant_stress_level = mean(stress_factors) * 100;
    else
        stats.plant_stress_level = 0;
    end
    
    % Clamp to 0-100 range
    stats.plant_stress_level = max(0, min(100, stats.plant_stress_level));
end

function alerts = generate_hyperspectral_alerts(spectral_stats, current_readings)
    %GENERATE_HYPERSPECTRAL_ALERTS Generate alerts based on spectral analysis
    
    alerts = {};
    
    if spectral_stats.healthy_percentage < 40
        alerts{end+1} = sprintf('Critical: Only %.1f%% healthy vegetation detected', ...
                               spectral_stats.healthy_percentage);
    elseif spectral_stats.healthy_percentage < 60
        alerts{end+1} = sprintf('Warning: Low healthy vegetation %.1f%%', ...
                               spectral_stats.healthy_percentage);
    end
    
    if spectral_stats.ndvi_mean < 0.3
        alerts{end+1} = sprintf('Warning: Low NDVI %.2f indicates vegetation stress', ...
                               spectral_stats.ndvi_mean);
    end
    
    % Cross-validation with IoT data
    if ~isnan(current_readings.soil_moisture) && current_readings.soil_moisture < 25 && ...
       spectral_stats.ndvi_mean < 0.4
        alerts{end+1} = 'Critical: Low moisture AND low NDVI - immediate irrigation needed';
    end
end

function alerts = check_system_health(device_stats, iot_data)
    %CHECK_SYSTEM_HEALTH Check overall system health
    
    alerts = {};
    
    if device_stats.device_count == 0
        alerts{end+1} = 'System: No IoT devices connected - check network';
    elseif device_stats.device_count < 2
        alerts{end+1} = 'System: Limited device coverage - consider additional sensors';
    end
    
    if device_stats.data_quality < 0.7
        alerts{end+1} = sprintf('System: Data quality %.1f%% below optimal', ...
                               device_stats.data_quality * 100);
    end
    
    if device_stats.active_sensors < 5
        alerts{end+1} = 'System: Some sensors offline - check device status';
    end
end

function stats = perform_multi_device_analysis(stats, devices)
    %PERFORM_MULTI_DEVICE_ANALYSIS Analyze data from multiple devices
    
    if length(devices) < 2
        return;
    end
    
    % Calculate spatial variability
    temps = [];
    moistures = [];
    
    for i = 1:length(devices)
        if isfield(devices(i), 'temperature') && ~isnan(devices(i).temperature)
            temps(end+1) = devices(i).temperature;
        end
        if isfield(devices(i), 'soil_moisture') && ~isnan(devices(i).soil_moisture)
            moistures(end+1) = devices(i).soil_moisture;
        end
    end
    
    if length(temps) > 1
        stats.temp_spatial_variance = var(temps);
        stats.temp_coefficient_variation = std(temps) / mean(temps) * 100;
    else
        stats.temp_spatial_variance = 0;
        stats.temp_coefficient_variation = 0;
    end
    
    if length(moistures) > 1
        stats.moisture_spatial_variance = var(moistures);
        stats.moisture_coefficient_variation = std(moistures) / mean(moistures) * 100;
    else
        stats.moisture_spatial_variance = 0;
        stats.moisture_coefficient_variation = 0;
    end
end

function stats = add_spatial_analysis(stats, devices)
    %ADD_SPATIAL_ANALYSIS Add spatial correlation analysis
    
    % This is a simplified version - in a full system would do proper
    % spatial interpolation and correlation analysis
    
    stats.spatial_coverage = length(devices);
    stats.has_location_data = true;
    
    % Calculate approximate field coverage
    if stats.spatial_coverage > 1
        stats.estimated_coverage_hectares = stats.spatial_coverage * 0.5; % Rough estimate
    else
        stats.estimated_coverage_hectares = 0.1;
    end
end