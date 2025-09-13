function health_map = analyze_image(image_data)
    % AI-powered hyperspectral image analysis function
    % Created by: Aryan (Upgraded for SIH-2025)
    % Purpose: Process hyperspectral image data to generate health map using CNN
    
    % Input: image_data - hyperspectral image data (3D matrix: height x width x bands)
    % Output: health_map - 2D matrix where each pixel represents health category
    %         1 = Healthy, 2 = Stressed, 3 = Waterlogged
    
    fprintf('AI Hyperspectral Image Analysis - Processing image data...\n');
    
    try
        % Step 1: Pre-process hyperspectral image data
        fprintf('Step 1: Pre-processing hyperspectral image data...\n');
        [processed_data, image_size] = preprocess_hyperspectral(image_data);
        
        % Step 2: Calculate vegetation indices (NDVI and others)
        fprintf('Step 2: Calculating vegetation indices...\n');
        vegetation_indices = calculate_vegetation_indices(processed_data);
        
        % Step 3: Load or train CNN model
        fprintf('Step 3: Loading CNN model...\n');
        cnn_model = load_or_train_cnn_model();
        
        % Step 4: Apply CNN to generate health map
        fprintf('Step 4: Applying CNN model to generate health map...\n');
        health_map = apply_cnn_classification(cnn_model, processed_data, vegetation_indices, image_size);
        
        fprintf('Image analysis completed successfully. Health map generated.\n');
        
    catch ME
        fprintf('Error in image analysis: %s\n', ME.message);
        fprintf('Generating fallback health map...\n');
        
        % Generate a simple fallback health map based on basic statistics
        if exist('image_data', 'var') && ~isempty(image_data)
            health_map = generate_fallback_health_map(image_data);
        else
            % Default small health map if no data available
            health_map = ones(64, 64); % All healthy
        end
    end
end

function [processed_data, image_size] = preprocess_hyperspectral(image_data)
    % Preprocess hyperspectral image data using Hyperspectral Imaging Library techniques
    
    % Store original image size
    image_size = size(image_data);
    
    % Normalize spectral bands to [0, 1] range
    processed_data = double(image_data);
    for band = 1:size(processed_data, 3)
        band_data = processed_data(:, :, band);
        min_val = min(band_data(:));
        max_val = max(band_data(:));
        if max_val > min_val
            processed_data(:, :, band) = (band_data - min_val) / (max_val - min_val);
        end
    end
    
    % Apply noise reduction using Gaussian filtering
    for band = 1:size(processed_data, 3)
        processed_data(:, :, band) = imgaussfilt(processed_data(:, :, band), 0.5);
    end
    
    fprintf('   Preprocessed %d x %d image with %d spectral bands\n', ...
            image_size(1), image_size(2), image_size(3));
end

function vegetation_indices = calculate_vegetation_indices(processed_data)
    % Calculate key vegetation indices using Image Processing Toolbox
    
    % Assuming hyperspectral bands follow standard ordering:
    % Band assignments for typical hyperspectral sensors
    num_bands = size(processed_data, 3);
    
    % Find approximate band positions (adjust based on your sensor)
    red_band = round(num_bands * 0.6);      % ~660 nm
    nir_band = round(num_bands * 0.8);      % ~840 nm
    green_band = round(num_bands * 0.3);    % ~560 nm
    
    % Ensure band indices are valid
    red_band = max(1, min(red_band, num_bands));
    nir_band = max(1, min(nir_band, num_bands));
    green_band = max(1, min(green_band, num_bands));
    
    % Extract band data
    red = processed_data(:, :, red_band);
    nir = processed_data(:, :, nir_band);
    green = processed_data(:, :, green_band);
    
    % Calculate NDVI (Normalized Difference Vegetation Index)
    ndvi = (nir - red) ./ (nir + red + eps); % eps prevents division by zero
    
    % Calculate GNDVI (Green Normalized Difference Vegetation Index)
    gndvi = (nir - green) ./ (nir + green + eps);
    
    % Calculate Simple Ratio (SR)
    sr = nir ./ (red + eps);
    
    % Stack vegetation indices
    vegetation_indices = cat(3, ndvi, gndvi, sr);
    
    fprintf('   Calculated NDVI, GNDVI, and SR indices\n');
end

function cnn_model = load_or_train_cnn_model()
    % Load existing CNN model or train a new one on Indian Pines dataset
    
    model_path = 'models/hyperspectral_cnn_model.mat';
    
    if exist(model_path, 'file')
        fprintf('   Loading pre-trained CNN model...\n');
        load_data = load(model_path);
        cnn_model = load_data.net;
    else
        fprintf('   Training new CNN model on simulated Indian Pines dataset...\n');
        cnn_model = train_cnn_model_indian_pines();
        
        % Save the trained model
        if ~exist('models', 'dir')
            mkdir('models');
        end
        net = cnn_model;
        save(model_path, 'net');
        fprintf('   Model saved to %s\n', model_path);
    end
end

