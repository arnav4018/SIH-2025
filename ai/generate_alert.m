function alert_message = generate_alert(health_map, sensor_prediction, current_stats)
    % AI-powered fusion logic alert generation function
    % Created by: Aryan (Upgraded for SIH-2025)
    % Purpose: Combine insights from CNN and LSTM models to generate intelligent alerts
    
    % Input: health_map - 2D matrix from CNN (1=Healthy, 2=Stressed, 3=Waterlogged)
    %        sensor_prediction - struct with LSTM predictions
    %        current_stats - struct with current field statistics
    % Output: alert_message - string with final alert and recommendations
    
    fprintf('AI Fusion Logic - Generating intelligent alerts...\n');
    
    try
        % Step 1: Analyze health map from CNN
        fprintf('Step 1: Analyzing CNN health map...\n');
        health_analysis = analyze_health_map(health_map);
        
        % Step 2: Analyze sensor predictions from LSTM
        fprintf('Step 2: Analyzing LSTM sensor predictions...\n');
        sensor_analysis = analyze_sensor_predictions(sensor_prediction, current_stats);
        
        % Step 3: Apply fusion rules to generate alert
        fprintf('Step 3: Applying fusion logic rules...\n');
        alert_message = apply_fusion_rules(health_analysis, sensor_analysis, current_stats);
        
        fprintf('Alert generation completed successfully.\n');
        
    catch ME
        fprintf('Error in alert generation: %s\n', ME.message);
        alert_message = 'SYSTEM WARNING: Alert generation failed. Please check system manually.';
    end
end

function health_analysis = analyze_health_map(health_map)
    % Analyze CNN-generated health map to extract key statistics
    
    if isempty(health_map)
        health_analysis = struct('total_pixels', 0, 'healthy_pct', 100, 'stressed_pct', 0, 'waterlogged_pct', 0);
        return;
    end
    
    total_pixels = numel(health_map);
    
    % Count pixels by category
    healthy_pixels = sum(health_map(:) == 1);
    stressed_pixels = sum(health_map(:) == 2);
    waterlogged_pixels = sum(health_map(:) == 3);
    
    % Calculate percentages
    healthy_pct = (healthy_pixels / total_pixels) * 100;
    stressed_pct = (stressed_pixels / total_pixels) * 100;
    waterlogged_pct = (waterlogged_pixels / total_pixels) * 100;
    
    % Identify problem zones (connected components of stressed/waterlogged areas)
    problem_mask = (health_map == 2) | (health_map == 3);
    if any(problem_mask(:))
        problem_zones = identify_problem_zones(problem_mask, health_map);
    else
        problem_zones = [];
    end
    
    health_analysis = struct(...
        'total_pixels', total_pixels, ...
        'healthy_pct', healthy_pct, ...
        'stressed_pct', stressed_pct, ...
        'waterlogged_pct', waterlogged_pct, ...
        'problem_zones', problem_zones, ...
        'severity_score', calculate_severity_score(stressed_pct, waterlogged_pct) ...
    );
    
    fprintf('   Health map: %.1f%% healthy, %.1f%% stressed, %.1f%% waterlogged\n', ...
            healthy_pct, stressed_pct, waterlogged_pct);
end

function problem_zones = identify_problem_zones(problem_mask, health_map)
    % Identify and characterize connected problem areas
    
    % Find connected components of problem areas
    cc = bwconncomp(problem_mask);
    problem_zones = [];
    
    if cc.NumObjects > 0
        for i = 1:cc.NumObjects
            zone_pixels = cc.PixelIdxList{i};
            zone_size = length(zone_pixels);
            
            % Determine dominant problem type in this zone
            zone_values = health_map(zone_pixels);
            stressed_count = sum(zone_values == 2);
            waterlogged_count = sum(zone_values == 3);
            
            if waterlogged_count > stressed_count
                problem_type = 'waterlogged';
            else
                problem_type = 'stressed';
            end
            
            % Calculate zone centroid for location reference
            [rows, cols] = ind2sub(size(health_map), zone_pixels);
            centroid_row = round(mean(rows));
            centroid_col = round(mean(cols));
            
            zone_info = struct(...
                'size', zone_size, ...
                'type', problem_type, ...
                'location', sprintf('Zone %c', 'A' + i - 1), ...
                'centroid', [centroid_row, centroid_col] ...
            );
            
            problem_zones = [problem_zones; zone_info];
        end
    end
end

