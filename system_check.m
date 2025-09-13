% System Check Script for SIH-2025 Agricultural Monitoring Integration
% This script checks if all components are working properly

function system_check()
    fprintf('=== SIH-2025 AGRICULTURAL MONITORING SYSTEM CHECK ===\n');
    fprintf('Checking integration status and component functionality...\n\n');
    
    check_results = struct();
    check_results.total_checks = 0;
    check_results.passed_checks = 0;
    check_results.failed_checks = 0;
    
    try
        %% Check 1: File Structure
        fprintf('[1] Checking File Structure...\n');
        [check_results] = check_file_structure(check_results);
        
        %% Check 2: MATLAB Toolboxes
        fprintf('\n[2] Checking MATLAB Toolboxes...\n');
        [check_results] = check_toolboxes(check_results);
        
        %% Check 3: AI Integration Layer
        fprintf('\n[3] Checking AI Integration Layer...\n');
        [check_results] = check_ai_integration_layer(check_results);
        
        %% Check 4: AI Functions
        fprintf('\n[4] Checking AI Functions...\n');
        [check_results] = check_ai_functions(check_results);
        
        %% Check 5: Backend Integration  
        fprintf('\n[5] Checking Backend Integration...\n');
        [check_results] = check_backend_integration(check_results);
        
        %% Check 6: Data Generation
        fprintf('\n[6] Checking Data Generation Capabilities...\n');
        [check_results] = check_data_generation(check_results);
        
        %% Summary
        fprintf('\n=== SYSTEM CHECK SUMMARY ===\n');
        fprintf('Total Checks: %d\n', check_results.total_checks);
        fprintf('Passed: %d\n', check_results.passed_checks);
        fprintf('Failed: %d\n', check_results.failed_checks);
        success_rate = check_results.passed_checks / max(1, check_results.total_checks) * 100;
        fprintf('Success Rate: %.1f%%\n', success_rate);
        
        if check_results.failed_checks == 0
            fprintf('\n✅ ALL SYSTEMS OPERATIONAL!\n');
            fprintf('The AI integration is working correctly.\n');
        elseif success_rate > 75
            fprintf('\n⚠️ MOSTLY OPERATIONAL\n');
            fprintf('System is functional with minor issues.\n');
        else
            fprintf('\n❌ SYSTEM ISSUES DETECTED\n');
            fprintf('Several components need attention.\n');
        end
        
        %% Recommendations
        fprintf('\n=== RECOMMENDATIONS ===\n');
        provide_recommendations(check_results);
        
    catch ME
        fprintf('\n❌ CRITICAL ERROR in system check: %s\n', ME.message);
        fprintf('Location: %s (line %d)\n', ME.stack(1).name, ME.stack(1).line);
    end
end

function [check_results] = check_file_structure(check_results)
    required_files = {
        'ai/analyze_image.m',
        'ai/predict_stress.m', 
        'ai/generate_alert.m',
        'ai/demo_ai_functions.m',
        'backend/ai_integration_layer.m',
        'backend/run_main_analysis_final.m',
        'backend/test_ai_integration.m',
        'backend/demo_integrated_system.m'
    };
    
    files_found = 0;
    for i = 1:length(required_files)
        check_results.total_checks = check_results.total_checks + 1;
        if exist(required_files{i}, 'file')
            fprintf('   ✅ %s\n', required_files{i});
            files_found = files_found + 1;
            check_results.passed_checks = check_results.passed_checks + 1;
        else
            fprintf('   ❌ %s (MISSING)\n', required_files{i});
            check_results.failed_checks = check_results.failed_checks + 1;
        end
    end
    
    fprintf('   Files Found: %d/%d\n', files_found, length(required_files));
end

function [check_results] = check_toolboxes(check_results)
    toolboxes = {
        'Deep Learning Toolbox',
        'Image Processing Toolbox',
        'Statistics and Machine Learning Toolbox'
    };
    
    % Check if license function exists
    check_results.total_checks = check_results.total_checks + 1;
    try
        license_info = license;
        fprintf('   ✅ License function available\n');
        check_results.passed_checks = check_results.passed_checks + 1;
    catch
        fprintf('   ❌ License function not available\n');
        check_results.failed_checks = check_results.failed_checks + 1;
        return;
    end
    
    % Check for key functions
    key_functions = {
        'trainNetwork', 'Deep Learning Toolbox';
        'imread', 'Image Processing Toolbox';
        'randn', 'Core MATLAB'
    };
    
    for i = 1:size(key_functions, 1)
        check_results.total_checks = check_results.total_checks + 1;
        try
            if exist(key_functions{i,1}, 'builtin') || exist(key_functions{i,1}, 'file')
                fprintf('   ✅ %s (%s)\n', key_functions{i,1}, key_functions{i,2});
                check_results.passed_checks = check_results.passed_checks + 1;
            else
                fprintf('   ❌ %s (%s) - not found\n', key_functions{i,1}, key_functions{i,2});
                check_results.failed_checks = check_results.failed_checks + 1;
            end
        catch
            fprintf('   ❌ %s (%s) - error checking\n', key_functions{i,1}, key_functions{i,2});
            check_results.failed_checks = check_results.failed_checks + 1;
        end
    end
