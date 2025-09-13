# Data Directory - Data Management & Processing Pipeline

## 👥 **Team Member: Neha**
**Role:** Data Engineer - Data Processing, Quality Assurance, and Pipeline Management

---

## 🎯 **Your Mission & Responsibility**

You are the **data backbone** of the agricultural monitoring system. Your expertise in data processing, cleaning, and management ensures that all teams work with high-quality, reliable datasets. You transform raw, messy data into clean, structured formats that power AI models, backend analysis, and frontend visualizations.

### **Key Responsibilities:**
- **Data Ingestion**: Collect and integrate data from multiple sources (IoT, hyperspectral, weather)
- **Data Cleaning**: Remove noise, handle missing values, and ensure data quality
- **Data Preprocessing**: Standardize formats, normalize values, and create features
- **Quality Assurance**: Implement validation rules and monitoring systems
- **Data Pipeline Management**: Build automated ETL workflows
- **Documentation**: Maintain comprehensive data documentation and lineage

---

## 🏗️ **Directory Structure**

```
data/
├── README.md                          # This comprehensive documentation
├── simulated_sensors.csv              # Generated IoT sensor data
├── raw/                               # Original, unprocessed datasets
│   ├── README.md                      # Raw data documentation
│   ├── Indian_pines.mat               # Hyperspectral dataset
│   ├── Indian_pines_corrected.mat     # Corrected hyperspectral data
│   ├── Indian_pines_gt.mat            # Ground truth labels
│   ├── SalinasA.mat                   # Additional hyperspectral dataset
│   └── weather_data/                  # Weather station data
│       ├── 2024_01_weather.csv
│       ├── 2024_02_weather.csv
│       └── historical_weather.csv
├── processed/                         # Cleaned and processed datasets
│   ├── clean_hyperspectral.mat        # Processed hyperspectral data
│   ├── sensor_timeseries_clean.csv    # Cleaned sensor time series
│   ├── weather_features.mat           # Engineered weather features
│   ├── fused_dataset.csv              # Combined multi-source data
│   └── validation_splits/             # Train/validation/test splits
│       ├── train_set.csv
│       ├── validation_set.csv
│       └── test_set.csv
├── interim/                           # Intermediate processing results
│   ├── partially_cleaned/             # Intermediate cleaning steps
│   ├── feature_engineering/           # Feature creation workspace
│   └── quality_reports/               # Data quality assessments
├── external/                          # External reference datasets
│   ├── soil_type_maps/               # Soil classification data
│   ├── crop_calendars/               # Agricultural calendar data
│   └── reference_standards/           # Calibration and validation data
├── scripts/                           # Data processing scripts
│   ├── data_ingestion.py             # Raw data collection
│   ├── data_cleaning.py              # Cleaning and validation
│   ├── feature_engineering.py        # Feature creation
│   ├── data_fusion.py                # Multi-source integration
│   ├── quality_monitoring.py         # Data quality checks
│   └── pipeline_orchestrator.py      # Main pipeline controller
├── configs/                           # Configuration files
│   ├── data_schema.json              # Data format specifications
│   ├── quality_rules.json            # Data validation rules
│   ├── pipeline_config.yaml          # Processing pipeline settings
│   └── source_mappings.json          # Data source configurations
├── notebooks/                         # Analysis and exploration
│   ├── data_exploration.ipynb        # Initial data analysis
│   ├── quality_assessment.ipynb      # Data quality evaluation
│   ├── feature_analysis.ipynb        # Feature engineering analysis
│   └── data_profiling.ipynb          # Comprehensive data profiling
└── documentation/                     # Data documentation
    ├── data_dictionary.md             # Field definitions and descriptions
    ├── processing_guide.md            # Step-by-step processing guide
    ├── quality_standards.md           # Data quality requirements
    └── integration_specs.md           # Team integration specifications
```

---

## 🚀 **Technology Stack**

### **Core Technologies:**

#### **1. Python Data Ecosystem**
```python
# Core libraries for data processing
import pandas as pd           # Data manipulation and analysis
import numpy as np            # Numerical computing
import scipy as sp            # Scientific computing
import matplotlib.pyplot as plt  # Data visualization
import seaborn as sns         # Statistical visualization

# Data quality and validation
import great_expectations as gx  # Data quality framework
import pandera as pa             # Data validation
import pydantic as pd           # Data modeling

# Machine learning preprocessing  
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.model_selection import train_test_split

# File format handling
import h5py                   # HDF5 files (hyperspectral data)
from scipy.io import loadmat, savemat  # MATLAB files
import json                   # JSON configuration files
import yaml                   # YAML configuration files
```

#### **2. Database Technologies**
```python
# Database connectivity
import sqlite3               # Lightweight database
import sqlalchemy            # ORM and database abstraction
import pymongo              # MongoDB (for document storage)

# Data warehousing
import duckdb               # In-process analytical database
import polars               # Fast DataFrame library
```

#### **3. Data Pipeline Tools**
```python
# Pipeline orchestration
import apache_airflow        # Workflow orchestration
import prefect              # Modern data workflows
import dagster             # Data orchestration platform

# Data validation and monitoring
import evidently           # ML model and data monitoring
import deepchecks          # Testing for ML & data validation
```

---

## 📊 **Data Processing Architecture**

### **Data Flow Pipeline:**

```
┌─────────────┐    ┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│ Raw Data    │───▶│ Data Ingestion  │───▶│ Data Cleaning│───▶│ Processed   │
│ Sources     │    │ & Validation    │    │ & Transform  │    │ Data        │
└─────────────┘    └─────────────────┘    └──────────────┘    └─────────────┘
       │                     │                     │                   │
   ┌────▼────┐           ┌────▼────┐           ┌────▼────┐         ┌────▼────┐
   │ IoT     │           │Quality  │           │Feature  │         │ML-Ready │
   │Sensors  │           │Checks   │           │Engineer │         │Datasets │
   │         │           │         │           │         │         │         │
   └─────────┘           └─────────┘           └─────────┘         └─────────┘
   ┌─────────┐           ┌─────────┐           ┌─────────┐         ┌─────────┐
   │Hyperspec│           │Data     │           │Data     │         │Dashboard│
   │Images   │           │Profiling│           │Fusion   │         │Data     │
   └─────────┘           └─────────┘           └─────────┘         └─────────┘
   ┌─────────┐                                 ┌─────────┐         ┌─────────┐
   │Weather  │                                 │Normalize│         │Analysis │
   │Data     │                                 │& Scale  │         │Reports  │
   └─────────┘                                 └─────────┘         └─────────┘
```

---

## 🔧 **Core Data Processing Functions**

### **1. Data Ingestion Pipeline**

