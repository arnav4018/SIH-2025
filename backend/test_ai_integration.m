% Comprehensive Integration Test for AI-Enabled Agricultural Monitoring System
% Tests the complete pipeline: MQTT data -> AI functions -> Alert generation
% Created for SIH-2025 integration validation

function test_ai_integration()
    % Main test function for AI integration
    
    fprintf('=== AI INTEGRATION TEST ===\n');
    fprintf('Testing complete agricultural monitoring pipeline...\n\n');
    
    % Test configuration
    test_results = struct();
    test_results.tests_passed = 0;
    test_results.tests_failed = 0;
    test_results.start_time = datetime('now');
    
    try
        % Test 1: AI Integration Layer
        fprintf('[Test 1/6] Testing AI Integration Layer...\n');
        test_ai_layer(test_results);
        
        % Test 2: Hyperspectral Data Generation
        fprintf('\n[Test 2/6] Testing Hyperspectral Data Generation...\n');
        test_hyperspectral_generation(test_results);
        
        % Test 3: Sensor History Preparation
        fprintf('\n[Test 3/6] Testing Sensor History Preparation...\n');
        test_sensor_history(test_results);
        
        % Test 4: AI Function Integration
        fprintf('\n[Test 4/6] Testing AI Function Calls...\n');
        test_ai_function_calls(test_results);
        
        % Test 5: End-to-End Pipeline
        fprintf('\n[Test 5/6] Testing End-to-End Pipeline...\n');
        test_full_pipeline(test_results);
        
        % Test 6: Error Handling
        fprintf('\n[Test 6/6] Testing Error Handling and Fallbacks...\n');
        test_error_handling(test_results);
        
        % Final Results
        fprintf('\n=== TEST RESULTS ===\n');
        fprintf('Tests Passed: %d\n', test_results.tests_passed);
        fprintf('Tests Failed: %d\n', test_results.tests_failed);
        total_tests = test_results.tests_passed + test_results.tests_failed;
        success_rate = test_results.tests_passed / max(1, total_tests) * 100;
        fprintf('Success Rate: %.1f%%\n', success_rate);
        
        test_duration = datetime('now') - test_results.start_time;
        fprintf('Test Duration: %s\n', string(test_duration));
        
        if test_results.tests_failed == 0
            fprintf('\n✅ ALL TESTS PASSED! AI integration is working correctly.\n');
        else
            fprintf('\n⚠️  Some tests failed. Check the output above for details.\n');
        end
        
    catch ME
        fprintf('\n❌ CRITICAL ERROR in integration test: %s\n', ME.message);
        fprintf('Stack trace:\n');
        for i = 1:length(ME.stack)
            fprintf('  %s (line %d)\n', ME.stack(i).name, ME.stack(i).line);
        end
    end
end

function test_ai_layer(test_results)
    % Test AI integration layer initialization
    
    try
        % Test layer creation
        ai = ai_integration_layer();
        
        % Check that all required functions exist
        required_functions = {'generate_hyperspectral_data', 'prepare_sensor_history', ...
                            'call_analyze_image', 'call_predict_stress', 'call_generate_alert', ...
                            'convert_health_map_to_legacy', 'create_current_stats'};
        
        all_functions_exist = true;
        for i = 1:length(required_functions)
            if ~isfield(ai, required_functions{i})
                fprintf('   ❌ Missing function: %s\n', required_functions{i});
                all_functions_exist = false;
            end
        end
        
        if all_functions_exist
            fprintf('   ✅ AI integration layer created successfully\n');
            test_results.tests_passed = test_results.tests_passed + 1;
        else
            fprintf('   ❌ AI integration layer missing functions\n');
            test_results.tests_failed = test_results.tests_failed + 1;
        end
        
    catch ME
        fprintf('   ❌ Failed to create AI integration layer: %s\n', ME.message);
        test_results.tests_failed = test_results.tests_failed + 1;
    end
end