end

function [check_results] = check_ai_integration_layer(check_results)
    check_results.total_checks = check_results.total_checks + 1;
    
    try
        % Add backend to path
        addpath('backend');
        
        % Test integration layer creation
        ai = ai_integration_layer();
        
        % Check required functions
        required_functions = {
            'generate_hyperspectral_data',
            'prepare_sensor_history', 
            'call_analyze_image',
            'call_predict_stress',
            'call_generate_alert',
            'convert_health_map_to_legacy',
            'create_current_stats'
        };
        
        functions_found = 0;
        for i = 1:length(required_functions)
            if isfield(ai, required_functions{i}) && isa(ai.(required_functions{i}), 'function_handle')
                functions_found = functions_found + 1;
            end
        end
        
        if functions_found == length(required_functions)
            fprintf('   ✅ AI Integration Layer created successfully\n');
            fprintf('   ✅ All %d functions available\n', functions_found);
            check_results.passed_checks = check_results.passed_checks + 1;
        else
            fprintf('   ❌ AI Integration Layer missing functions (%d/%d)\n', functions_found, length(required_functions));
            check_results.failed_checks = check_results.failed_checks + 1;
        end
        
    catch ME
        fprintf('   ❌ AI Integration Layer failed: %s\n', ME.message);
        check_results.failed_checks = check_results.failed_checks + 1;
    end
end

function [check_results] = check_ai_functions(check_results)
    % Add AI directory to path
    addpath('ai');
    
    % Test each AI function
    ai_functions = {
        'analyze_image',
        'predict_stress', 
        'generate_alert'
    };
    
    for i = 1:length(ai_functions)
        check_results.total_checks = check_results.total_checks + 1;
        
        func_name = ai_functions{i};
        fprintf('   Testing %s...\n', func_name);
        
        try
            switch func_name
                case 'analyze_image'
                    % Test with small synthetic data
                    test_data = rand(32, 32, 10); % Small hyperspectral data
                    result = analyze_image(test_data);
                    
                    if ~isempty(result) && isnumeric(result)
                        fprintf('     ✅ %s working (output: %dx%d)\n', func_name, size(result,1), size(result,2));
                        check_results.passed_checks = check_results.passed_checks + 1;
                    else
                        fprintf('     ❌ %s invalid output\n', func_name);
                        check_results.failed_checks = check_results.failed_checks + 1;
                    end
                    
                case 'predict_stress'
                    % Test with small sensor history
                    test_data = [25+randn(10,1), 60+randn(10,1), 50+randn(10,1)]; % 10 timesteps
                    result = predict_stress(test_data);
                    
                    if isstruct(result) && isfield(result, 'confidence')
                        fprintf('     ✅ %s working (confidence: %.2f)\n', func_name, result.confidence);
                        check_results.passed_checks = check_results.passed_checks + 1;
                    else
                        fprintf('     ❌ %s invalid output\n', func_name);
                        check_results.failed_checks = check_results.failed_checks + 1;
                    end
                    
                case 'generate_alert'
                    % Test with mock data
                    health_map = ones(16, 16); health_map(5:8, 5:8) = 2; % Small map with stressed area
                    sensor_pred = struct('soil_moisture', 35, 'confidence', 0.8);
                    current_stats = struct('soil_moisture', 40, 'temperature', 28);
                    result = generate_alert(health_map, sensor_pred, current_stats);
                    
                    if ischar(result) && length(result) > 10
                        fprintf('     ✅ %s working (length: %d chars)\n', func_name, length(result));
                        check_results.passed_checks = check_results.passed_checks + 1;
                    else
                        fprintf('     ❌ %s invalid output\n', func_name);
                        check_results.failed_checks = check_results.failed_checks + 1;
                    end
            end
            
        catch ME
            fprintf('     ❌ %s failed: %s\n', func_name, ME.message);
            check_results.failed_checks = check_results.failed_checks + 1;
        end
    end
end

