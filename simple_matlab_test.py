#!/usr/bin/env python3
"""
Simple MATLAB engine test and initialization
"""

import matlab.engine

def main():
    """Main function to test MATLAB engine"""
    print("🚀 Starting MATLAB Engine...")
    
    # Initialize MATLAB engine
    eng = matlab.engine.start_matlab()
    print("✅ MATLAB engine initialized successfully!")
    
    # Test 1: Basic math operations
    print("\n=== Test 1: Basic Operations ===")
    result = eng.sqrt(25.0)
    print(f"sqrt(25) = {result}")
    
    result = eng.power(2.0, 3.0)
    print(f"2^3 = {result}")
    
    # Test 2: Matrix operations
    print("\n=== Test 2: Matrix Operations ===")
    A = matlab.double([[1, 2], [3, 4]])
    B = matlab.double([[5, 6], [7, 8]])
    
    print(f"Matrix A: {A}")
    print(f"Matrix B: {B}")
    
    # Matrix multiplication
    C = eng.mtimes(A, B)
    print(f"A * B = {C}")
    
    # Matrix addition  
    D = eng.plus(A, B)
    print(f"A + B = {D}")
    
    # Test 3: MATLAB functions
    print("\n=== Test 3: MATLAB Functions ===")
    
    # Create data
    pi_val = eng.pi()
    x = eng.linspace(0.0, 2.0*pi_val, 10)
    y = eng.sin(x)
    
    print("x values (first 3):", list(x[0][:3]))
    print("sin(x) values (first 3):", list(y[0][:3]))
    
    # Statistics
    mean_y = eng.mean(y)
    std_y = eng.std(y)
    print(f"Mean of sin(x): {mean_y}")
    print(f"Std of sin(x): {std_y}")
    
    # Test 4: Linear system solving
    print("\n=== Test 4: Solve Linear System ===")
    A = matlab.double([[2, 1], [1, 3]])
    b = matlab.double([[5], [6]])
    
    print("Solving Ax = b")
    print(f"A = {A}")
    print(f"b = {b}")
    
    x = eng.mldivide(A, b)  # This is MATLAB's backslash operator
    print(f"Solution x = {x}")
    
    # Test 5: Execute MATLAB code
    print("\n=== Test 5: Execute MATLAB Code ===")
    eng.eval("disp('Hello from MATLAB via Python!')", nargout=0)
    
    # Create a variable in MATLAB workspace
    eng.eval("my_var = [1, 2, 3, 4, 5];", nargout=0)
    
    # Get the variable back
    my_var = eng.workspace['my_var']
    print(f"Variable from MATLAB workspace: {my_var}")
    
    print("\n🎉 All tests completed successfully!")
    print("\n📋 MATLAB Engine is ready for use!")
    print("\n💡 Basic usage patterns:")
    print("   import matlab.engine")
    print("   eng = matlab.engine.start_matlab()")
    print("   result = eng.function_name(arguments)")
    print("   eng.quit()  # When done")
    
    # Don't quit automatically so engine can be reused
    # eng.quit()
    
    return eng

if __name__ == "__main__":
    try:
        engine = main()
        print(f"\n✅ MATLAB Engine initialized and ready!")
        print(f"   Engine object: {engine}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Ensure MATLAB is installed and in PATH")
        print("2. Check MATLAB Engine for Python installation")
        print("3. Verify Python version compatibility")
