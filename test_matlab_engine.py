#!/usr/bin/env python3
"""
MATLAB Engine Test Script

This script demonstrates how to initialize and use MATLAB Engine for Python.
Note: Due to Python 3.13 compatibility issues, you may need to use Python 3.9-3.12.
"""

import sys
import os

def test_matlab_engine():
    """Test MATLAB Engine initialization and basic operations."""
    
    try:
        print("Testing MATLAB Engine for Python...")
        print(f"Python version: {sys.version}")
        
        # Add MATLAB to PATH if needed
        matlab_bin = r"F:\MATLAB\bin"
        if matlab_bin not in os.environ['PATH']:
            os.environ['PATH'] = matlab_bin + os.pathsep + os.environ['PATH']
            print(f"Added {matlab_bin} to PATH")
        
        # Import MATLAB engine
        print("Importing matlab.engine...")
        import matlab.engine
        print("✓ MATLAB engine imported successfully")
        
        # Start MATLAB engine
        print("Starting MATLAB engine...")
        eng = matlab.engine.start_matlab()
        print("✓ MATLAB engine started successfully")
        
        # Test a simple operation
        print("Testing basic MATLAB operation...")
        result = eng.sqrt(4.0)
        print(f"✓ sqrt(4) = {result}")
        
        # Test matrix operations
        print("Testing matrix operations...")
        A = matlab.double([[1, 2], [3, 4]])
        result = eng.eig(A)
        print(f"✓ Eigenvalues of [[1,2],[3,4]]: {result}")
        
        # Close the engine
        print("Closing MATLAB engine...")
        eng.quit()
        print("✓ MATLAB engine closed successfully")
        
        print("\n🎉 All tests passed! MATLAB Engine is working properly.")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure MATLAB is properly installed")
        print("2. Try using Python 3.9-3.12 instead of 3.13")
        print("3. Check if MATLAB is in your system PATH")
        print("4. Try running this script as administrator")
        return False

def initialize_matlab_engine():
    """Initialize MATLAB engine for use in other scripts."""
    
    try:
        import matlab.engine
        
        # Add MATLAB to PATH if needed
        matlab_bin = r"F:\MATLAB\bin"
        if matlab_bin not in os.environ['PATH']:
            os.environ['PATH'] = matlab_bin + os.pathsep + os.environ['PATH']
        
        # Start MATLAB engine
        eng = matlab.engine.start_matlab()
        print("MATLAB Engine initialized successfully!")
        return eng
        
    except Exception as e:
        print(f"Failed to initialize MATLAB Engine: {e}")
        return None

if __name__ == "__main__":
    test_matlab_engine()