function test_hyperspectral_generation(test_results)
    % Test hyperspectral data generation
    
    try
        ai = ai_integration_layer();
        
        % Test 1: Generate synthetic data with size specification
        hyperspectral_data = ai.generate_hyperspectral_data([64, 64]);
        
        if size(hyperspectral_data, 1) == 64 && size(hyperspectral_data, 2) == 64 && size(hyperspectral_data, 3) > 20
            fprintf('   ✅ Synthetic hyperspectral generation works\n');
            test_results.tests_passed = test_results.tests_passed + 1;
        else
            fprintf('   ❌ Synthetic hyperspectral has wrong dimensions: %dx%dx%d\n', ...
                    size(hyperspectral_data, 1), size(hyperspectral_data, 2), size(hyperspectral_data, 3));
            test_results.tests_failed = test_results.tests_failed + 1;
        end
        
        % Test 2: Check data quality
        data_range = [min(hyperspectral_data(:)), max(hyperspectral_data(:))];
        if data_range(1) >= 0 && data_range(2) <= 1 && ~any(isnan(hyperspectral_data(:)))
            fprintf('   ✅ Hyperspectral data quality is good (range: %.3f - %.3f)\n', data_range(1), data_range(2));
            test_results.tests_passed = test_results.tests_passed + 1;
        else
            fprintf('   ❌ Hyperspectral data quality issues (range: %.3f - %.3f, NaN: %d)\n', ...
                    data_range(1), data_range(2), sum(isnan(hyperspectral_data(:))));
            test_results.tests_failed = test_results.tests_failed + 1;
        end
        
    catch ME
        fprintf('   ❌ Hyperspectral generation failed: %s\n', ME.message);
        test_results.tests_failed = test_results.tests_failed + 2; % Two sub-tests failed
    end
end

function test_sensor_history(test_results)
    % Test sensor history preparation
    
    try
        ai = ai_integration_layer();
        
        % Create mock sensor data
        sensor_data = struct();
        sensor_data.temperature = 26.5;
        sensor_data.humidity = 65.0;
        sensor_data.soil_moisture = 45.0;
        sensor_data.ph = 6.8;
        
        % Test history generation
        sensor_history = ai.prepare_sensor_history(sensor_data, 24);
        
        % Check dimensions
        if size(sensor_history, 1) == 24 && size(sensor_history, 2) == 3
            fprintf('   ✅ Sensor history has correct dimensions: %dx%d\n', ...
                    size(sensor_history, 1), size(sensor_history, 2));
            test_results.tests_passed = test_results.tests_passed + 1;
        else
            fprintf('   ❌ Sensor history wrong dimensions: %dx%d (expected 24x3)\n', ...
                    size(sensor_history, 1), size(sensor_history, 2));
            test_results.tests_failed = test_results.tests_failed + 1;
        end
        
        % Check data quality
        temp_range = [min(sensor_history(:, 1)), max(sensor_history(:, 1))];
        humidity_range = [min(sensor_history(:, 2)), max(sensor_history(:, 2))];
        moisture_range = [min(sensor_history(:, 3)), max(sensor_history(:, 3))];
        
        if temp_range(1) > 0 && temp_range(2) < 50 && ...
           humidity_range(1) >= 20 && humidity_range(2) <= 95 && ...
           moisture_range(1) >= 10 && moisture_range(2) <= 100
            fprintf('   ✅ Sensor history data ranges are realistic\n');
            fprintf('      Temperature: %.1f - %.1f°C\n', temp_range(1), temp_range(2));
            fprintf('      Humidity: %.1f - %.1f%%\n', humidity_range(1), humidity_range(2));
            fprintf('      Moisture: %.1f - %.1f%%\n', moisture_range(1), moisture_range(2));
            test_results.tests_passed = test_results.tests_passed + 1;
        else
            fprintf('   ❌ Sensor history data ranges are unrealistic\n');
            test_results.tests_failed = test_results.tests_failed + 1;
        end
        
    catch ME
        fprintf('   ❌ Sensor history preparation failed: %s\n', ME.message);
        test_results.tests_failed = test_results.tests_failed + 2; % Two sub-tests failed
    end
end