function severity_score = calculate_severity_score(stressed_pct, waterlogged_pct)
    % Calculate overall severity score from health map percentages
    
    % Waterlogged areas are considered more severe than stressed areas
    severity_score = (stressed_pct * 0.6 + waterlogged_pct * 1.0) / 100;
    severity_score = max(0, min(1, severity_score)); % Clamp to [0,1]
end

function sensor_analysis = analyze_sensor_predictions(sensor_prediction, current_stats)
    % Analyze LSTM sensor predictions and current readings
    
    % Initialize with safe defaults
    sensor_analysis = struct(...
        'moisture_critical', false, ...
        'temperature_warning', false, ...
        'humidity_warning', false, ...
        'moisture_trend', 'stable', ...
        'prediction_confidence', 0.5, ...
        'days_to_critical', inf ...
    );
    
    if isempty(sensor_prediction)
        return;
    end
    
    % Extract prediction confidence
    if isfield(sensor_prediction, 'confidence')
        sensor_analysis.prediction_confidence = sensor_prediction.confidence;
    end
    
    % Analyze soil moisture predictions
    if isfield(sensor_prediction, 'soil_moisture')
        predicted_moisture = sensor_prediction.soil_moisture;
        
        % Check if predicted moisture is below critical threshold
        critical_moisture_threshold = 30; % 30% soil moisture
        if predicted_moisture < critical_moisture_threshold
            sensor_analysis.moisture_critical = true;
            
            % Estimate days until critical based on current trend
            if isfield(sensor_prediction, 'soil_moisture_trend') && ...
               sensor_prediction.soil_moisture_trend < -0.5 && ...
               isfield(current_stats, 'soil_moisture')
                current_moisture = current_stats.soil_moisture;
                daily_decline_rate = abs(sensor_prediction.soil_moisture_trend);
                if daily_decline_rate > 0
                    days_to_critical = (current_moisture - critical_moisture_threshold) / daily_decline_rate;
                    sensor_analysis.days_to_critical = max(0, days_to_critical);
                end
            end
        end
        
        % Determine moisture trend
        if isfield(sensor_prediction, 'soil_moisture_trend')
            trend_value = sensor_prediction.soil_moisture_trend;
            if trend_value < -1.0
                sensor_analysis.moisture_trend = 'rapidly_declining';
            elseif trend_value < -0.5
                sensor_analysis.moisture_trend = 'declining';
            elseif trend_value > 1.0
                sensor_analysis.moisture_trend = 'rapidly_increasing';
            elseif trend_value > 0.5
                sensor_analysis.moisture_trend = 'increasing';
            else
                sensor_analysis.moisture_trend = 'stable';
            end
        end
    end
    
    % Analyze temperature predictions
    if isfield(sensor_prediction, 'temperature')
        predicted_temp = sensor_prediction.temperature;
        
        % Check for temperature extremes
        if predicted_temp > 35 || predicted_temp < 10
            sensor_analysis.temperature_warning = true;
        end
    end
    
    % Analyze humidity predictions
    if isfield(sensor_prediction, 'humidity')
        predicted_humidity = sensor_prediction.humidity;
        
        % Check for humidity extremes
        if predicted_humidity < 30 || predicted_humidity > 90
            sensor_analysis.humidity_warning = true;
        end
    end
    
    fprintf('   Sensor analysis: moisture_critical=%d, temp_warning=%d, trend=%s\n', ...
            sensor_analysis.moisture_critical, sensor_analysis.temperature_warning, ...
            sensor_analysis.moisture_trend);
end