```python
import pandas as pd
import numpy as np
from pathlib import Path
import json
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Union, Optional

class DataIngestionPipeline:
    """
    Comprehensive data ingestion system for agricultural monitoring data
    """
    
    def __init__(self, config_path: str = "configs/pipeline_config.yaml"):
        self.config = self._load_config(config_path)
        self.logger = self._setup_logging()
        self.data_sources = {}
        
    def _setup_logging(self) -> logging.Logger:
        """Setup logging for data pipeline"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('data/logs/ingestion.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    def ingest_iot_sensor_data(self, source_path: str) -> pd.DataFrame:
        """
        Ingest IoT sensor data from CSV files or MQTT streams
        
        Args:
            source_path: Path to sensor data file or MQTT topic
            
        Returns:
            DataFrame with validated sensor data
        """
        self.logger.info(f"Ingesting IoT sensor data from {source_path}")
        
        try:
            # Read CSV data
            if source_path.endswith('.csv'):
                raw_data = pd.read_csv(source_path)
            else:
                # Handle MQTT stream data
                raw_data = self._ingest_mqtt_data(source_path)
            
            # Basic validation
            required_columns = ['timestamp', 'device_id', 'temperature', 
                              'humidity', 'soil_moisture', 'ph_level']
            
            missing_columns = set(required_columns) - set(raw_data.columns)
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Convert timestamp to datetime
            raw_data['timestamp'] = pd.to_datetime(raw_data['timestamp'])
            
            # Sort by timestamp and device
            processed_data = raw_data.sort_values(['device_id', 'timestamp'])
            
            self.logger.info(f"Successfully ingested {len(processed_data)} sensor records")
            
            return processed_data
            
        except Exception as e:
            self.logger.error(f"Error ingesting IoT data: {str(e)}")
            raise
    
    def ingest_hyperspectral_data(self, data_path: str) -> Dict[str, np.ndarray]:
        """
        Ingest hyperspectral imaging data from MATLAB files
        
        Args:
            data_path: Path to hyperspectral .mat file
            
        Returns:
            Dictionary containing image data and metadata
        """
        from scipy.io import loadmat
        
        self.logger.info(f"Ingesting hyperspectral data from {data_path}")
        
        try:
            # Load MATLAB file
            mat_data = loadmat(data_path)
            
            # Extract relevant data (adjust keys based on your specific dataset)
            if 'indian_pines' in mat_data:
                image_data = mat_data['indian_pines']
            elif 'salinas' in mat_data:
                image_data = mat_data['salinas']
            else:
                # Find the largest array (likely the image data)
                arrays = {k: v for k, v in mat_data.items() 
                         if isinstance(v, np.ndarray) and v.ndim >= 3}
                if not arrays:
                    raise ValueError("No suitable image data found in file")
                image_data = max(arrays.values(), key=lambda x: x.size)
            
            # Validate dimensions
            if image_data.ndim != 3:
                raise ValueError(f"Expected 3D image data, got {image_data.ndim}D")
            
            height, width, bands = image_data.shape
            
            processed_data = {
                'image_data': image_data,
                'dimensions': {'height': height, 'width': width, 'bands': bands},
                'metadata': {
                    'source_file': data_path,
                    'ingestion_time': datetime.now().isoformat(),
                    'data_type': str(image_data.dtype),
                    'size_mb': image_data.nbytes / (1024 * 1024)
                }
            }
            
            self.logger.info(f"Successfully ingested hyperspectral data: "
                           f"{height}x{width}x{bands}, {processed_data['metadata']['size_mb']:.2f} MB")
            
            return processed_data
            
        except Exception as e:
            self.logger.error(f"Error ingesting hyperspectral data: {str(e)}")
            raise
    
    def ingest_weather_data(self, source_path: str) -> pd.DataFrame:
        """
        Ingest weather station data
        
        Args:
            source_path: Path to weather data file or API endpoint
            
        Returns:
            DataFrame with weather observations
        """
        self.logger.info(f"Ingesting weather data from {source_path}")
        
        try:
            if source_path.startswith('http'):
                # Handle API data source
                weather_data = self._fetch_weather_api(source_path)
            else:
                # Handle file data source
                weather_data = pd.read_csv(source_path)
            
            # Standardize column names
            column_mapping = {
                'datetime': 'timestamp',
                'temp': 'temperature',
                'humidity': 'relative_humidity',
                'pressure': 'atmospheric_pressure',
                'wind_speed': 'wind_speed_ms',
                'wind_dir': 'wind_direction_deg'
            }
            
            weather_data = weather_data.rename(columns=column_mapping)
            
            # Convert timestamp
            if 'timestamp' in weather_data.columns:
                weather_data['timestamp'] = pd.to_datetime(weather_data['timestamp'])
            
            # Sort by timestamp
            weather_data = weather_data.sort_values('timestamp')
            
            self.logger.info(f"Successfully ingested {len(weather_data)} weather records")
            
            return weather_data
            
        except Exception as e:
            self.logger.error(f"Error ingesting weather data: {str(e)}")
            raise
    
    def _fetch_weather_api(self, api_url: str) -> pd.DataFrame:
        """Fetch weather data from API"""
        import requests
        
        response = requests.get(api_url)
        if response.status_code == 200:
            return pd.DataFrame(response.json())
        else:
            raise Exception(f"API request failed with status {response.status_code}")
    
    def _ingest_mqtt_data(self, topic: str) -> pd.DataFrame:
        """Ingest real-time MQTT sensor data"""
        # Implementation for MQTT data ingestion
        # This would connect to MQTT broker and collect recent messages
        pass
```

### **2. Data Cleaning and Validation**