function test_ai_function_calls(test_results)
    % Test AI function integration
    
    try
        ai = ai_integration_layer();
        
        % Test 1: Image analysis integration
        fprintf('   Testing image analysis integration...\n');
        [ai_health_map, image_result] = ai.call_analyze_image([32, 32]);
        
        if ~isempty(ai_health_map) && isstruct(image_result) && isfield(image_result, 'status')
            fprintf('   ✅ Image analysis integration successful (status: %s)\n', image_result.status);
            test_results.tests_passed = test_results.tests_passed + 1;
            
            % Check health map
            unique_values = unique(ai_health_map(:));
            if all(ismember(unique_values, [1, 2, 3]))
                fprintf('      ✅ Health map has correct categorical values\n');
                test_results.tests_passed = test_results.tests_passed + 1;
            else
                fprintf('      ❌ Health map has incorrect values: %s\n', mat2str(unique_values));
                test_results.tests_failed = test_results.tests_failed + 1;
            end
        else
            fprintf('   ❌ Image analysis integration failed\n');
            test_results.tests_failed = test_results.tests_failed + 2;
        end
        
        % Test 2: Stress prediction integration
        fprintf('   Testing stress prediction integration...\n');
        mock_sensor_data = struct('temperature', 28, 'humidity', 70, 'soil_moisture', 40);
        [sensor_prediction, stress_result] = ai.call_predict_stress(mock_sensor_data);
        
        if isstruct(sensor_prediction) && isstruct(stress_result) && isfield(stress_result, 'status')
            fprintf('   ✅ Stress prediction integration successful (status: %s)\n', stress_result.status);
            test_results.tests_passed = test_results.tests_passed + 1;
            
            % Check prediction content
            required_fields = {'soil_moisture', 'temperature', 'confidence'};
            has_required_fields = all(cellfun(@(f) isfield(sensor_prediction, f), required_fields));
            
            if has_required_fields
                fprintf('      ✅ Prediction has required fields\n');
                test_results.tests_passed = test_results.tests_passed + 1;
            else
                fprintf('      ❌ Prediction missing required fields\n');
                test_results.tests_failed = test_results.tests_failed + 1;
            end
        else
            fprintf('   ❌ Stress prediction integration failed\n');
            test_results.tests_failed = test_results.tests_failed + 2;
        end
        
        % Test 3: Alert generation integration
        fprintf('   Testing alert generation integration...\n');
        current_stats = ai.create_current_stats(mock_sensor_data, ai_health_map);
        alert_message = ai.call_generate_alert(ai_health_map, sensor_prediction, current_stats);
        
        if ischar(alert_message) && length(alert_message) > 10
            fprintf('   ✅ Alert generation successful\n');
            fprintf('      Generated: %s...\n', alert_message(1:min(60, length(alert_message))));
            test_results.tests_passed = test_results.tests_passed + 1;
        else
            fprintf('   ❌ Alert generation failed or produced empty result\n');
            test_results.tests_failed = test_results.tests_failed + 1;
        end
        
    catch ME
        fprintf('   ❌ AI function integration test failed: %s\n', ME.message);
        test_results.tests_failed = test_results.tests_failed + 6; % All sub-tests failed
    end
end

function test_full_pipeline(test_results)
    % Test the complete pipeline using run_main_analysis_final
    
    try
        fprintf('   Running complete analysis pipeline...\n');
        
        % Create mock sensor data file
        create_mock_sensor_data();
        
        % Run the full analysis
        [health_map, alert_message, stats] = run_main_analysis_final();
        
        % Check outputs
        if ~isempty(health_map) && ischar(alert_message) && isstruct(stats)
            fprintf('   ✅ Pipeline completed successfully\n');
            test_results.tests_passed = test_results.tests_passed + 1;
            
            % Check health map
            if isnumeric(health_map) && all(health_map(:) >= 0) && all(health_map(:) <= 1)
                fprintf('      ✅ Health map format correct (legacy 0-1 scale)\n');
                test_results.tests_passed = test_results.tests_passed + 1;
            else
                fprintf('      ❌ Health map format incorrect\n');
                test_results.tests_failed = test_results.tests_failed + 1;
            end
            
            % Check statistics
            required_stat_fields = {'temperature', 'humidity', 'soil_moisture', 'ai_confidence', ...
                                   'predicted_soil_moisture', 'alert_level', 'analysis_timestamp'};
            missing_fields = {};
            for i = 1:length(required_stat_fields)
                if ~isfield(stats, required_stat_fields{i})
                    missing_fields{end+1} = required_stat_fields{i};
                end
            end
            
            if isempty(missing_fields)
                fprintf('      ✅ Statistics structure complete\n');
                fprintf('         Alert Level: %s\n', stats.alert_level);
                fprintf('         AI Confidence: %.1f%%\n', stats.ai_confidence * 100);
                fprintf('         Data Source: %s\n', stats.data_source);
                test_results.tests_passed = test_results.tests_passed + 1;
            else
                fprintf('      ❌ Statistics missing fields: %s\n', strjoin(missing_fields, ', '));
                test_results.tests_failed = test_results.tests_failed + 1;
            end
            
            % Check alert message
            if contains(alert_message, '[') && (contains(alert_message, 'INFO') || ...
               contains(alert_message, 'WARNING') || contains(alert_message, 'CRITICAL'))
                fprintf('      ✅ Alert message properly formatted\n');
                test_results.tests_passed = test_results.tests_passed + 1;
            else
                fprintf('      ❌ Alert message format incorrect\n');
                test_results.tests_failed = test_results.tests_failed + 1;
            end
            
        else
            fprintf('   ❌ Pipeline failed to produce valid outputs\n');
            test_results.tests_failed = test_results.tests_failed + 4; % All sub-tests failed
        end
        
        % Clean up
        cleanup_mock_data();
        
    catch ME
        fprintf('   ❌ Full pipeline test failed: %s\n', ME.message);
        test_results.tests_failed = test_results.tests_failed + 4;
        cleanup_mock_data();
    end
