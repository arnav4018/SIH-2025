function prediction = predict_stress(sensor_history)
    % AI-powered LSTM stress prediction function
    % Created by: Aryan (Upgraded for SIH-2025)
    % Purpose: Predict future sensor values using LSTM network
    
    % Input: sensor_history - time-series matrix (time_steps x features)
    %        Features: [temperature, humidity, soil_moisture]
    % Output: prediction - predicted future sensor values
    
    fprintf('AI LSTM Stress Prediction - Processing sensor history...\n');
    
    try
        % Step 1: Preprocess sensor history data
        fprintf('Step 1: Preprocessing sensor time-series data...\n');
        [processed_data, scaler_params] = preprocess_sensor_data(sensor_history);
        
        % Step 2: Load or train LSTM model
        fprintf('Step 2: Loading LSTM model...\n');
        lstm_model = load_or_train_lstm_model();
        
        % Step 3: Generate predictions
        fprintf('Step 3: Generating future sensor predictions...\n');
        raw_predictions = generate_lstm_predictions(lstm_model, processed_data);
        
        % Step 4: Post-process predictions
        fprintf('Step 4: Post-processing predictions...\n');
        prediction = postprocess_predictions(raw_predictions, scaler_params, sensor_history);
        
        fprintf('LSTM prediction completed successfully.\n');
        
    catch ME
        fprintf('Error in LSTM prediction: %s\n', ME.message);
        fprintf('Generating fallback prediction...\n');
        
        % Generate fallback prediction based on simple trends
        prediction = generate_fallback_prediction(sensor_history);
    end
end

function [processed_data, scaler_params] = preprocess_sensor_data(sensor_history)
    % Preprocess sensor time-series data for LSTM input
    
    % Ensure data is in correct format (time_steps x features)
    if size(sensor_history, 2) > size(sensor_history, 1)
        sensor_history = sensor_history'; % Transpose if needed
    end
    
    [num_timesteps, num_features] = size(sensor_history);
    fprintf('   Processing %d timesteps with %d features\n', num_timesteps, num_features);
    
    % Remove any NaN or invalid values
    sensor_history(isnan(sensor_history)) = 0;
    sensor_history(isinf(sensor_history)) = 0;
    
    % Normalize data to [0, 1] range for each feature
    processed_data = zeros(size(sensor_history));
    scaler_params = struct();
    
    for feature = 1:num_features
        data_column = sensor_history(:, feature);
        min_val = min(data_column);
        max_val = max(data_column);
        
        % Store scaling parameters for inverse transform
        scaler_params.min_vals(feature) = min_val;
        scaler_params.max_vals(feature) = max_val;
        
        % Normalize
        if max_val > min_val
            processed_data(:, feature) = (data_column - min_val) / (max_val - min_val);
        else
            processed_data(:, feature) = 0.5; % Default to middle value
        end
    end
    
    fprintf('   Data preprocessing completed\n');
end

function lstm_model = load_or_train_lstm_model()
    % Load existing LSTM model or train a new one
    
    model_path = 'models/sensor_lstm_model.mat';
    
    if exist(model_path, 'file')
        fprintf('   Loading pre-trained LSTM model...\n');
        load_data = load(model_path);
        lstm_model = load_data.net;
    else
        fprintf('   Training new LSTM model...\n');
        lstm_model = train_lstm_model();
        
        % Save the trained model
        if ~exist('models', 'dir')
            mkdir('models');
        end
        net = lstm_model;
        save(model_path, 'net');
        fprintf('   LSTM model saved to %s\n', model_path);
    end
end