```python
class DataCleaningPipeline:
    """
    Comprehensive data cleaning and validation system
    """
    
    def __init__(self, quality_rules_path: str = "configs/quality_rules.json"):
        self.quality_rules = self._load_quality_rules(quality_rules_path)
        self.logger = logging.getLogger(__name__)
        self.cleaning_stats = {}
    
    def clean_sensor_data(self, raw_data: pd.DataFrame) -> pd.DataFrame:
        """
        Clean IoT sensor data with comprehensive validation and correction
        
        Args:
            raw_data: Raw sensor DataFrame
            
        Returns:
            Cleaned and validated DataFrame
        """
        self.logger.info(f"Starting sensor data cleaning for {len(raw_data)} records")
        
        cleaned_data = raw_data.copy()
        
        # Step 1: Remove duplicate records
        initial_count = len(cleaned_data)
        cleaned_data = cleaned_data.drop_duplicates(
            subset=['device_id', 'timestamp'], keep='first'
        )
        duplicates_removed = initial_count - len(cleaned_data)
        
        # Step 2: Handle missing values
        cleaned_data = self._handle_missing_values(cleaned_data)
        
        # Step 3: Remove outliers
        cleaned_data = self._remove_outliers(cleaned_data)
        
        # Step 4: Validate sensor readings
        cleaned_data = self._validate_sensor_readings(cleaned_data)
        
        # Step 5: Temporal validation
        cleaned_data = self._validate_temporal_consistency(cleaned_data)
        
        # Store cleaning statistics
        self.cleaning_stats = {
            'initial_records': initial_count,
            'final_records': len(cleaned_data),
            'duplicates_removed': duplicates_removed,
            'records_removed': initial_count - len(cleaned_data),
            'cleaning_timestamp': datetime.now().isoformat()
        }
        
        self.logger.info(f"Cleaning complete. {len(cleaned_data)} records retained "
                        f"({duplicates_removed} duplicates removed)")
        
        return cleaned_data
    
    def _handle_missing_values(self, data: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values using various strategies"""
        
        # Strategy 1: Forward fill for short gaps (< 1 hour)
        numeric_columns = ['temperature', 'humidity', 'soil_moisture', 'ph_level']
        
        for column in numeric_columns:
            if column in data.columns:
                # Group by device for forward fill
                data[column] = data.groupby('device_id')[column].fillna(method='ffill', limit=4)
        
        # Strategy 2: Interpolation for longer gaps
        for column in numeric_columns:
            if column in data.columns:
                data[column] = data.groupby('device_id')[column].interpolate(method='linear')
        
        # Strategy 3: Remove records with too many missing values
        missing_threshold = 0.5  # Remove records with >50% missing values
        missing_counts = data[numeric_columns].isnull().sum(axis=1)
        valid_records = missing_counts <= (len(numeric_columns) * missing_threshold)
        data = data[valid_records]
        
        return data
    
    def _remove_outliers(self, data: pd.DataFrame) -> pd.DataFrame:
        """Remove statistical outliers using IQR method"""
        
        numeric_columns = ['temperature', 'humidity', 'soil_moisture', 'ph_level']
        
        for column in numeric_columns:
            if column in data.columns:
                Q1 = data[column].quantile(0.25)
                Q3 = data[column].quantile(0.75)
                IQR = Q3 - Q1
                
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                # Mark outliers but don't remove yet - we'll validate against physical limits
                outliers = (data[column] < lower_bound) | (data[column] > upper_bound)
                self.logger.info(f"Detected {outliers.sum()} statistical outliers in {column}")
        
        return data
    
    def _validate_sensor_readings(self, data: pd.DataFrame) -> pd.DataFrame:
        """Validate sensor readings against physical limits"""
        
        # Define physical limits for each sensor type
        limits = {
            'temperature': {'min': -50, 'max': 80},      # Celsius
            'humidity': {'min': 0, 'max': 100},          # Percentage
            'soil_moisture': {'min': 0, 'max': 100},     # Percentage
            'ph_level': {'min': 0, 'max': 14},           # pH units
            'light_intensity': {'min': 0, 'max': 100000} # Lux
        }
        
        for column, limit in limits.items():
            if column in data.columns:
                invalid_readings = (data[column] < limit['min']) | (data[column] > limit['max'])
                
                if invalid_readings.any():
                    self.logger.warning(f"Found {invalid_readings.sum()} invalid readings in {column}")
                    # Remove invalid readings
                    data = data[~invalid_readings]
        
        return data
    
    def _validate_temporal_consistency(self, data: pd.DataFrame) -> pd.DataFrame:
        """Validate temporal consistency of sensor readings"""
        
        # Check for reasonable time gaps
        data = data.sort_values(['device_id', 'timestamp'])
        
        # Calculate time differences between consecutive readings per device
        data['time_diff'] = data.groupby('device_id')['timestamp'].diff()
        
        # Flag readings with unusual time gaps (> 4 hours)
        max_gap = timedelta(hours=4)
        unusual_gaps = data['time_diff'] > max_gap
        
        if unusual_gaps.any():
            self.logger.info(f"Found {unusual_gaps.sum()} readings with unusual time gaps")
        
        # Remove the temporary column
        data = data.drop('time_diff', axis=1)
        
        return data
    
    def clean_hyperspectral_data(self, image_data: np.ndarray) -> np.ndarray:
        """
        Clean hyperspectral image data
        
        Args:
            image_data: 3D numpy array (height, width, bands)
            
        Returns:
            Cleaned image data
        """
        self.logger.info("Cleaning hyperspectral image data")
        
        cleaned_data = image_data.copy()
        
        # Step 1: Remove noise using median filter
        from scipy.ndimage import median_filter
        for band in range(cleaned_data.shape[2]):
            cleaned_data[:, :, band] = median_filter(cleaned_data[:, :, band], size=3)
        
        # Step 2: Handle invalid pixels (NaN, infinity, negative values)
        # Replace invalid values with band mean
        for band in range(cleaned_data.shape[2]):
            band_data = cleaned_data[:, :, band]
            invalid_mask = ~np.isfinite(band_data) | (band_data < 0)
            
            if invalid_mask.any():
                band_mean = np.nanmean(band_data[~invalid_mask])
                cleaned_data[:, :, band][invalid_mask] = band_mean
                self.logger.info(f"Replaced {invalid_mask.sum()} invalid pixels in band {band}")
        
        # Step 3: Normalize spectral values
        cleaned_data = self._normalize_spectral_data(cleaned_data)
        
        self.logger.info("Hyperspectral data cleaning complete")
        
        return cleaned_data
    
    def _normalize_spectral_data(self, image_data: np.ndarray) -> np.ndarray:
        """Normalize spectral data to 0-1 range"""
        
        # Calculate min and max across all bands
        global_min = np.min(image_data)
        global_max = np.max(image_data)
        
        # Normalize to 0-1 range
        normalized_data = (image_data - global_min) / (global_max - global_min)
        
        return normalized_data
```

### **3. Feature Engineering Pipeline**