end

function test_error_handling(test_results)
    % Test error handling and fallback mechanisms
    
    try
        % Test 1: Missing AI functions (simulate by temporarily renaming directory)
        fprintf('   Testing fallback when AI functions unavailable...\n');
        
        ai = ai_integration_layer();
        
        % Test with non-existent image path
        [health_map, image_result] = ai.call_analyze_image('non_existent_image.jpg');
        
        if ~isempty(health_map) && strcmp(image_result.status, 'fallback')
            fprintf('   ✅ Image analysis fallback working\n');
            test_results.tests_passed = test_results.tests_passed + 1;
        else
            fprintf('   ❌ Image analysis fallback failed\n');
            test_results.tests_failed = test_results.tests_failed + 1;
        end
        
        % Test 2: Invalid sensor data
        fprintf('   Testing with invalid sensor data...\n');
        invalid_sensor_data = struct('temperature', NaN, 'humidity', Inf, 'soil_moisture', -50);
        [prediction, stress_result] = ai.call_predict_stress(invalid_sensor_data);
        
        if isstruct(prediction) && isfield(stress_result, 'status')
            fprintf('   ✅ Stress prediction handles invalid data\n');
            test_results.tests_passed = test_results.tests_passed + 1;
        else
            fprintf('   ❌ Stress prediction failed with invalid data\n');
            test_results.tests_failed = test_results.tests_failed + 1;
        end
        
        % Test 3: Emergency fallback mode
        fprintf('   Testing emergency fallback mode...\n');
        
        % Create condition that triggers fallback
        create_empty_sensor_data();
        
        try
            [health_map, alert_message, stats] = run_main_analysis_final();
            
            if isfield(stats, 'data_source') && contains(stats.data_source, 'fallback')
                fprintf('   ✅ Emergency fallback activated correctly\n');
                test_results.tests_passed = test_results.tests_passed + 1;
            else
                fprintf('   ❌ Emergency fallback not activated\n');
                test_results.tests_failed = test_results.tests_failed + 1;
            end
        catch ME
            % Even the fallback failed, which shouldn't happen
            fprintf('   ❌ Emergency fallback also failed: %s\n', ME.message);
            test_results.tests_failed = test_results.tests_failed + 1;
        end
        
        cleanup_mock_data();
        
    catch ME
        fprintf('   ❌ Error handling test failed: %s\n', ME.message);
        test_results.tests_failed = test_results.tests_failed + 3;
        cleanup_mock_data();
    end
end

function create_mock_sensor_data()
    % Create realistic mock sensor data for testing
    
    sensor_data = struct();
    sensor_data.temperature = 27.5 + 2 * randn();
    sensor_data.humidity = 68.0 + 5 * randn();
    sensor_data.soil_moisture = 42.0 + 3 * randn();
    sensor_data.ph = 6.8 + 0.2 * randn();
    sensor_data.light_intensity = 850 + 50 * randn();
    sensor_data.latitude = 40.7128 + 0.01 * randn();
    sensor_data.longitude = -74.0060 + 0.01 * randn();
    sensor_data.timestamp = datetime('now');
    sensor_data.data_quality = 0.85 + 0.1 * randn();
    sensor_data.data_source = 'test_mock_data';
    
    % Save to file
    save('latest_sensor_data.mat', 'sensor_data');
end

function create_empty_sensor_data()
    % Create empty/corrupted sensor data to test fallback
    
    sensor_data = struct();
    sensor_data.temperature = NaN;
    sensor_data.humidity = NaN;
    sensor_data.soil_moisture = NaN;
    sensor_data.timestamp = datetime('now') - hours(2); % Old data
    sensor_data.data_quality = 0.1; % Poor quality
    
    save('latest_sensor_data.mat', 'sensor_data');
end

function cleanup_mock_data()
    % Clean up test files
    
    if exist('latest_sensor_data.mat', 'file')
        delete('latest_sensor_data.mat');
    end
end
