#!/usr/bin/env python3
"""
Test script to initialize and test MATLAB engine
"""

import matlab.engine

def initialize_matlab_engine():
    """Initialize MATLAB engine and perform a basic test"""
    print("Starting MATLAB engine...")
    
    # Start MATLAB engine
    eng = matlab.engine.start_matlab()
    print("✅ MATLAB engine started successfully!")
    
    # Test basic MATLAB operation
    result = eng.sqrt(4.0)
    print(f"✅ Test operation: sqrt(4) = {result}")
    
    # Test matrix operations
    A = matlab.double([[1, 2], [3, 4]])
    B = matlab.double([[5, 6], [7, 8]])
    C = eng.plus(A, B)
    print(f"✅ Matrix addition test:")
    print(f"   A = {A}")
    print(f"   B = {B}")
    print(f"   A + B = {C}")
    
    # Test MATLAB function
    pi_val = eng.pi()
    x = eng.linspace(0.0, 2.0 * pi_val, 10)
    y = eng.sin(x)
    print(f"✅ MATLAB function test: sin(linspace(0, 2*pi, 10))")
    print(f"   First few values: {list(y[0][:3])}")
    
    print("\n🎉 MATLAB Engine initialization and testing completed successfully!")
    
    return eng

if __name__ == "__main__":
    try:
        engine = initialize_matlab_engine()
        # Don't quit the engine here so it can be reused
        print("\nMATLAB engine is ready for use!")
        print("To use in your code:")
        print("  import matlab.engine")
        print("  eng = matlab.engine.start_matlab()")
        
    except Exception as e:
        print(f"❌ Error initializing MATLAB engine: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure MATLAB is properly installed")
        print("2. Check that your Python version is compatible with MATLAB")
        print("3. Ensure MATLAB Engine for Python is correctly installed")