```python
class FeatureEngineeringPipeline:
    """
    Advanced feature engineering for agricultural data
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.feature_stats = {}
    
    def engineer_sensor_features(self, sensor_data: pd.DataFrame) -> pd.DataFrame:
        """
        Create engineered features from sensor data
        
        Args:
            sensor_data: Clean sensor DataFrame
            
        Returns:
            DataFrame with additional engineered features
        """
        self.logger.info("Engineering sensor features")
        
        enriched_data = sensor_data.copy()
        
        # Sort by device and timestamp for time-based features
        enriched_data = enriched_data.sort_values(['device_id', 'timestamp'])
        
        # Temporal features
        enriched_data = self._add_temporal_features(enriched_data)
        
        # Rolling statistics features
        enriched_data = self._add_rolling_statistics(enriched_data)
        
        # Environmental indices
        enriched_data = self._add_environmental_indices(enriched_data)
        
        # Anomaly indicators
        enriched_data = self._add_anomaly_indicators(enriched_data)
        
        # Growth stage indicators
        enriched_data = self._add_growth_stage_features(enriched_data)
        
        self.logger.info(f"Feature engineering complete. Added {len(enriched_data.columns) - len(sensor_data.columns)} new features")
        
        return enriched_data
    
    def _add_temporal_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """Add time-based features"""
        
        # Extract time components
        data['hour'] = data['timestamp'].dt.hour
        data['day_of_week'] = data['timestamp'].dt.dayofweek
        data['day_of_year'] = data['timestamp'].dt.dayofyear
        data['month'] = data['timestamp'].dt.month
        data['season'] = data['month'].map(self._get_season)
        
        # Cyclic encoding for temporal features
        data['hour_sin'] = np.sin(2 * np.pi * data['hour'] / 24)
        data['hour_cos'] = np.cos(2 * np.pi * data['hour'] / 24)
        data['day_sin'] = np.sin(2 * np.pi * data['day_of_year'] / 365.25)
        data['day_cos'] = np.cos(2 * np.pi * data['day_of_year'] / 365.25)
        
        return data
    
    def _add_rolling_statistics(self, data: pd.DataFrame) -> pd.DataFrame:
        """Add rolling window statistics"""
        
        numeric_columns = ['temperature', 'humidity', 'soil_moisture', 'ph_level']
        windows = [6, 24, 168]  # 6h, 24h, 1 week (assuming hourly data)
        
        for column in numeric_columns:
            if column in data.columns:
                for window in windows:
                    # Rolling mean
                    data[f'{column}_rolling_mean_{window}h'] = (
                        data.groupby('device_id')[column]
                        .rolling(window=window, min_periods=1)
                        .mean()
                        .reset_index(level=0, drop=True)
                    )
                    
                    # Rolling standard deviation
                    data[f'{column}_rolling_std_{window}h'] = (
                        data.groupby('device_id')[column]
                        .rolling(window=window, min_periods=1)
                        .std()
                        .reset_index(level=0, drop=True)
                    )
                    
                    # Rolling min/max
                    data[f'{column}_rolling_min_{window}h'] = (
                        data.groupby('device_id')[column]
                        .rolling(window=window, min_periods=1)
                        .min()
                        .reset_index(level=0, drop=True)
                    )
                    
                    data[f'{column}_rolling_max_{window}h'] = (
                        data.groupby('device_id')[column]
                        .rolling(window=window, min_periods=1)
                        .max()
                        .reset_index(level=0, drop=True)
                    )
        
        return data
    
    def _add_environmental_indices(self, data: pd.DataFrame) -> pd.DataFrame:
        """Add derived environmental indices"""
        
        # Vapor Pressure Deficit (VPD)
        if 'temperature' in data.columns and 'humidity' in data.columns:
            # Calculate saturation vapor pressure (kPa)
            svp = 0.6108 * np.exp(17.27 * data['temperature'] / (data['temperature'] + 237.3))
            
            # Calculate actual vapor pressure (kPa)
            avp = svp * data['humidity'] / 100
            
            # Calculate VPD
            data['vapor_pressure_deficit'] = svp - avp
        
        # Heat Index (feels-like temperature)
        if 'temperature' in data.columns and 'humidity' in data.columns:
            data['heat_index'] = self._calculate_heat_index(data['temperature'], data['humidity'])
        
        # Soil moisture stress index
        if 'soil_moisture' in data.columns:
            data['soil_stress_index'] = np.where(
                data['soil_moisture'] < 30, 'high_stress',
                np.where(data['soil_moisture'] < 60, 'moderate_stress', 'low_stress')
            )
        
        # Growing Degree Days (GDD) - using base temperature of 10°C
        if 'temperature' in data.columns:
            data['gdd_daily'] = np.maximum(0, data['temperature'] - 10)
            
            # Cumulative GDD
            data['gdd_cumulative'] = (
                data.groupby('device_id')['gdd_daily']
                .cumsum()
            )
        
        return data
    
    def _add_anomaly_indicators(self, data: pd.DataFrame) -> pd.DataFrame:
        """Add anomaly detection features"""
        
        numeric_columns = ['temperature', 'humidity', 'soil_moisture', 'ph_level']
        
        for column in numeric_columns:
            if column in data.columns:
                # Z-score based anomaly detection
                mean_val = data.groupby('device_id')[column].transform('mean')
                std_val = data.groupby('device_id')[column].transform('std')
                data[f'{column}_zscore'] = (data[column] - mean_val) / std_val
                data[f'{column}_is_anomaly'] = np.abs(data[f'{column}_zscore']) > 2
        
        return data
    
    def _add_growth_stage_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """Add crop growth stage indicators based on GDD and calendar"""
        
        if 'gdd_cumulative' in data.columns:
            # Simple growth stage classification (adjust thresholds for specific crops)
            data['growth_stage'] = pd.cut(
                data['gdd_cumulative'],
                bins=[0, 200, 600, 1200, 1800, float('inf')],
                labels=['germination', 'vegetative', 'flowering', 'grain_fill', 'maturity']
            )
        
        return data
    
    def _calculate_heat_index(self, temperature: pd.Series, humidity: pd.Series) -> pd.Series:
        """Calculate heat index (feels-like temperature)"""
        
        # Convert Celsius to Fahrenheit for heat index calculation
        temp_f = temperature * 9/5 + 32
        
        # Heat index formula (valid for temp > 80°F and humidity > 40%)
        heat_index_f = (
            -42.379 + 2.04901523 * temp_f + 10.14333127 * humidity
            - 0.22475541 * temp_f * humidity - 6.83783e-3 * temp_f**2
            - 5.481717e-2 * humidity**2 + 1.22874e-3 * temp_f**2 * humidity
            + 8.5282e-4 * temp_f * humidity**2 - 1.99e-6 * temp_f**2 * humidity**2
        )
        
        # Convert back to Celsius
        heat_index_c = (heat_index_f - 32) * 5/9
        
        # Use original temperature for conditions where heat index isn't applicable
        return np.where((temp_f > 80) & (humidity > 40), heat_index_c, temperature)
    
    def _get_season(self, month: int) -> str:
        """Map month to season (Northern Hemisphere)"""
        if month in [12, 1, 2]:
            return 'winter'
        elif month in [3, 4, 5]:
            return 'spring'
        elif month in [6, 7, 8]:
            return 'summer'
        else:
            return 'autumn'
    
    def engineer_hyperspectral_features(self, image_data: np.ndarray) -> Dict[str, np.ndarray]:
        """
        Engineer features from hyperspectral imagery
        
        Args:
            image_data: 3D hyperspectral image (height, width, bands)
            
        Returns:
            Dictionary of engineered features
        """
        self.logger.info("Engineering hyperspectral features")
        
        features = {}
        
        # Vegetation indices
        features['vegetation_indices'] = self._calculate_vegetation_indices(image_data)
        
        # Statistical features per pixel
        features['statistical_features'] = self._calculate_spectral_statistics(image_data)
        
        # Texture features
        features['texture_features'] = self._calculate_texture_features(image_data)
        
        # Principal components
        features['pca_features'] = self._calculate_pca_features(image_data)
        
        self.logger.info(f"Generated {len(features)} feature sets from hyperspectral data")
        
        return features
    
    def _calculate_vegetation_indices(self, image_data: np.ndarray) -> Dict[str, np.ndarray]:
        """Calculate common vegetation indices"""
        
        height, width, bands = image_data.shape
        indices = {}
        
        # Assume standard band positions (adjust for your specific sensor)
        # These are typical for hyperspectral sensors
        if bands >= 100:  # Typical hyperspectral has 100+ bands
            red_band = image_data[:, :, 29]      # ~670nm
            nir_band = image_data[:, :, 51]      # ~800nm
            green_band = image_data[:, :, 19]    # ~550nm
            blue_band = image_data[:, :, 12]     # ~450nm
            
            # NDVI (Normalized Difference Vegetation Index)
            indices['ndvi'] = (nir_band - red_band) / (nir_band + red_band + 1e-8)
            
            # GNDVI (Green NDVI)
            indices['gndvi'] = (nir_band - green_band) / (nir_band + green_band + 1e-8)
            
            # Simple Ratio
            indices['simple_ratio'] = nir_band / (red_band + 1e-8)
            
            # Enhanced Vegetation Index (EVI)
            indices['evi'] = 2.5 * (nir_band - red_band) / (
                nir_band + 6 * red_band - 7.5 * blue_band + 1
            )
            
            # Soil Adjusted Vegetation Index (SAVI)
            L = 0.5  # Soil brightness correction factor
            indices['savi'] = (1 + L) * (nir_band - red_band) / (nir_band + red_band + L)
        
        return indices
    
    def _calculate_spectral_statistics(self, image_data: np.ndarray) -> Dict[str, np.ndarray]:
        """Calculate statistical features across spectral bands"""
        
        stats = {}
        
        # Mean across all bands
        stats['spectral_mean'] = np.mean(image_data, axis=2)
        
        # Standard deviation across bands
        stats['spectral_std'] = np.std(image_data, axis=2)
        
        # Min and max values
        stats['spectral_min'] = np.min(image_data, axis=2)
        stats['spectral_max'] = np.max(image_data, axis=2)
        
        # Spectral range
        stats['spectral_range'] = stats['spectral_max'] - stats['spectral_min']
        
        return stats
    
    def _calculate_texture_features(self, image_data: np.ndarray) -> Dict[str, np.ndarray]:
        """Calculate texture features using first principal component"""
        
        from sklearn.decomposition import PCA
        from skimage.feature import greycomatrix, greycoprops
        
        # Get first principal component for texture analysis
        height, width, bands = image_data.shape
        reshaped = image_data.reshape(-1, bands)
        
        pca = PCA(n_components=1)
        pc1 = pca.fit_transform(reshaped).reshape(height, width)
        
        # Normalize to 0-255 range for texture analysis
        pc1_normalized = ((pc1 - pc1.min()) / (pc1.max() - pc1.min()) * 255).astype(np.uint8)
        
        # Calculate GLCM (Gray Level Co-occurrence Matrix)
        distances = [1, 2, 3]
        angles = [0, 45, 90, 135]
        
        texture_features = {}
        
        try:
            # Calculate GLCM
            glcm = greycomatrix(
                pc1_normalized, 
                distances=distances, 
                angles=np.radians(angles),
                levels=256,
                symmetric=True, 
                normed=True
            )
            
            # Extract texture properties
            texture_features['contrast'] = greycoprops(glcm, 'contrast').mean()
            texture_features['dissimilarity'] = greycoprops(glcm, 'dissimilarity').mean()
            texture_features['homogeneity'] = greycoprops(glcm, 'homogeneity').mean()
            texture_features['energy'] = greycoprops(glcm, 'energy').mean()
            
        except Exception as e:
            self.logger.warning(f"Texture feature calculation failed: {e}")
            # Provide default values
            for prop in ['contrast', 'dissimilarity', 'homogeneity', 'energy']:
                texture_features[prop] = np.zeros_like(pc1)
        
        return texture_features
    
    def _calculate_pca_features(self, image_data: np.ndarray, n_components: int = 10) -> np.ndarray:
        """Calculate principal components of hyperspectral data"""
        
        from sklearn.decomposition import PCA
        
        height, width, bands = image_data.shape
        reshaped = image_data.reshape(-1, bands)
        
        # Fit PCA
        pca = PCA(n_components=n_components)
        pc_data = pca.fit_transform(reshaped)
        
        # Reshape back to image format
        pc_images = pc_data.reshape(height, width, n_components)
        
        return pc_images
```

