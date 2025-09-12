function mqtt_listener()
    % MQTT_LISTENER - Real-time agricultural sensor data subscriber
    %
    % This script connects to a public MQTT broker and subscribes to
    % agricultural sensor data. When new messages arrive, it parses
    % the JSON data and saves the latest readings to a persistent file.
    %
    % Usage:
    %   mqtt_listener()  % Start listening for sensor data
    %
    % Output:
    %   Creates/updates 'latest_sensor_data.mat' with current readings
    %
    % Dependencies:
    %   - MATLAB IoT Toolbox (for MQTT communication)
    %   - JSON parsing capabilities
    %
    % Author: Agricultural Monitoring Team
    % Created: December 2024
    
    fprintf('=== MQTT Agricultural Sensor Listener ===\n');
    fprintf('Initializing connection to HiveMQ broker...\n');
    
    try
        % MQTT Broker Configuration
        broker_address = 'broker.hivemq.com';
        broker_port = 1883;
        topic = 'agri-hack/teamX/field1/sensors';
        
        % Create MQTT client
        client_id = sprintf('matlab_listener_%d', randi(10000));
        mqtt_client = mqttclient(broker_address, 'Port', broker_port, 'ClientID', client_id);
        
        fprintf('Connected to broker: %s:%d\n', broker_address, broker_port);
        fprintf('Client ID: %s\n', client_id);
        
        % Set up callback function for incoming messages
        mqtt_client.MessageArrivedFcn = @(~, msg) message_callback(msg);
        
        % Subscribe to the sensor data topic
        subscribe(mqtt_client, topic);
        fprintf('Subscribed to topic: %s\n', topic);
        fprintf('Listening for sensor data... (Press Ctrl+C to stop)\n');
        fprintf('----------------------------------------\n');
        
        % Keep the script running to listen for messages
        % In production, this might run as a background service
        while true
            pause(1);
            
            % Optional: Add periodic status updates
            persistent last_status_time;
            if isempty(last_status_time)
                last_status_time = datetime('now');
            end
            
            if datetime('now') - last_status_time > minutes(5)
                fprintf('[%s] Still listening for sensor data...\n', datestr(now));
                last_status_time = datetime('now');
            end
        end
        
    catch ME
        fprintf('Error in MQTT listener: %s\n', ME.message);
        
        % Provide guidance for common issues
        if contains(ME.message, 'mqttclient')
            fprintf('\nTroubleshooting:\n');
            fprintf('- Ensure MATLAB IoT Toolbox is installed\n');
            fprintf('- Check internet connection\n');
            fprintf('- Verify broker accessibility\n');
        end
        
        rethrow(ME);
    end
end

function message_callback(message)
    % MESSAGE_CALLBACK - Process incoming MQTT messages
    %
    % This function is called whenever a new message arrives on the
    % subscribed MQTT topic. It parses the JSON sensor data and saves
    % it to a persistent file for use by the main analysis function.
    %
    % Input:
    %   message - MQTT message object containing sensor data
    %
    % Side Effects:
    %   Updates 'latest_sensor_data.mat' file with current sensor readings
    
    try
        fprintf('[%s] New sensor data received\n', datestr(now));
        
        % Extract message payload
        json_data = char(message.Data);
        fprintf('Raw data: %s\n', json_data);
        
        % Parse JSON data
        sensor_data = parse_sensor_json(json_data);
        
        % Add timestamp for data freshness tracking
        sensor_data.timestamp = datetime('now');
        sensor_data.mqtt_topic = char(message.Topic);
        
        % Save to persistent file for main analysis function
        data_file = 'latest_sensor_data.mat';
        save(data_file, 'sensor_data');
        
        % Display parsed data for monitoring
        fprintf('Parsed sensor data:\n');
        disp(sensor_data);
        fprintf('Data saved to: %s\n', data_file);
        fprintf('----------------------------------------\n');
        
    catch ME
        fprintf('Error processing message: %s\n', ME.message);
        fprintf('Raw message data: %s\n', char(message.Data));
    end
end