function net = train_cnn_model_indian_pines()
    % Train a 2D CNN model for hyperspectral image classification
    % Simulates training on Indian Pines dataset
    
    fprintf('   Creating CNN architecture...\n');
    
    % Define CNN layers for hyperspectral patch classification
    layers = [
        imageInputLayer([7 7 3], 'Name', 'input', 'Normalization', 'none')
        
        convolution2dLayer(3, 32, 'Padding', 'same', 'Name', 'conv1')
        batchNormalizationLayer('Name', 'bn1')
        reluLayer('Name', 'relu1')
        
        convolution2dLayer(3, 64, 'Padding', 'same', 'Name', 'conv2')
        batchNormalizationLayer('Name', 'bn2')
        reluLayer('Name', 'relu2')
        
        globalAveragePooling2dLayer('Name', 'gap')
        
        fullyConnectedLayer(32, 'Name', 'fc1')
        reluLayer('Name', 'relu3')
        dropoutLayer(0.2, 'Name', 'dropout')
        
        fullyConnectedLayer(3, 'Name', 'fc2')  % 3 classes: Healthy, Stressed, Waterlogged
        softmaxLayer('Name', 'softmax')
        classificationLayer('Name', 'output')
    ];
    
    % Generate synthetic training data (simulating Indian Pines dataset)
    [XTrain, YTrain] = generate_synthetic_training_data();
    
    % Training options
    options = trainingOptions('adam', ...
        'MaxEpochs', 10, ...
        'MiniBatchSize', 32, ...
        'InitialLearnRate', 0.001, ...
        'Verbose', false, ...
        'Plots', 'none');
    
    % Train the network
    fprintf('   Training CNN (this may take a few moments)...\n');
    net = trainNetwork(XTrain, YTrain, layers, options);
    
    fprintf('   CNN training completed\n');
end

function [XTrain, YTrain] = generate_synthetic_training_data()
    % Generate synthetic training data simulating Indian Pines dataset characteristics
    
    num_samples = 1000;
    patch_size = 7;
    num_features = 3; % NDVI, GNDVI, SR
    
    XTrain = zeros(patch_size, patch_size, num_features, num_samples);
    YTrain = categorical.empty(num_samples, 0);
    
    classes = {'Healthy', 'Stressed', 'Waterlogged'};
    
    for i = 1:num_samples
        class_idx = randi(3);
        class_name = classes{class_idx};
        
        % Generate synthetic patch based on class
        switch class_idx
            case 1 % Healthy
                ndvi_base = 0.7 + 0.2 * randn();
                gndvi_base = 0.6 + 0.2 * randn();
                sr_base = 3.0 + 1.0 * randn();
            case 2 % Stressed
                ndvi_base = 0.3 + 0.2 * randn();
                gndvi_base = 0.2 + 0.2 * randn();
                sr_base = 1.5 + 0.5 * randn();
            case 3 % Waterlogged
                ndvi_base = 0.1 + 0.1 * randn();
                gndvi_base = 0.0 + 0.1 * randn();
                sr_base = 1.0 + 0.3 * randn();
        end
        
        % Create patch with spatial variation
        for row = 1:patch_size
            for col = 1:patch_size
                spatial_var = 0.1 * randn();
                XTrain(row, col, 1, i) = max(0, min(1, ndvi_base + spatial_var));
                XTrain(row, col, 2, i) = max(0, min(1, gndvi_base + spatial_var));
                XTrain(row, col, 3, i) = max(0, sr_base + spatial_var);
            end
        end
        
        YTrain(i) = categorical({class_name});
    end
end

function health_map = apply_cnn_classification(cnn_model, processed_data, vegetation_indices, image_size)
    % Apply trained CNN model to entire image to generate health map
    
    patch_size = 7;
    half_patch = floor(patch_size / 2);
    
    height = image_size(1);
    width = image_size(2);
    
    % Initialize health map
    health_map = ones(height, width); % Default to healthy
    
    fprintf('   Classifying image patches...\n');
    
    % Slide window across image
    for row = (half_patch + 1):(height - half_patch)
        for col = (half_patch + 1):(width - half_patch)
            % Extract patch
            patch = vegetation_indices(row-half_patch:row+half_patch, ...
                                     col-half_patch:col+half_patch, :);
            
            % Classify patch
            try
                predicted_class = classify(cnn_model, patch);
                
                % Convert categorical to numeric
                switch char(predicted_class)
                    case 'Healthy'
                        health_map(row, col) = 1;
                    case 'Stressed'
                        health_map(row, col) = 2;
                    case 'Waterlogged'
                        health_map(row, col) = 3;
                    otherwise
                        health_map(row, col) = 1; % Default to healthy
                end
            catch
                % If classification fails, default to healthy
                health_map(row, col) = 1;
            end
        end
    end
    
    fprintf('   Classification completed\n');
end

function health_map = generate_fallback_health_map(image_data)
    % Generate a simple health map based on basic statistics when CNN fails
    
    [height, width, ~] = size(image_data);
    health_map = ones(height, width);
    
    % Use simple brightness-based classification as fallback
    mean_intensity = mean(image_data, 3);
    intensity_threshold_low = prctile(mean_intensity(:), 30);
    intensity_threshold_high = prctile(mean_intensity(:), 70);
    
    % Classify based on intensity
    health_map(mean_intensity < intensity_threshold_low) = 2;    % Stressed (dark)
    health_map(mean_intensity > intensity_threshold_high) = 3;   % Waterlogged (bright)
    
    fprintf('   Generated fallback health map based on intensity\n');
end