---

## 🔗 **Integration with Other Teams**

### **Backend Integration (Suryansh):**

#### **Data Output Specifications**
```python
class BackendDataInterface:
    """
    Interface for providing processed data to backend team
    """
    
    def export_for_matlab_analysis(self, processed_data: pd.DataFrame, 
                                 output_path: str = "data/processed/matlab_ready.mat"):
        """
        Export processed data in MATLAB-compatible format
        
        Args:
            processed_data: Cleaned and processed sensor data
            output_path: Path for output .mat file
        """
        from scipy.io import savemat
        
        # Prepare data structure for MATLAB
        matlab_data = {
            'sensor_data': processed_data.select_dtypes(include=[np.number]).values,
            'column_names': processed_data.select_dtypes(include=[np.number]).columns.tolist(),
            'timestamps': processed_data['timestamp'].astype(str).tolist(),
            'device_ids': processed_data['device_id'].tolist(),
            'metadata': {
                'processing_date': datetime.now().isoformat(),
                'record_count': len(processed_data),
                'feature_count': len(processed_data.columns)
            }
        }
        
        savemat(output_path, matlab_data)
        self.logger.info(f"Exported {len(processed_data)} records to {output_path}")
    
    def generate_analysis_summary(self, processed_data: pd.DataFrame) -> Dict:
        """
        Generate summary statistics for backend analysis
        
        Returns:
            Dictionary with summary statistics
        """
        numeric_columns = processed_data.select_dtypes(include=[np.number]).columns
        
        summary = {
            'data_overview': {
                'total_records': len(processed_data),
                'unique_devices': processed_data['device_id'].nunique(),
                'date_range': {
                    'start': processed_data['timestamp'].min().isoformat(),
                    'end': processed_data['timestamp'].max().isoformat()
                },
                'missing_data_percentage': processed_data.isnull().sum().sum() / processed_data.size * 100
            },
            'feature_statistics': {}
        }
        
        for column in numeric_columns:
            summary['feature_statistics'][column] = {
                'mean': float(processed_data[column].mean()),
                'median': float(processed_data[column].median()),
                'std': float(processed_data[column].std()),
                'min': float(processed_data[column].min()),
                'max': float(processed_data[column].max()),
                'quartiles': processed_data[column].quantile([0.25, 0.5, 0.75]).tolist()
            }
        
        return summary
```

### **AI Team Integration (Aryan):**