function [check_results] = check_backend_integration(check_results)
    check_results.total_checks = check_results.total_checks + 1;
    
    try
        % Create mock sensor data
        sensor_data = struct();
        sensor_data.temperature = 27.5;
        sensor_data.humidity = 65.0;
        sensor_data.soil_moisture = 45.0;
        sensor_data.ph = 6.8;
        sensor_data.data_quality = 0.8;
        sensor_data.timestamp = datetime('now');
        
        % Save mock data
        save('latest_sensor_data.mat', 'sensor_data');
        
        % Test main analysis function
        addpath('backend');
        [health_map, alert_message, stats] = run_main_analysis_final();
        
        % Check outputs
        if ~isempty(health_map) && ischar(alert_message) && isstruct(stats)
            fprintf('   ✅ Backend integration working\n');
            fprintf('   ✅ Health map: %dx%d\n', size(health_map,1), size(health_map,2));
            fprintf('   ✅ Alert: %d characters\n', length(alert_message));
            fprintf('   ✅ Stats: %d fields\n', length(fieldnames(stats)));
            check_results.passed_checks = check_results.passed_checks + 1;
        else
            fprintf('   ❌ Backend integration invalid outputs\n');
            check_results.failed_checks = check_results.failed_checks + 1;
        end
        
        % Cleanup
        if exist('latest_sensor_data.mat', 'file')
            delete('latest_sensor_data.mat');
        end
        
    catch ME
        fprintf('   ❌ Backend integration failed: %s\n', ME.message);
        check_results.failed_checks = check_results.failed_checks + 1;
        
        % Cleanup on error
        if exist('latest_sensor_data.mat', 'file')
            delete('latest_sensor_data.mat');
        end
    end
end

function [check_results] = check_data_generation(check_results)
    try
        addpath('backend');
        ai = ai_integration_layer();
        
        % Test hyperspectral data generation
        check_results.total_checks = check_results.total_checks + 1;
        hyperspectral_data = ai.generate_hyperspectral_data([64, 64]);
        
        if size(hyperspectral_data, 1) == 64 && size(hyperspectral_data, 2) == 64 && size(hyperspectral_data, 3) > 10
            fprintf('   ✅ Hyperspectral generation: %dx%dx%d\n', size(hyperspectral_data,1), size(hyperspectral_data,2), size(hyperspectral_data,3));
            check_results.passed_checks = check_results.passed_checks + 1;
        else
            fprintf('   ❌ Hyperspectral generation failed\n');
            check_results.failed_checks = check_results.failed_checks + 1;
        end
        
        % Test sensor history generation
        check_results.total_checks = check_results.total_checks + 1;
        sensor_data = struct('temperature', 26, 'humidity', 65, 'soil_moisture', 45);
        sensor_history = ai.prepare_sensor_history(sensor_data, 24);
        
        if size(sensor_history, 1) == 24 && size(sensor_history, 2) == 3
            fprintf('   ✅ Sensor history generation: %dx%d\n', size(sensor_history,1), size(sensor_history,2));
            check_results.passed_checks = check_results.passed_checks + 1;
        else
            fprintf('   ❌ Sensor history generation failed\n');
            check_results.failed_checks = check_results.failed_checks + 1;
        end
        
    catch ME
        fprintf('   ❌ Data generation check failed: %s\n', ME.message);
        check_results.failed_checks = check_results.failed_checks + 2;
    end
end

function provide_recommendations(check_results)
    success_rate = check_results.passed_checks / max(1, check_results.total_checks) * 100;
    
    if success_rate >= 90
        fprintf('🎉 System is in excellent condition!\n');
        fprintf('• All major components are working\n');
        fprintf('• Ready for production use\n');
        fprintf('• Consider running demo_integrated_system.m\n');
        
    elseif success_rate >= 75
        fprintf('🔧 System is mostly working with minor issues:\n');
        fprintf('• Core functionality is available\n');
        fprintf('• Some advanced features may be limited\n');
        fprintf('• Check missing toolboxes or files\n');
        fprintf('• System can still be used with fallback mechanisms\n');
        
    elseif success_rate >= 50
        fprintf('⚠️ System has significant issues:\n');
        fprintf('• Basic functionality may work\n');
        fprintf('• Check MATLAB toolbox installations\n');
        fprintf('• Verify file paths and permissions\n');
        fprintf('• Consider reinstalling missing components\n');
        
    else
        fprintf('🚨 System needs immediate attention:\n');
        fprintf('• Major components are not working\n');
        fprintf('• Check MATLAB installation and license\n');
        fprintf('• Verify all required files are present\n');
        fprintf('• Check file paths and directory structure\n');
    end
    
    fprintf('\n📋 Next Steps:\n');
    if check_results.failed_checks > 0
        fprintf('1. Address failed checks above\n');
        fprintf('2. Install missing MATLAB toolboxes\n');
        fprintf('3. Verify file permissions and paths\n');
        fprintf('4. Re-run this system check\n');
    else
        fprintf('1. Run: demo_integrated_system\n');
        fprintf('2. Run: test_ai_integration\n');
        fprintf('3. Try production deployment\n');
    end
end