function net = train_lstm_model()
    % Train LSTM network for sensor time-series prediction
    
    fprintf('   Creating LSTM architecture...\n');
    
    % Define LSTM layers
    inputSize = 3; % temperature, humidity, soil_moisture
    numHiddenUnits = 50;
    numClasses = 3; % predicting next values for 3 features
    
    layers = [
        sequenceInputLayer(inputSize, 'Name', 'input')
        lstmLayer(numHiddenUnits, 'OutputMode', 'sequence', 'Name', 'lstm1')
        dropoutLayer(0.2, 'Name', 'dropout1')
        lstmLayer(numHiddenUnits/2, 'OutputMode', 'last', 'Name', 'lstm2')
        dropoutLayer(0.2, 'Name', 'dropout2')
        fullyConnectedLayer(numClasses, 'Name', 'fc')
        regressionLayer('Name', 'output')
    ];
    
    % Generate synthetic training data
    [XTrain, YTrain] = generate_synthetic_sensor_data();
    
    % Training options
    options = trainingOptions('adam', ...
        'MaxEpochs', 50, ...
        'MiniBatchSize', 32, ...
        'InitialLearnRate', 0.01, ...
        'GradientThreshold', 1, ...
        'Verbose', false, ...
        'Plots', 'none');
    
    % Train the network
    fprintf('   Training LSTM (this may take a few moments)...\n');
    net = trainNetwork(XTrain, YTrain, layers, options);
    
    fprintf('   LSTM training completed\n');
end

function [XTrain, YTrain] = generate_synthetic_sensor_data()
    % Generate synthetic time-series data for LSTM training
    
    num_sequences = 200;
    sequence_length = 24; % 24 hours of hourly data
    num_features = 3; % temperature, humidity, soil_moisture
    prediction_horizon = 6; % predict next 6 hours
    
    XTrain = cell(num_sequences, 1);
    YTrain = cell(num_sequences, 1);
    
    for seq = 1:num_sequences
        % Generate realistic sensor patterns
        time_vector = 1:sequence_length;
        
        % Temperature: diurnal pattern with noise
        temp_base = 25 + 8 * sin(2*pi*time_vector/24) + 2*randn(1, sequence_length);
        temp_normalized = (temp_base - 15) / 20; % Normalize to ~[0,1]
        
        % Humidity: inverse correlation with temperature + noise
        humidity_base = 70 - 20 * sin(2*pi*time_vector/24) + 5*randn(1, sequence_length);
        humidity_normalized = humidity_base / 100; % Normalize to [0,1]
        
        % Soil moisture: slowly decreasing with irrigation spikes
        moisture_base = 60 - 0.5*time_vector + 10*randn(1, sequence_length);
        % Add irrigation spikes randomly
        irrigation_times = rand(1, sequence_length) < 0.1;
        moisture_base(irrigation_times) = moisture_base(irrigation_times) + 20;
        moisture_normalized = max(0, min(1, moisture_base / 100));
        
        % Combine features
        sequence_data = [temp_normalized; humidity_normalized; moisture_normalized]';
        
        % Input: all but last prediction_horizon steps
        XTrain{seq} = sequence_data(1:end-prediction_horizon, :)';
        
        % Output: mean of next prediction_horizon steps
        future_data = sequence_data(end-prediction_horizon+1:end, :);
        YTrain{seq} = mean(future_data, 1)';
    end
end

function raw_predictions = generate_lstm_predictions(lstm_model, processed_data)
    % Generate predictions using trained LSTM model
    
    sequence_length = 20; % Use last 20 timesteps for prediction
    num_timesteps = size(processed_data, 1);
    
    if num_timesteps < sequence_length
        % If insufficient data, pad with last available values
        last_values = processed_data(end, :);
        padding = repmat(last_values, sequence_length - num_timesteps, 1);
        input_sequence = [processed_data; padding];
    else
        % Use last sequence_length timesteps
        input_sequence = processed_data(end-sequence_length+1:end, :);
    end
    
    % Prepare input for LSTM (features x timesteps)
    lstm_input = input_sequence';
    
    try
        % Make prediction
        raw_predictions = predict(lstm_model, lstm_input);
        fprintf('   LSTM prediction generated\n');
    catch ME
        fprintf('   LSTM prediction failed: %s\n', ME.message);
        % Fallback: use last known values
        raw_predictions = processed_data(end, :)';
    end