#### **ML-Ready Dataset Preparation**
```python
class AIDataInterface:
    """
    Interface for providing ML-ready datasets to AI team
    """
    
    def prepare_training_datasets(self, processed_data: pd.DataFrame, 
                                test_size: float = 0.2, 
                                validation_size: float = 0.1) -> Dict[str, pd.DataFrame]:
        """
        Prepare train/validation/test splits for ML training
        
        Args:
            processed_data: Cleaned and processed data
            test_size: Proportion for test set
            validation_size: Proportion for validation set
            
        Returns:
            Dictionary with train/val/test datasets
        """
        from sklearn.model_selection import train_test_split
        
        # First split: separate test set
        train_val_data, test_data = train_test_split(
            processed_data, 
            test_size=test_size, 
            stratify=processed_data.get('device_id'),  # Stratify by device if available
            random_state=42
        )
        
        # Second split: separate validation from training
        val_size_adjusted = validation_size / (1 - test_size)
        train_data, val_data = train_test_split(
            train_val_data,
            test_size=val_size_adjusted,
            stratify=train_val_data.get('device_id'),
            random_state=42
        )
        
        datasets = {
            'train': train_data,
            'validation': val_data,
            'test': test_data
        }
        
        # Save to files
        for split_name, dataset in datasets.items():
            output_path = f"data/processed/validation_splits/{split_name}_set.csv"
            dataset.to_csv(output_path, index=False)
        
        self.logger.info(f"Created datasets - Train: {len(train_data)}, "
                        f"Val: {len(val_data)}, Test: {len(test_data)}")
        
        return datasets
    
    def create_feature_matrix(self, processed_data: pd.DataFrame, 
                            target_column: str = None) -> Tuple[np.ndarray, np.ndarray]:
        """
        Create feature matrix and target array for ML
        
        Args:
            processed_data: Processed DataFrame
            target_column: Name of target column (if supervised learning)
            
        Returns:
            Tuple of (features, targets)
        """
        # Select numeric features only
        numeric_columns = processed_data.select_dtypes(include=[np.number]).columns.tolist()
        
        # Remove target column from features if specified
        if target_column and target_column in numeric_columns:
            feature_columns = [col for col in numeric_columns if col != target_column]
            X = processed_data[feature_columns].values
            y = processed_data[target_column].values
        else:
            feature_columns = numeric_columns
            X = processed_data[feature_columns].values
            y = None
        
        # Handle any remaining NaN values
        from sklearn.impute import SimpleImputer
        imputer = SimpleImputer(strategy='median')
        X = imputer.fit_transform(X)
        
        # Save feature names for reference
        feature_info = {
            'feature_names': feature_columns,
            'feature_count': len(feature_columns),
            'sample_count': X.shape[0]
        }
        
        with open('data/processed/feature_info.json', 'w') as f:
            json.dump(feature_info, f, indent=2)
        
        return X, y
    
    def prepare_hyperspectral_for_ai(self, image_data: np.ndarray, 
                                   ground_truth: np.ndarray = None) -> Dict[str, np.ndarray]:
        """
        Prepare hyperspectral data for AI training
        
        Args:
            image_data: 3D hyperspectral image
            ground_truth: 2D ground truth labels (optional)
            
        Returns:
            Dictionary with prepared datasets
        """
        height, width, bands = image_data.shape
        
        # Reshape to pixel-wise format
        pixels = image_data.reshape(-1, bands)
        
        # Remove pixels with all zeros or NaN values
        valid_pixels = ~(np.all(pixels == 0, axis=1) | np.any(np.isnan(pixels), axis=1))
        clean_pixels = pixels[valid_pixels]
        
        prepared_data = {
            'features': clean_pixels,
            'original_shape': (height, width, bands),
            'valid_pixel_mask': valid_pixels.reshape(height, width)
        }
        
        if ground_truth is not None:
            labels = ground_truth.reshape(-1)
            clean_labels = labels[valid_pixels]
            prepared_data['labels'] = clean_labels
        
        # Save as compressed numpy arrays
        np.savez_compressed('data/processed/hyperspectral_ai_ready.npz', **prepared_data)
        
        return prepared_data
```

### **Frontend Integration (Arnav & Radhika):**

#### **Dashboard Data Preparation**
```python
class FrontendDataInterface:
    """
    Interface for providing dashboard-ready data to frontend team
    """
    
    def prepare_dashboard_data(self, processed_data: pd.DataFrame) -> Dict:
        """
        Prepare data for dashboard visualization
        
        Returns:
            Dictionary with dashboard-ready data
        """
        # Latest readings per device
        latest_readings = (
            processed_data.groupby('device_id')
            .last()
            .reset_index()
        )
        
        # Time series data for charts
        time_series = processed_data.groupby('timestamp').agg({
            'temperature': ['mean', 'min', 'max'],
            'humidity': ['mean', 'min', 'max'],
            'soil_moisture': ['mean', 'min', 'max'],
            'ph_level': ['mean', 'min', 'max']
        }).reset_index()
        
        # Flatten column names
        time_series.columns = ['timestamp'] + [
            f"{col[0]}_{col[1]}" if col[1] else col[0] 
            for col in time_series.columns[1:]
        ]
        
        # Device statistics
        device_stats = processed_data.groupby('device_id').agg({
            'temperature': ['mean', 'std', 'min', 'max'],
            'humidity': ['mean', 'std', 'min', 'max'],
            'soil_moisture': ['mean', 'std', 'min', 'max'],
            'ph_level': ['mean', 'std', 'min', 'max']
        }).reset_index()
        
        # Flatten column names
        device_stats.columns = ['device_id'] + [
            f"{col[0]}_{col[1]}" if col[1] else col[0] 
            for col in device_stats.columns[1:]
        ]
        
        dashboard_data = {
            'latest_readings': latest_readings.to_dict('records'),
            'time_series': time_series.to_dict('records'),
            'device_statistics': device_stats.to_dict('records'),
            'summary': {
                'total_devices': processed_data['device_id'].nunique(),
                'total_readings': len(processed_data),
                'data_quality_score': self._calculate_data_quality_score(processed_data),
                'last_updated': datetime.now().isoformat()
            }
        }
        
        # Save as JSON for easy frontend consumption
        with open('data/processed/dashboard_data.json', 'w') as f:
            json.dump(dashboard_data, f, indent=2, default=str)
        
        return dashboard_data
    
    def _calculate_data_quality_score(self, data: pd.DataFrame) -> float:
        """Calculate overall data quality score"""
        
        # Calculate completeness (non-null values)
        completeness = (1 - data.isnull().sum().sum() / data.size) * 100
        
        # Calculate consistency (low variance in device readings)
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        consistency_scores = []
        
        for col in numeric_cols:
            if col in data.columns:
                cv = data.groupby('device_id')[col].std() / data.groupby('device_id')[col].mean()
                consistency_scores.append(1 - cv.mean())  # Lower coefficient of variation = higher consistency
        
        consistency = np.mean(consistency_scores) * 100 if consistency_scores else 100
        
        # Overall quality score (weighted average)
        quality_score = (completeness * 0.7 + consistency * 0.3)
        
        return round(max(0, min(100, quality_score)), 2)
    
    def create_visualization_datasets(self, processed_data: pd.DataFrame):
        """
        Create specific datasets for different types of visualizations
        """
        # Hourly aggregations for time series plots
        hourly_data = processed_data.set_index('timestamp').resample('H').mean()
        hourly_data.to_csv('data/processed/hourly_aggregated.csv')
        
        # Daily aggregations for trend analysis
        daily_data = processed_data.set_index('timestamp').resample('D').agg({
            'temperature': ['mean', 'min', 'max'],
            'humidity': ['mean', 'min', 'max'], 
            'soil_moisture': ['mean', 'min', 'max'],
            'ph_level': ['mean', 'min', 'max']
        })
        daily_data.to_csv('data/processed/daily_aggregated.csv')
        
        # Device comparison data
        device_comparison = processed_data.groupby('device_id').agg({
            'temperature': ['mean', 'std'],
            'humidity': ['mean', 'std'],
            'soil_moisture': ['mean', 'std'], 
            'ph_level': ['mean', 'std']
        })
        device_comparison.to_csv('data/processed/device_comparison.csv')
```

