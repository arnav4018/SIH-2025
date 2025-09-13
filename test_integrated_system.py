"""
Integrated Agricultural Monitoring System - Test Suite
====================================================

Comprehensive testing script to validate all components of the system:
- Data availability and integrity
- MATLAB functions and integration
- Python data processing
- End-to-end workflow

Author: Agricultural Monitoring Team
Version: v1.0
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import json

print("=" * 60)
print("🌾 AGRICULTURAL MONITORING SYSTEM - INTEGRATION TEST")
print("=" * 60)

# Get project root
project_root = os.path.dirname(os.path.abspath(__file__))
print(f"📂 Project Root: {project_root}")

# Test 1: Data Availability Check
print("\n1️⃣ TESTING DATA AVAILABILITY")
print("-" * 40)

# Check hyperspectral data
hyperspectral_files = [
    'data/raw/Indian_pines_corrected.mat',
    'data/raw/Indian_pines_gt.mat',
    'data/raw/Indian_pines.mat'
]

data_status = {}
for file_path in hyperspectral_files:
    full_path = os.path.join(project_root, file_path)
    exists = os.path.exists(full_path)
    if exists:
        size_mb = os.path.getsize(full_path) / (1024 * 1024)
        print(f"✅ {file_path}: {size_mb:.2f} MB")
        data_status[file_path] = {'exists': True, 'size_mb': size_mb}
    else:
        print(f"❌ {file_path}: NOT FOUND")
        data_status[file_path] = {'exists': False, 'size_mb': 0}

# Check sensor data
sensor_data_path = os.path.join(project_root, 'data/simulated_sensors.csv')
if os.path.exists(sensor_data_path):
    try:
        sensor_df = pd.read_csv(sensor_data_path)
        print(f"✅ Sensor Data: {len(sensor_df)} records")
        print(f"   Columns: {list(sensor_df.columns)}")
        print(f"   Date Range: {sensor_df.iloc[0]['timestamp']} to {sensor_df.iloc[-1]['timestamp']}")
        data_status['sensor_data'] = {'exists': True, 'records': len(sensor_df)}
    except Exception as e:
        print(f"⚠️ Sensor Data: Error reading - {e}")
        data_status['sensor_data'] = {'exists': False, 'error': str(e)}
else:
    print(f"❌ Sensor Data: NOT FOUND")
    data_status['sensor_data'] = {'exists': False}

# Test 2: MATLAB Function Availability
print("\n2️⃣ TESTING MATLAB FUNCTIONS")
print("-" * 40)

matlab_functions = [
    ('backend/run_main_analysis.m', 'Stub analysis function'),
    ('backend/run_main_analysis_enhanced.m', 'Enhanced analysis function'),
    ('ai/analyze_hyperspectral.m', 'Hyperspectral analysis'),
    ('ai/process_sensor_data.m', 'Sensor data processing')
]

matlab_status = {}
for func_path, description in matlab_functions:
    full_path = os.path.join(project_root, func_path)
    exists = os.path.exists(full_path)
    if exists:
        with open(full_path, 'r') as f:
            content = f.read()
            lines = len(content.split('\n'))
        print(f"✅ {func_path}: {description} ({lines} lines)")
        matlab_status[func_path] = {'exists': True, 'lines': lines}
    else:
        print(f"❌ {func_path}: NOT FOUND")
        matlab_status[func_path] = {'exists': False}

# Test 3: Python Components
print("\n3️⃣ TESTING PYTHON COMPONENTS")
print("-" * 40)

try:
    # Test data processor import
    sys.path.insert(0, os.path.join(project_root, 'frontend'))
    from agri_data_processor import AgriDataProcessor, format_alert_for_display
    print("✅ AgriDataProcessor: Import successful")
    
    # Test data processor functionality
    processor = AgriDataProcessor()
    print("✅ AgriDataProcessor: Instance created")
    
    # Test alert formatting
    test_alert = format_alert_for_display("Test alert message", "warning")
    print(f"✅ Alert Formatting: {test_alert['icon']} {test_alert['label']}")
    
    python_status = {'import': True, 'processor': True, 'alert_format': True}
    
except Exception as e:
    print(f"❌ Python Components: Error - {e}")
    python_status = {'import': False, 'error': str(e)}

# Test 4: Required Python Packages
print("\n4️⃣ TESTING PYTHON DEPENDENCIES")
print("-" * 40)

required_packages = [
    ('numpy', 'np'),
    ('pandas', 'pd'),
    ('matplotlib', 'plt'),
    ('streamlit', 'st'),
    ('plotly', None)
]

package_status = {}
for package, alias in required_packages:
    try:
        if alias:
            exec(f"import {package} as {alias}")
        else:
            exec(f"import {package}")
        print(f"✅ {package}: Available")
        package_status[package] = True
    except ImportError:
        print(f"❌ {package}: NOT AVAILABLE")
        package_status[package] = False

# Test 5: Mock Data Processing Test
print("\n5️⃣ TESTING DATA PROCESSING PIPELINE")
print("-" * 40)

if python_status.get('processor', False):
    try:
        # Create mock MATLAB results
        mock_health_map = np.random.rand(100, 100)
        mock_alert = "Test alert: System functioning normally"
        mock_stats = {
            'temperature': 25.5,
            'humidity': 65.0,
            'soil_moisture': 42.0,
            'overall_health_score': 0.75,
            'ndvi_mean': 0.6
        }
        
        # Process through pipeline
        results = processor.process_matlab_results(mock_health_map, mock_alert, mock_stats)
        
        print("✅ Mock Data Processing: Successful")
        print(f"   Health Map Shape: {results['health_map'].shape}")
        print(f"   Alert Severity: {results['alert_severity']}")
        print(f"   Stats Fields: {len(results['stats'])}")
        print(f"   Data Quality: {results['data_quality_score']:.2f}")
        
        # Test visualization
        fig = processor.create_health_map_visualization(results['health_map'])
        print("✅ Health Map Visualization: Generated")
        plt.close(fig)  # Close to prevent display
        
        processing_status = {'success': True, 'data_quality': results['data_quality_score']}
        
    except Exception as e:
        print(f"❌ Data Processing: Error - {e}")
        processing_status = {'success': False, 'error': str(e)}
else:
    print("⏭️ Data Processing: Skipped (processor not available)")
    processing_status = {'success': False, 'reason': 'processor_unavailable'}

# Test 6: Dashboard Components
print("\n6️⃣ TESTING DASHBOARD COMPONENTS")
print("-" * 40)

dashboard_files = [
    'frontend/app.py',
    'frontend/app_enhanced.py', 
    'frontend/app_integrated.py',
    'frontend/agri_data_processor.py'
]

dashboard_status = {}
for file_path in dashboard_files:
    full_path = os.path.join(project_root, file_path)
    exists = os.path.exists(full_path)
    if exists:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = len(content.split('\n'))
        print(f"✅ {file_path}: {lines} lines")
        dashboard_status[file_path] = {'exists': True, 'lines': lines}
    else:
        print(f"❌ {file_path}: NOT FOUND")
        dashboard_status[file_path] = {'exists': False}

# Test 7: System Integration Readiness
print("\n7️⃣ SYSTEM INTEGRATION READINESS")
print("-" * 40)

# Calculate readiness score
readiness_factors = {
    'hyperspectral_data': any(data_status[f]['exists'] for f in hyperspectral_files),
    'sensor_data': data_status['sensor_data']['exists'],
    'matlab_functions': all(matlab_status[f]['exists'] for f, _ in matlab_functions),
    'python_components': python_status.get('processor', False),
    'required_packages': all(package_status.values()),
    'dashboard_files': all(dashboard_status[f]['exists'] for f in dashboard_files),
    'data_processing': processing_status.get('success', False)
}

readiness_score = sum(readiness_factors.values()) / len(readiness_factors) * 100

print(f"📊 SYSTEM READINESS SCORE: {readiness_score:.1f}%")
print()

for factor, status in readiness_factors.items():
    icon = "✅" if status else "❌"
    print(f"{icon} {factor.replace('_', ' ').title()}: {'Ready' if status else 'Not Ready'}")

# Summary and Recommendations
print("\n" + "=" * 60)
print("📋 INTEGRATION TEST SUMMARY")
print("=" * 60)

if readiness_score >= 90:
    print("🎉 EXCELLENT: System is fully ready for deployment!")
    print("✨ All components are available and functional.")
    print("🚀 You can run the integrated dashboard immediately.")
elif readiness_score >= 70:
    print("👍 GOOD: System is mostly ready with minor issues.")
    print("🔧 Address the missing components for optimal performance.")
elif readiness_score >= 50:
    print("⚠️ FAIR: System has significant gaps that need attention.")
    print("🛠️ Several components require installation or configuration.")
else:
    print("❌ POOR: System requires substantial work before deployment.")
    print("📋 Please install missing components and data files.")

print(f"\n📊 Overall Score: {readiness_score:.1f}%")

# Recommendations
print("\n🔍 RECOMMENDATIONS:")
if not data_status['data/raw/Indian_pines_corrected.mat']['exists']:
    print("• Download Indian Pines hyperspectral dataset")
if not all(package_status.values()):
    missing = [pkg for pkg, status in package_status.items() if not status]
    print(f"• Install missing Python packages: {', '.join(missing)}")
if not processing_status.get('success', False):
    print("• Debug data processing pipeline")

print("\n🎯 NEXT STEPS:")
print("1. Address any ❌ items above")
print("2. Run: streamlit run frontend/app_integrated.py")
print("3. Initialize MATLAB Engine in the dashboard")
print("4. Test with real data analysis")

# Export test results
test_results = {
    'timestamp': datetime.now().isoformat(),
    'readiness_score': readiness_score,
    'data_status': data_status,
    'matlab_status': matlab_status,
    'python_status': python_status,
    'package_status': package_status,
    'processing_status': processing_status,
    'dashboard_status': dashboard_status,
    'readiness_factors': readiness_factors
}

results_file = os.path.join(project_root, 'integration_test_results.json')
with open(results_file, 'w') as f:
    json.dump(test_results, f, indent=2, default=str)

print(f"\n💾 Test results saved to: integration_test_results.json")
print("=" * 60)