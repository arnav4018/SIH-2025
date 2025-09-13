function [sensor_data, processed_stats, alerts] = process_sensor_data(csv_file)
    %PROCESS_SENSOR_DATA Load and analyze sensor data from CSV file
    %   This function reads CSV sensor data, performs analysis, and generates
    %   alerts based on predefined thresholds for agricultural monitoring.
    %
    %   Inputs:
    %       csv_file - Path to the CSV file containing sensor data
    %                  If empty, uses default simulated_sensors.csv
    %
    %   Outputs:
    %       sensor_data - Table containing all sensor readings
    %       processed_stats - Struct with statistical analysis and current values
    %       alerts - Cell array of alert messages based on sensor thresholds
    %
    %   Author: Agricultural Monitoring Team
    %   Version: v1.0
    %   Compatible with: CSV files with columns (timestamp, temperature, humidity, soil_moisture)
    
    fprintf('=== Sensor Data Processing Module ===\n');
    
    % Default to simulated sensor data
    if nargin < 1 || isempty(csv_file)
        project_root = fileparts(fileparts(mfilename('fullpath')));
        csv_file = fullfile(project_root, 'data', 'simulated_sensors.csv');
    end
    
    % Check if CSV file exists
    if ~exist(csv_file, 'file')
        error('Sensor data file not found: %s', csv_file);
    end
    
    fprintf('Loading sensor data from: %s\n', csv_file);
    
    % Load CSV data
    try
        opts = detectImportOptions(csv_file);
        sensor_data = readtable(csv_file, opts);
        
        % Ensure timestamp column is datetime
        if isnumeric(sensor_data.timestamp) || ischar(sensor_data.timestamp) || isstring(sensor_data.timestamp)
            sensor_data.timestamp = datetime(sensor_data.timestamp, 'InputFormat', 'yyyy-MM-dd HH:mm:ss');
        end
        
        fprintf('Loaded %d sensor records\n', height(sensor_data));
        
    catch ME
        fprintf('Error loading CSV data: %s\n', ME.message);
        error('Failed to load sensor data');
    end
    
    % Validate required columns
    required_cols = {'timestamp', 'temperature', 'humidity', 'soil_moisture'};
    missing_cols = setdiff(required_cols, sensor_data.Properties.VariableNames);
    if ~isempty(missing_cols)
        error('Missing required columns: %s', strjoin(missing_cols, ', '));
    end
    
    % ===== DATA PROCESSING AND STATISTICS =====
    fprintf('Processing sensor data...\n');
    
    processed_stats = struct();
    
    % Current values (latest readings)
    processed_stats.current_temperature = sensor_data.temperature(end);
    processed_stats.current_humidity = sensor_data.humidity(end);
    processed_stats.current_soil_moisture = sensor_data.soil_moisture(end);
    processed_stats.last_update = sensor_data.timestamp(end);
    
    % Historical statistics
    processed_stats.temp_mean = mean(sensor_data.temperature);
    processed_stats.temp_std = std(sensor_data.temperature);
    processed_stats.temp_min = min(sensor_data.temperature);
    processed_stats.temp_max = max(sensor_data.temperature);
    
    processed_stats.humidity_mean = mean(sensor_data.humidity);
    processed_stats.humidity_std = std(sensor_data.humidity);
    processed_stats.humidity_min = min(sensor_data.humidity);
    processed_stats.humidity_max = max(sensor_data.humidity);
    
    processed_stats.moisture_mean = mean(sensor_data.soil_moisture);
    processed_stats.moisture_std = std(sensor_data.soil_moisture);
    processed_stats.moisture_min = min(sensor_data.soil_moisture);
    processed_stats.moisture_max = max(sensor_data.soil_moisture);
    
    % Trend analysis (last 10 readings vs previous 10)
    n_records = height(sensor_data);
    if n_records >= 20
        recent_temp = mean(sensor_data.temperature(end-9:end));
        previous_temp = mean(sensor_data.temperature(end-19:end-10));
        processed_stats.temp_trend = recent_temp - previous_temp;
        
        recent_humidity = mean(sensor_data.humidity(end-9:end));
        previous_humidity = mean(sensor_data.humidity(end-19:end-10));
        processed_stats.humidity_trend = recent_humidity - previous_humidity;
        
        recent_moisture = mean(sensor_data.soil_moisture(end-9:end));
        previous_moisture = mean(sensor_data.soil_moisture(end-19:end-10));
        processed_stats.moisture_trend = recent_moisture - previous_moisture;
    else
        processed_stats.temp_trend = 0;
        processed_stats.humidity_trend = 0;
        processed_stats.moisture_trend = 0;
    end
    
    % Data quality metrics
    processed_stats.data_points = n_records;
    processed_stats.time_span_hours = hours(sensor_data.timestamp(end) - sensor_data.timestamp(1));
    processed_stats.avg_sampling_interval = processed_stats.time_span_hours / (n_records - 1);
    
    % ===== ALERT GENERATION =====
    fprintf('Generating alerts based on thresholds...\n');
    
    alerts = {};
    
    % Define thresholds for agricultural monitoring
    temp_optimal_range = [15, 30];      % Celsius
    humidity_optimal_range = [40, 80];   % Percentage
    moisture_optimal_range = [30, 70];   % Percentage
    
    % Temperature alerts
    current_temp = processed_stats.current_temperature;
    if current_temp < temp_optimal_range(1)
        alerts{end+1} = sprintf('Low Temperature Alert: %.1f°C (below optimal range)', current_temp);
    elseif current_temp > temp_optimal_range(2)
        alerts{end+1} = sprintf('High Temperature Alert: %.1f°C (above optimal range)', current_temp);
    end
    
    % Humidity alerts
    current_humidity = processed_stats.current_humidity;
    if current_humidity < humidity_optimal_range(1)
        alerts{end+1} = sprintf('Low Humidity Alert: %.1f%% (may cause plant stress)', current_humidity);
    elseif current_humidity > humidity_optimal_range(2)
        alerts{end+1} = sprintf('High Humidity Alert: %.1f%% (risk of fungal diseases)', current_humidity);
    end
    
    % Soil moisture alerts
    current_moisture = processed_stats.current_soil_moisture;
    if current_moisture < moisture_optimal_range(1)
        alerts{end+1} = sprintf('Critical: Low Soil Moisture %.1f%% (irrigation needed)', current_moisture);
    elseif current_moisture > moisture_optimal_range(2)
        alerts{end+1} = sprintf('Warning: High Soil Moisture %.1f%% (drainage may be needed)', current_moisture);
    end
    
    % Trend-based alerts
    if abs(processed_stats.temp_trend) > 5
        trend_direction = 'increasing';
        if processed_stats.temp_trend < 0
            trend_direction = 'decreasing';
        end
        alerts{end+1} = sprintf('Temperature Trend Alert: Rapidly %s (%.1f°C change)', ...
                               trend_direction, abs(processed_stats.temp_trend));
    end
    
    if processed_stats.moisture_trend < -5
        alerts{end+1} = sprintf('Soil Moisture Declining: %.1f%% decrease detected', ...
                               abs(processed_stats.moisture_trend));
    end
    
    % Data quality alerts
    if processed_stats.avg_sampling_interval > 2 % More than 2 hours between readings
        alerts{end+1} = 'Data Quality Alert: Irregular sampling intervals detected';
    end
    
    % Generate overall status
    if isempty(alerts)
        processed_stats.status = 'All parameters within optimal range';
        processed_stats.alert_level = 'Normal';
    elseif length(alerts) <= 2
        processed_stats.status = 'Minor issues detected - monitoring recommended';
        processed_stats.alert_level = 'Caution';
    else
        processed_stats.status = 'Multiple alerts active - immediate attention required';
        processed_stats.alert_level = 'Critical';
    end
    
    % Add alert summary to stats
    processed_stats.alert_count = length(alerts);
    processed_stats.alerts_summary = alerts;
    
    % ===== OUTPUT SUMMARY =====
    fprintf('Sensor data processing complete!\n');
    fprintf('Current Readings:\n');
    fprintf('  - Temperature: %.1f°C (trend: %+.1f°C)\n', current_temp, processed_stats.temp_trend);
    fprintf('  - Humidity: %.1f%% (trend: %+.1f%%)\n', current_humidity, processed_stats.humidity_trend);
    fprintf('  - Soil Moisture: %.1f%% (trend: %+.1f%%)\n', current_moisture, processed_stats.moisture_trend);
    fprintf('Status: %s (%d alerts)\n', processed_stats.status, processed_stats.alert_count);
    
    if ~isempty(alerts)
        fprintf('Active Alerts:\n');
        for i = 1:length(alerts)
            fprintf('  %d. %s\n', i, alerts{i});
        end
    end
    
    fprintf('========================================\n');
    
end