---

## 🧪 **Data Quality Monitoring**

### **Automated Quality Checks**

```python
class DataQualityMonitor:
    """
    Automated data quality monitoring and reporting system
    """
    
    def __init__(self, quality_rules_path: str = "configs/quality_rules.json"):
        self.quality_rules = self._load_quality_rules(quality_rules_path)
        self.logger = logging.getLogger(__name__)
    
    def run_quality_checks(self, data: pd.DataFrame) -> Dict:
        """
        Run comprehensive quality checks on dataset
        
        Args:
            data: Dataset to check
            
        Returns:
            Dictionary with quality check results
        """
        self.logger.info("Running data quality checks")
        
        results = {
            'completeness': self._check_completeness(data),
            'validity': self._check_validity(data),
            'consistency': self._check_consistency(data),
            'uniqueness': self._check_uniqueness(data),
            'timeliness': self._check_timeliness(data),
            'accuracy': self._check_accuracy(data)
        }
        
        # Calculate overall quality score
        scores = [check['score'] for check in results.values()]
        results['overall_quality'] = {
            'score': np.mean(scores),
            'grade': self._get_quality_grade(np.mean(scores))
        }
        
        # Generate quality report
        self._generate_quality_report(results)
        
        return results
    
    def _check_completeness(self, data: pd.DataFrame) -> Dict:
        """Check data completeness (missing values)"""
        
        total_cells = data.size
        missing_cells = data.isnull().sum().sum()
        completeness_score = (1 - missing_cells / total_cells) * 100
        
        # Per-column completeness
        column_completeness = {}
        for column in data.columns:
            missing_count = data[column].isnull().sum()
            column_completeness[column] = {
                'missing_count': int(missing_count),
                'missing_percentage': float(missing_count / len(data) * 100),
                'completeness_score': float((1 - missing_count / len(data)) * 100)
            }
        
        return {
            'score': completeness_score,
            'total_missing': int(missing_cells),
            'missing_percentage': float(missing_cells / total_cells * 100),
            'column_details': column_completeness
        }
    
    def _check_validity(self, data: pd.DataFrame) -> Dict:
        """Check data validity (values within expected ranges)"""
        
        validity_rules = {
            'temperature': {'min': -50, 'max': 80},
            'humidity': {'min': 0, 'max': 100},
            'soil_moisture': {'min': 0, 'max': 100},
            'ph_level': {'min': 0, 'max': 14}
        }
        
        invalid_counts = {}
        total_invalid = 0
        
        for column, rules in validity_rules.items():
            if column in data.columns:
                invalid_low = (data[column] < rules['min']).sum()
                invalid_high = (data[column] > rules['max']).sum()
                total_column_invalid = invalid_low + invalid_high
                
                invalid_counts[column] = {
                    'invalid_low': int(invalid_low),
                    'invalid_high': int(invalid_high),
                    'total_invalid': int(total_column_invalid),
                    'invalid_percentage': float(total_column_invalid / len(data) * 100)
                }
                
                total_invalid += total_column_invalid
        
        validity_score = (1 - total_invalid / (len(data) * len(validity_rules))) * 100
        
        return {
            'score': validity_score,
            'total_invalid': int(total_invalid),
            'column_details': invalid_counts
        }
    
    def _check_consistency(self, data: pd.DataFrame) -> Dict:
        """Check data consistency (temporal and logical consistency)"""
        
        consistency_issues = []
        
        # Check temporal consistency
        if 'timestamp' in data.columns:
            data_sorted = data.sort_values(['device_id', 'timestamp'])
            
            # Check for duplicate timestamps per device
            duplicates = data_sorted.groupby(['device_id', 'timestamp']).size()
            duplicate_count = (duplicates > 1).sum()
            
            if duplicate_count > 0:
                consistency_issues.append({
                    'type': 'duplicate_timestamps',
                    'count': int(duplicate_count),
                    'description': 'Multiple readings at same timestamp for same device'
                })
        
        # Check for logical inconsistencies
        if 'temperature' in data.columns and 'humidity' in data.columns:
            # Very high humidity with very high temperature is unusual
            unusual_combinations = ((data['temperature'] > 35) & (data['humidity'] > 90)).sum()
            if unusual_combinations > 0:
                consistency_issues.append({
                    'type': 'unusual_temp_humidity',
                    'count': int(unusual_combinations),
                    'description': 'Unusual temperature-humidity combinations'
                })
        
        consistency_score = max(0, 100 - len(consistency_issues) * 10)
        
        return {
            'score': consistency_score,
            'issues': consistency_issues,
            'issue_count': len(consistency_issues)
        }
    
    def _check_uniqueness(self, data: pd.DataFrame) -> Dict:
        """Check data uniqueness (duplicate records)"""
        
        # Check for exact duplicates
        exact_duplicates = data.duplicated().sum()
        
        # Check for duplicates based on key columns
        if all(col in data.columns for col in ['device_id', 'timestamp']):
            key_duplicates = data.duplicated(subset=['device_id', 'timestamp']).sum()
        else:
            key_duplicates = 0
        
        uniqueness_score = (1 - max(exact_duplicates, key_duplicates) / len(data)) * 100
        
        return {
            'score': uniqueness_score,
            'exact_duplicates': int(exact_duplicates),
            'key_duplicates': int(key_duplicates),
            'duplicate_percentage': float(max(exact_duplicates, key_duplicates) / len(data) * 100)
        }
    
    def _check_timeliness(self, data: pd.DataFrame) -> Dict:
        """Check data timeliness (freshness)"""
        
        if 'timestamp' in data.columns:
            latest_timestamp = pd.to_datetime(data['timestamp']).max()
            current_time = datetime.now()
            
            if latest_timestamp.tz is None:
                latest_timestamp = latest_timestamp.tz_localize('UTC')
            if current_time.tz is None:
                current_time = current_time.replace(tzinfo=latest_timestamp.tz)
            
            time_since_latest = current_time - latest_timestamp
            hours_since_latest = time_since_latest.total_seconds() / 3600
            
            # Score based on freshness (100 for <1 hour, decreasing linearly)
            timeliness_score = max(0, 100 - hours_since_latest * 5)
            
            return {
                'score': timeliness_score,
                'latest_timestamp': latest_timestamp.isoformat(),
                'hours_since_latest': float(hours_since_latest),
                'freshness_grade': 'fresh' if hours_since_latest < 1 else 
                                 'recent' if hours_since_latest < 24 else 'stale'
            }
        else:
            return {
                'score': 0,
                'error': 'No timestamp column found'
            }
    
    def _check_accuracy(self, data: pd.DataFrame) -> Dict:
        """Check data accuracy using statistical methods"""
        
        accuracy_issues = []
        numeric_columns = data.select_dtypes(include=[np.number]).columns
        
        for column in numeric_columns:
            if column in data.columns:
                # Check for statistical outliers (beyond 3 standard deviations)
                mean_val = data[column].mean()
                std_val = data[column].std()
                outliers = np.abs((data[column] - mean_val) / std_val) > 3
                outlier_count = outliers.sum()
                
                if outlier_count > len(data) * 0.05:  # More than 5% outliers is concerning
                    accuracy_issues.append({
                        'column': column,
                        'type': 'statistical_outliers',
                        'count': int(outlier_count),
                        'percentage': float(outlier_count / len(data) * 100)
                    })
        
        # Accuracy score based on number of issues
        accuracy_score = max(0, 100 - len(accuracy_issues) * 20)
        
        return {
            'score': accuracy_score,
            'issues': accuracy_issues,
            'issue_count': len(accuracy_issues)
        }
    
    def _get_quality_grade(self, score: float) -> str:
        """Convert quality score to grade"""
        if score >= 90:
            return 'A'
        elif score >= 80:
            return 'B'
        elif score >= 70:
            return 'C'
        elif score >= 60:
            return 'D'
        else:
            return 'F'
    
    def _generate_quality_report(self, results: Dict):
        """Generate comprehensive quality report"""
        
        report_content = f"""
# Data Quality Report
Generated: {datetime.now().isoformat()}

## Overall Quality Score: {results['overall_quality']['score']:.2f} (Grade: {results['overall_quality']['grade']})

## Detailed Results:

### Completeness: {results['completeness']['score']:.2f}/100
- Missing data: {results['completeness']['missing_percentage']:.2f}%
- Total missing cells: {results['completeness']['total_missing']}

### Validity: {results['validity']['score']:.2f}/100
- Invalid values: {results['validity']['total_invalid']}

### Consistency: {results['consistency']['score']:.2f}/100
- Issues found: {results['consistency']['issue_count']}

### Uniqueness: {results['uniqueness']['score']:.2f}/100
- Duplicate records: {results['uniqueness']['duplicate_percentage']:.2f}%

### Timeliness: {results['timeliness']['score']:.2f}/100
- Hours since latest data: {results['timeliness'].get('hours_since_latest', 'N/A')}

### Accuracy: {results['accuracy']['score']:.2f}/100
- Accuracy issues: {results['accuracy']['issue_count']}

## Recommendations:
"""
        
        # Add recommendations based on results
        if results['completeness']['score'] < 90:
            report_content += "- Address missing data issues, especially in critical columns\n"
        
        if results['validity']['score'] < 90:
            report_content += "- Review data collection processes to prevent invalid values\n"
        
        if results['consistency']['score'] < 90:
            report_content += "- Investigate and resolve consistency issues\n"
        
        if results['timeliness']['score'] < 80:
            report_content += "- Improve data freshness - data appears to be stale\n"
        
        # Save report
        with open(f'data/interim/quality_reports/quality_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md', 'w') as f:
            f.write(report_content)
```

