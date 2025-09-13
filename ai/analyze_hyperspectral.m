function [health_map, vegetation_indices, spectral_stats] = analyze_hyperspectral(data_file)
    %ANALYZE_HYPERSPECTRAL Analyze hyperspectral image data for crop health assessment
    %   This function loads hyperspectral data and computes various vegetation
    %   indices and health metrics for agricultural monitoring.
    %
    %   Inputs:
    %       data_file - Path to the .mat file containing hyperspectral data
    %                   If empty, uses default Indian Pines dataset
    %
    %   Outputs:
    %       health_map - 2D matrix representing overall crop health (0-1 scale)
    %       vegetation_indices - Struct containing NDVI, SAVI, EVI, etc.
    %       spectral_stats - Struct with statistical analysis of spectral bands
    %
    %   Author: Agricultural Monitoring Team
    %   Version: v1.0
    %   Compatible with: Indian Pines hyperspectral dataset
    
    fprintf('=== Hyperspectral Analysis Module ===\n');
    
    % Default to Indian Pines corrected dataset
    if nargin < 1 || isempty(data_file)
        project_root = fileparts(fileparts(mfilename('fullpath')));
        data_file = fullfile(project_root, 'data', 'raw', 'Indian_pines_corrected.mat');
    end
    
    % Check if data file exists
    if ~exist(data_file, 'file')
        error('Hyperspectral data file not found: %s', data_file);
    end
    
    fprintf('Loading hyperspectral data from: %s\n', data_file);
    
    % Load hyperspectral data
    try
        data_struct = load(data_file);
        field_names = fieldnames(data_struct);
        
        % Get the main data array (typically the largest variable)
        hyperspectral_data = [];
        for i = 1:length(field_names)
            var_data = data_struct.(field_names{i});
            if isnumeric(var_data) && ndims(var_data) >= 3
                hyperspectral_data = var_data;
                fprintf('Found hyperspectral data in field: %s\n', field_names{i});
                break;
            end
        end
        
        if isempty(hyperspectral_data)
            error('No suitable hyperspectral data found in file');
        end
        
    catch ME
        fprintf('Error loading data: %s\n', ME.message);
        error('Failed to load hyperspectral data');
    end
    
    % Get dimensions
    [rows, cols, bands] = size(hyperspectral_data);
    fprintf('Data dimensions: %dx%dx%d (rows×cols×bands)\n', rows, cols, bands);
    
    % Convert to double for processing
    hyperspectral_data = double(hyperspectral_data);
    
    % ===== VEGETATION INDICES CALCULATION =====
    fprintf('Computing vegetation indices...\n');
    
    vegetation_indices = struct();
    
    % Define wavelength ranges (typical for hyperspectral data)
    % Note: These are approximations for the Indian Pines dataset
    red_bands = 50:70;        % Approximate red region
    nir_bands = 80:120;       % Near-infrared region
    green_bands = 30:50;      % Green region
    blue_bands = 10:30;       % Blue region
    
    % Ensure band indices are within valid range
    red_bands = red_bands(red_bands <= bands);
    nir_bands = nir_bands(nir_bands <= bands);
    green_bands = green_bands(green_bands <= bands);
    blue_bands = blue_bands(blue_bands <= bands);
    
    % Extract spectral regions
    red_reflectance = mean(hyperspectral_data(:,:,red_bands), 3);
    nir_reflectance = mean(hyperspectral_data(:,:,nir_bands), 3);
    green_reflectance = mean(hyperspectral_data(:,:,green_bands), 3);
    blue_reflectance = mean(hyperspectral_data(:,:,blue_bands), 3);
    
    % 1. Normalized Difference Vegetation Index (NDVI)
    ndvi_denominator = nir_reflectance + red_reflectance;
    ndvi_denominator(ndvi_denominator == 0) = 1e-10; % Avoid division by zero
    vegetation_indices.ndvi = (nir_reflectance - red_reflectance) ./ ndvi_denominator;
    
    % 2. Soil Adjusted Vegetation Index (SAVI)
    L = 0.5; % Soil adjustment factor
    savi_denominator = nir_reflectance + red_reflectance + L;
    savi_denominator(savi_denominator == 0) = 1e-10;
    vegetation_indices.savi = ((nir_reflectance - red_reflectance) ./ savi_denominator) * (1 + L);
    
    % 3. Enhanced Vegetation Index (EVI)
    C1 = 6; C2 = 7.5; L_evi = 1;
    evi_denominator = nir_reflectance + C1 * red_reflectance - C2 * blue_reflectance + L_evi;
    evi_denominator(evi_denominator == 0) = 1e-10;
    vegetation_indices.evi = 2.5 * ((nir_reflectance - red_reflectance) ./ evi_denominator);
    
    % 4. Green NDVI (GNDVI)
    gndvi_denominator = nir_reflectance + green_reflectance;
    gndvi_denominator(gndvi_denominator == 0) = 1e-10;
    vegetation_indices.gndvi = (nir_reflectance - green_reflectance) ./ gndvi_denominator;
    
    % ===== HEALTH MAP GENERATION =====
    fprintf('Generating crop health map...\n');
    
    % Combine multiple vegetation indices for robust health assessment
    % Normalize each index to 0-1 range
    ndvi_norm = mat2gray(vegetation_indices.ndvi);
    savi_norm = mat2gray(vegetation_indices.savi);
    evi_norm = mat2gray(vegetation_indices.evi);
    gndvi_norm = mat2gray(vegetation_indices.gndvi);
    
    % Weighted combination for overall health
    weights = [0.4, 0.25, 0.2, 0.15]; % NDVI has highest weight
    health_map = weights(1) * ndvi_norm + weights(2) * savi_norm + ...
                 weights(3) * evi_norm + weights(4) * gndvi_norm;
    
    % Apply additional processing
    health_map = medfilt2(health_map, [3 3]); % Reduce noise
    health_map = max(0, min(1, health_map));  % Clamp to [0,1]
    
    % ===== SPECTRAL STATISTICS =====
    fprintf('Computing spectral statistics...\n');
    
    spectral_stats = struct();
    
    % Overall statistics
    spectral_stats.mean_spectrum = squeeze(mean(mean(hyperspectral_data, 1), 2));
    spectral_stats.std_spectrum = squeeze(std(reshape(hyperspectral_data, [], bands), 0, 1));
    
    % Band-wise statistics
    spectral_stats.min_values = squeeze(min(min(hyperspectral_data, [], 1), [], 2));
    spectral_stats.max_values = squeeze(max(max(hyperspectral_data, [], 1), [], 2));
    
    % Health map statistics
    spectral_stats.health_mean = mean(health_map(:));
    spectral_stats.health_std = std(health_map(:));
    spectral_stats.healthy_pixels = sum(health_map(:) > 0.7);
    spectral_stats.unhealthy_pixels = sum(health_map(:) < 0.3);
    spectral_stats.total_pixels = numel(health_map);
    spectral_stats.healthy_percentage = 100 * spectral_stats.healthy_pixels / spectral_stats.total_pixels;
    
    % Vegetation index statistics
    spectral_stats.ndvi_mean = mean(vegetation_indices.ndvi(:), 'omitnan');
    spectral_stats.ndvi_std = std(vegetation_indices.ndvi(:), 'omitnan');
    spectral_stats.savi_mean = mean(vegetation_indices.savi(:), 'omitnan');
    spectral_stats.evi_mean = mean(vegetation_indices.evi(:), 'omitnan');
    
    % Data quality metrics
    spectral_stats.bands_count = bands;
    spectral_stats.spatial_resolution = [rows, cols];
    spectral_stats.data_range = [min(hyperspectral_data(:)), max(hyperspectral_data(:))];
    
    fprintf('Analysis complete!\n');
    fprintf('Health Map Stats:\n');
    fprintf('  - Mean health: %.3f\n', spectral_stats.health_mean);
    fprintf('  - Healthy areas: %.1f%%\n', spectral_stats.healthy_percentage);
    fprintf('  - NDVI mean: %.3f ± %.3f\n', spectral_stats.ndvi_mean, spectral_stats.ndvi_std);
    fprintf('=====================================\n');
    
end