function alert_message = apply_fusion_rules(health_analysis, sensor_analysis, current_stats)
    % Apply rule-based logic to combine CNN and LSTM insights
    
    alert_priority = 'INFO'; % Default priority
    alert_messages = {};
    recommendations = {};
    
    % RULE 1: Health Map Analysis
    % Check if significant percentage of map shows stress or waterlogging
    if health_analysis.stressed_pct > 25 || health_analysis.waterlogged_pct > 15
        alert_priority = escalate_priority(alert_priority, 'WARNING');
        
        if health_analysis.waterlogged_pct > 15
            alert_messages{end+1} = sprintf('WATERLOGGING DETECTED: %.1f%% of field shows waterlogged conditions', ...
                                          health_analysis.waterlogged_pct);
            recommendations{end+1} = 'Immediate drainage required in affected areas';
        end
        
        if health_analysis.stressed_pct > 25
            alert_messages{end+1} = sprintf('VEGETATION STRESS: %.1f%% of field shows stressed vegetation', ...
                                          health_analysis.stressed_pct);
            recommendations{end+1} = 'Field inspection recommended to identify stress causes';
        end
        
        % Add zone-specific information if available
        if ~isempty(health_analysis.problem_zones)
            for i = 1:length(health_analysis.problem_zones)
                zone = health_analysis.problem_zones(i);
                alert_messages{end+1} = sprintf('%s shows %s conditions', ...
                                              zone.location, zone.type);
            end
        end
    end
    
    % RULE 2: Sensor Prediction Analysis
    % Check for declining soil moisture trends
    if sensor_analysis.moisture_critical
        alert_priority = escalate_priority(alert_priority, 'CRITICAL');
        alert_messages{end+1} = 'CRITICAL MOISTURE: Predicted soil moisture below 30%';
        recommendations{end+1} = 'Immediate irrigation required';
        
        if sensor_analysis.days_to_critical < 2
            alert_messages{end+1} = sprintf('Estimated %.1f days until critical moisture level', ...
                                          sensor_analysis.days_to_critical);
        end
    end
    
    if strcmp(sensor_analysis.moisture_trend, 'rapidly_declining')
        alert_priority = escalate_priority(alert_priority, 'WARNING');
        alert_messages{end+1} = 'Soil moisture rapidly declining - monitor closely';
        recommendations{end+1} = 'Prepare irrigation system for activation';
    end
    
    % RULE 3: Fusion Logic - Combined Conditions
    % High stress in health map AND declining moisture = high priority
    if health_analysis.stressed_pct > 20 && sensor_analysis.moisture_critical
        alert_priority = escalate_priority(alert_priority, 'CRITICAL');
        alert_messages{end+1} = 'CRITICAL: High vegetation stress combined with moisture deficit';
        
        % Zone-specific recommendations
        if ~isempty(health_analysis.problem_zones)
            for i = 1:length(health_analysis.problem_zones)
                zone = health_analysis.problem_zones(i);
                if strcmp(zone.type, 'stressed')
                    recommendations{end+1} = sprintf('Priority irrigation needed in %s', zone.location);
                end
            end
        else
            recommendations{end+1} = 'Priority irrigation needed in stressed areas';
        end
    end
    
    % Waterlogged areas with high humidity prediction = disease risk
    if health_analysis.waterlogged_pct > 10 && sensor_analysis.humidity_warning
        alert_priority = escalate_priority(alert_priority, 'WARNING');
        alert_messages{end+1} = 'HIGH DISEASE RISK: Waterlogged conditions with high humidity';
        recommendations{end+1} = 'Consider fungicide application and improve drainage';
    end
    
    % Temperature warnings
    if sensor_analysis.temperature_warning
        alert_priority = escalate_priority(alert_priority, 'WARNING');
        alert_messages{end+1} = 'Temperature stress predicted';
        recommendations{end+1} = 'Monitor temperature closely and consider protective measures';
    end
    
    % RULE 4: System Confidence and Data Quality
    confidence_modifier = '';
    if sensor_analysis.prediction_confidence < 0.6
        confidence_modifier = ' (Low prediction confidence - verify with field inspection)';
    end
    
    % Generate final alert message
    if isempty(alert_messages)
        alert_message = 'NO ALERTS: Field conditions appear normal based on current analysis';
    else
        % Combine all alert components
        alert_header = sprintf('[%s]', alert_priority);
        main_alerts = strjoin(alert_messages, '. ');
        
        if ~isempty(recommendations)
            rec_text = sprintf('RECOMMENDED ACTIONS: %s', strjoin(recommendations, '; '));
            alert_message = sprintf('%s %s. %s%s', alert_header, main_alerts, rec_text, confidence_modifier);
        else
            alert_message = sprintf('%s %s%s', alert_header, main_alerts, confidence_modifier);
        end
    end
    
    % Add timestamp
    timestamp = datestr(now, 'yyyy-mm-dd HH:MM:SS');
    alert_message = sprintf('[%s] %s', timestamp, alert_message);
    
    fprintf('   Generated alert: %s\n', alert_priority);
end

function new_priority = escalate_priority(current_priority, requested_priority)
    % Escalate alert priority based on severity hierarchy
    
    priority_levels = {'INFO', 'WARNING', 'CRITICAL'};
    current_level = find(strcmp(current_priority, priority_levels));
    requested_level = find(strcmp(requested_priority, priority_levels));
    
    if isempty(current_level)
        current_level = 1; % Default to INFO
    end
    if isempty(requested_level)
        requested_level = 1; % Default to INFO
    end
    
    % Use the higher priority level
    final_level = max(current_level, requested_level);
    new_priority = priority_levels{final_level};
end