---

## 🎯 **Your Success Metrics**

### **Data Quality KPIs:**
1. **Completeness**: > 95% non-null values across all datasets
2. **Accuracy**: < 2% invalid/outlier data points
3. **Timeliness**: Data freshness < 1 hour for real-time sources
4. **Consistency**: < 1% logical inconsistencies
5. **Processing Speed**: < 30 minutes for full pipeline execution

### **System Integration KPIs:**
1. **Backend Compatibility**: 100% successful data exports to MATLAB
2. **AI Readiness**: ML datasets available within 1 hour of raw data arrival
3. **Frontend Data**: Dashboard data updated every 15 minutes
4. **Pipeline Reliability**: > 99% successful pipeline runs
5. **Documentation Coverage**: 100% of datasets documented

### **Operational KPIs:**
1. **Data Volume**: Handle 10,000+ sensor readings per hour
2. **Storage Efficiency**: < 70% storage growth month-over-month
3. **Query Performance**: < 5 seconds for dashboard queries
4. **Error Rate**: < 0.1% processing errors
5. **Recovery Time**: < 15 minutes to restore from failures

---

## 🚀 **Advanced Data Management Features**

### **Data Versioning and Lineage:**

```python
class DataVersionManager:
    """
    Data versioning and lineage tracking system
    """
    
    def __init__(self, version_db_path: str = "data/metadata/versions.db"):
        self.db_path = version_db_path
        self._init_version_db()
        self.logger = logging.getLogger(__name__)
    
    def create_data_version(self, dataset_path: str, 
                          processing_metadata: Dict) -> str:
        """
        Create a new version of processed dataset
        
        Returns:
            Version ID for tracking
        """
        version_id = f"v_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Calculate dataset hash for integrity
        dataset_hash = self._calculate_dataset_hash(dataset_path)
        
        # Store version metadata
        version_record = {
            'version_id': version_id,
            'dataset_path': dataset_path,
            'dataset_hash': dataset_hash,
            'processing_metadata': json.dumps(processing_metadata),
            'created_timestamp': datetime.now().isoformat(),
            'file_size_bytes': Path(dataset_path).stat().st_size if Path(dataset_path).exists() else 0
        }
        
        self._store_version_record(version_record)
        
        return version_id
    
    def track_data_lineage(self, output_dataset: str, 
                          input_datasets: List[str], 
                          processing_steps: List[str]) -> str:
        """
        Track data lineage through processing pipeline
        
        Returns:
            Lineage ID for tracking
        """
        lineage_id = f"lineage_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        lineage_record = {
            'lineage_id': lineage_id,
            'output_dataset': output_dataset,
            'input_datasets': json.dumps(input_datasets),
            'processing_steps': json.dumps(processing_steps),
            'created_timestamp': datetime.now().isoformat()
        }
        
        self._store_lineage_record(lineage_record)
        
        return lineage_id
```

---

**Remember: You are the foundation upon which all intelligent agricultural insights are built! Every dataset you clean, every pipeline you optimize, and every quality check you implement directly impacts the reliability and accuracy of the entire system. Clean, well-structured data is the fuel that powers AI models, backend analysis, and frontend visualizations! 📊🌱**

**Your meticulous attention to data quality and your robust processing pipelines ensure that farmers receive accurate, trustworthy information to make critical agricultural decisions. The future of precision agriculture depends on the data excellence you deliver! 🚀📈**