end

function prediction = postprocess_predictions(raw_predictions, scaler_params, sensor_history)
    % Post-process LSTM predictions and create output structure
    
    % Denormalize predictions
    denormalized_predictions = zeros(size(raw_predictions));
    
    for feature = 1:length(raw_predictions)
        min_val = scaler_params.min_vals(feature);
        max_val = scaler_params.max_vals(feature);
        
        denormalized_predictions(feature) = raw_predictions(feature) * (max_val - min_val) + min_val;
    end
    
    % Create prediction structure
    feature_names = {'temperature', 'humidity', 'soil_moisture'};
    
    prediction = struct();
    prediction.timestamp = datestr(now, 'yyyy-mm-dd HH:MM:SS');
    prediction.model_version = 'lstm_v2.0';
    prediction.prediction_horizon = '6 hours';
    
    % Individual predictions
    for i = 1:min(length(feature_names), length(denormalized_predictions))
        prediction.(feature_names{i}) = denormalized_predictions(i);
    end
    
    % Calculate trends
    if size(sensor_history, 1) >= 2
        recent_values = sensor_history(end-1:end, :);
        trends = recent_values(2, :) - recent_values(1, :);
        
        prediction.temperature_trend = trends(1);
        if length(trends) > 1
            prediction.humidity_trend = trends(2);
        end
        if length(trends) > 2
            prediction.soil_moisture_trend = trends(3);
        end
    end
    
    % Confidence based on prediction stability
    prediction.confidence = calculate_prediction_confidence(raw_predictions, sensor_history);
    
    fprintf('   Predictions post-processed\n');
end

function confidence = calculate_prediction_confidence(raw_predictions, sensor_history)
    % Calculate confidence based on prediction stability and data quality
    
    base_confidence = 0.8;
    
    % Reduce confidence if predictions are extreme
    if any(raw_predictions < 0.1) || any(raw_predictions > 0.9)
        base_confidence = base_confidence * 0.9;
    end
    
    % Reduce confidence if sensor history is short
    if size(sensor_history, 1) < 10
        base_confidence = base_confidence * 0.8;
    end
    
    % Add small random variation
    confidence = max(0.3, min(1.0, base_confidence + 0.05 * randn()));
end

function prediction = generate_fallback_prediction(sensor_history)
    % Generate simple trend-based prediction as fallback
    
    fprintf('   Generating trend-based fallback prediction...\n');
    
    if isempty(sensor_history) || size(sensor_history, 1) < 2
        % Default values if no history
        prediction = struct(...
            'temperature', 25.0, ...
            'humidity', 60.0, ...
            'soil_moisture', 50.0, ...
            'confidence', 0.3, ...
            'timestamp', datestr(now, 'yyyy-mm-dd HH:MM:SS'), ...
            'model_version', 'fallback_v1.0' ...
        );
        return;
    end
    
    % Calculate simple moving average
    window_size = min(5, size(sensor_history, 1));
    recent_data = sensor_history(end-window_size+1:end, :);
    mean_values = mean(recent_data, 1);
    
    % Calculate trend
    if size(sensor_history, 1) >= 3
        trend = mean(sensor_history(end-2:end, :), 1) - mean(sensor_history(1:3, :), 1);
        predicted_values = mean_values + 0.5 * trend; % Project trend forward
    else
        predicted_values = mean_values;
    end
    
    % Create prediction structure
    feature_names = {'temperature', 'humidity', 'soil_moisture'};
    prediction = struct();
    
    for i = 1:min(length(feature_names), length(predicted_values))
        prediction.(feature_names{i}) = predicted_values(i);
    end
    
    prediction.confidence = 0.6; % Medium confidence for trend-based prediction
    prediction.timestamp = datestr(now, 'yyyy-mm-dd HH:MM:SS');
    prediction.model_version = 'fallback_v1.0';
    prediction.prediction_horizon = '6 hours';
end
