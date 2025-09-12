#!/usr/bin/env python3
"""
Test script to verify the Agri-AI Dashboard setup
Run this script to check if all components are working correctly.
"""

import sys
import os

def test_imports():
    """Test if all required packages can be imported"""
    print("🔍 Testing Python package imports...")
    
    try:
        import streamlit as st
        print(f"  ✅ Streamlit: {st.__version__}")
    except ImportError as e:
        print(f"  ❌ Streamlit: {e}")
        return False
        
    try:
        import numpy as np
        print(f"  ✅ NumPy: {np.__version__}")
    except ImportError as e:
        print(f"  ❌ NumPy: {e}")
        return False
        
    try:
        import time
        print("  ✅ Time module: Available")
    except ImportError as e:
        print(f"  ❌ Time module: {e}")
        return False
        
    # Test MATLAB Engine (optional)
    try:
        import matlab.engine
        print("  ✅ MATLAB Engine: Available")
        return True
    except ImportError:
        print("  ⚠️  MATLAB Engine: Not available (optional - dashboard will use mock data)")
        return True
        
def test_file_structure():
    """Test if required files exist"""
    print("\n📁 Testing file structure...")
    
    required_files = [
        "app.py",
        "requirements.txt",
        "backend/run_main_analysis.m",
        "SETUP.md"
    ]
    
    all_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path} - Missing!")
            all_exist = False
            
    return all_exist

def test_matlab_function():
    """Test if MATLAB function exists and is accessible"""
    print("\n🔬 Testing MATLAB integration...")
    
    matlab_file = "backend/run_main_analysis.m"
    if not os.path.exists(matlab_file):
        print("  ❌ MATLAB function file not found!")
        return False
        
    # Check if file contains the expected function signature
    try:
        with open(matlab_file, 'r', encoding='utf-8') as f:
            content = f.read()
            if 'function [health_map, alert_message] = run_main_analysis()' in content:
                print("  ✅ MATLAB function signature correct")
                return True
            else:
                print("  ❌ MATLAB function signature not found!")
                return False
    except Exception as e:
        print(f"  ❌ Error reading MATLAB file: {e}")
        return False

def test_streamlit_compatibility():
    """Test basic Streamlit functionality"""
    print("\n🌐 Testing Streamlit compatibility...")
    
    try:
        # Test creating a basic Streamlit app structure (without running)
        import streamlit as st
        import numpy as np
        
        # These should not cause errors
        test_data = np.random.rand(10, 10, 3)
        print("  ✅ NumPy array creation successful")
        print("  ✅ Streamlit import successful")
        return True
        
    except Exception as e:
        print(f"  ❌ Streamlit compatibility test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Agri-AI Dashboard Setup Verification")
    print("=" * 50)
    
    tests = [
        ("Package Imports", test_imports),
        ("File Structure", test_file_structure), 
        ("MATLAB Function", test_matlab_function),
        ("Streamlit Compatibility", test_streamlit_compatibility)
    ]
    
    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ {test_name} failed with error: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your setup is ready.")
        print("\nNext steps:")
        print("1. Run: streamlit run app.py")
        print("2. Open browser to: http://localhost:8501")
        print("3. Click 'Initialize MATLAB Engine' button")
        print("4. Start analyzing agricultural data!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please check the issues above.")
        print("\nRefer to SETUP.md for troubleshooting guidance.")

if __name__ == "__main__":
    main()