function sensor_data = parse_sensor_json(json_string)
    % PARSE_SENSOR_JSON - Convert JSON string to MATLAB struct
    %
    % Parses the JSON sensor data and converts it to a MATLAB structure
    % with standardized field names and data types.
    %
    % Input:
    %   json_string - JSON formatted string containing sensor readings
    %
    % Output:
    %   sensor_data - Struct with parsed and validated sensor data
    %
    % Expected JSON format:
    %   {
    %     "temperature": 25.5,
    %     "humidity": 65.2,
    %     "soil_moisture": 45.8,
    %     "ph": 6.5,
    %     "light_intensity": 850,
    %     "location": {"lat": 40.7128, "lon": -74.0060}
    %   }
    
    try
        % Parse JSON using MATLAB's built-in JSON decoder
        raw_data = jsondecode(json_string);
        
        % Initialize sensor data structure with default values
        sensor_data = struct();
        
        % Extract and validate sensor readings
        % Temperature (Celsius)
        if isfield(raw_data, 'temperature')
            sensor_data.temperature = validate_sensor_value(raw_data.temperature, -50, 60, 'Temperature');
        else
            sensor_data.temperature = NaN;
        end
        
        % Humidity (%)
        if isfield(raw_data, 'humidity')
            sensor_data.humidity = validate_sensor_value(raw_data.humidity, 0, 100, 'Humidity');
        else
            sensor_data.humidity = NaN;
        end
        
        % Soil Moisture (%)
        if isfield(raw_data, 'soil_moisture')
            sensor_data.soil_moisture = validate_sensor_value(raw_data.soil_moisture, 0, 100, 'Soil Moisture');
        else
            sensor_data.soil_moisture = NaN;
        end
        
        % pH Level
        if isfield(raw_data, 'ph')
            sensor_data.ph = validate_sensor_value(raw_data.ph, 0, 14, 'pH');
        else
            sensor_data.ph = NaN;
        end
        
        % Light Intensity (lux)
        if isfield(raw_data, 'light_intensity')
            sensor_data.light_intensity = validate_sensor_value(raw_data.light_intensity, 0, 2000, 'Light Intensity');
        else
            sensor_data.light_intensity = NaN;
        end
        
        % Location data
        if isfield(raw_data, 'location')
            if isfield(raw_data.location, 'lat') && isfield(raw_data.location, 'lon')
                sensor_data.latitude = raw_data.location.lat;
                sensor_data.longitude = raw_data.location.lon;
            else
                sensor_data.latitude = NaN;
                sensor_data.longitude = NaN;
            end
        else
            sensor_data.latitude = NaN;
            sensor_data.longitude = NaN;
        end
        
        % Additional metadata
        sensor_data.data_quality = calculate_data_quality(sensor_data);
        sensor_data.parse_status = 'success';
        
    catch ME
        % Return minimal structure with error information
        sensor_data = struct();
        sensor_data.temperature = NaN;
        sensor_data.humidity = NaN;
        sensor_data.soil_moisture = NaN;
        sensor_data.ph = NaN;
        sensor_data.light_intensity = NaN;
        sensor_data.latitude = NaN;
        sensor_data.longitude = NaN;
        sensor_data.data_quality = 0;
        sensor_data.parse_status = 'error';
        sensor_data.error_message = ME.message;
        
        fprintf('JSON parsing error: %s\n', ME.message);
    end
end

function validated_value = validate_sensor_value(value, min_val, max_val, sensor_name)
    % VALIDATE_SENSOR_VALUE - Validate sensor readings are within expected ranges
    %
    % Input:
    %   value - Raw sensor value
    %   min_val - Minimum expected value
    %   max_val - Maximum expected value
    %   sensor_name - Name of sensor for logging
    %
    % Output:
    %   validated_value - Validated value or NaN if out of range
    
    if isnumeric(value) && isfinite(value)
        if value >= min_val && value <= max_val
            validated_value = double(value);
        else
            fprintf('Warning: %s value %.2f is out of expected range [%.1f, %.1f]\n', ...
                sensor_name, value, min_val, max_val);
            validated_value = double(value); % Keep value but flag it
        end
    else
        fprintf('Warning: Invalid %s value: %s\n', sensor_name, string(value));
        validated_value = NaN;
    end
end

function quality_score = calculate_data_quality(sensor_data)
    % CALCULATE_DATA_QUALITY - Calculate overall data quality score
    %
    % Input:
    %   sensor_data - Struct containing sensor readings
    %
    % Output:
    %   quality_score - Value between 0 and 1 indicating data quality
    
    % Count valid (non-NaN) sensor readings
    critical_sensors = {'temperature', 'humidity', 'soil_moisture', 'ph', 'light_intensity'};
    valid_count = 0;
    total_count = length(critical_sensors);
    
    for i = 1:length(critical_sensors)
        if isfield(sensor_data, critical_sensors{i}) && ...
           ~isnan(sensor_data.(critical_sensors{i}))
            valid_count = valid_count + 1;
        end
    end
    
    quality_score = valid_count / total_count;
end
