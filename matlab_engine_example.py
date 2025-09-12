#!/usr/bin/env python3
"""
Example usage of MATLAB engine in Python
"""

import matlab.engine
import numpy as np

class MatlabEngineWrapper:
    """Wrapper class for MATLAB engine operations"""
    
    def __init__(self):
        """Initialize MATLAB engine"""
        print("Initializing MATLAB engine...")
        self.eng = matlab.engine.start_matlab()
        print("MATLAB engine ready!")
    
    def __del__(self):
        """Clean up MATLAB engine"""
        if hasattr(self, 'eng'):
            self.eng.quit()
    
    def numpy_to_matlab(self, np_array):
        """Convert numpy array to MATLAB array"""
        return matlab.double(np_array.tolist())
    
    def matlab_to_numpy(self, matlab_array):
        """Convert MATLAB array to numpy array"""
        return np.array(matlab_array._data).reshape(matlab_array.size)
    
    def solve_linear_system(self, A, b):
        """Solve linear system Ax = b using MATLAB"""
        A_matlab = self.numpy_to_matlab(A)
        b_matlab = self.numpy_to_matlab(b)
        x_matlab = self.eng.mldivide(A_matlab, b_matlab)
        return self.matlab_to_numpy(x_matlab)
    
    def plot_function(self, func_name="sin", x_range=(-10, 10), num_points=100):
        """Plot a function using MATLAB"""
        # Create x values
        x_start, x_end = x_range
        x = self.eng.linspace(x_start, x_end, num_points)
        
        # Calculate y values
        if func_name == "sin":
            y = self.eng.sin(x)
        elif func_name == "cos":
            y = self.eng.cos(x)
        elif func_name == "exp":
            y = self.eng.exp(x)
        else:
            raise ValueError(f"Unknown function: {func_name}")
        
        # Plot
        self.eng.figure(nargout=0)
        self.eng.plot(x, y, nargout=0)
        self.eng.title(f"Plot of {func_name}(x)", nargout=0)
        self.eng.xlabel("x", nargout=0)
        self.eng.ylabel(f"{func_name}(x)", nargout=0)
        self.eng.grid("on", nargout=0)
        
        print(f"Plot of {func_name} function created!")
    
    def execute_matlab_code(self, matlab_code):
        """Execute arbitrary MATLAB code"""
        return self.eng.eval(matlab_code, nargout=0)

# Example usage
if __name__ == "__main__":
    # Initialize MATLAB engine
    matlab = MatlabEngineWrapper()
    
    # Example 1: Basic calculations
    print("\n=== Example 1: Basic Calculations ===")
    result = matlab.eng.sqrt(16.0)
    print(f"sqrt(16) = {result}")
    
    # Example 2: Matrix operations
    print("\n=== Example 2: Matrix Operations ===")
    A = np.array([[2, 1], [1, 3]])
    b = np.array([[5], [6]])
    
    print(f"Solving Ax = b where:")
    print(f"A = \n{A}")
    print(f"b = \n{b}")
    
    x = matlab.solve_linear_system(A, b)
    print(f"Solution x = \n{x}")
    
    # Example 3: MATLAB functions
    print("\n=== Example 3: MATLAB Functions ===")
    # Create some data
    t = matlab.eng.linspace(0, 4*matlab.eng.pi(), 100)
    signal = matlab.eng.sin(t)
    
    # Calculate statistics using MATLAB
    mean_val = matlab.eng.mean(signal)
    std_val = matlab.eng.std(signal)
    max_val = matlab.eng.max(signal)
    min_val = matlab.eng.min(signal)
    
    print(f"Signal statistics:")
    print(f"  Mean: {mean_val}")
    print(f"  Std:  {std_val}")
    print(f"  Max:  {max_val}")
    print(f"  Min:  {min_val}")
    
    # Example 4: Execute custom MATLAB code
    print("\n=== Example 4: Custom MATLAB Code ===")
    matlab.execute_matlab_code("disp('Hello from MATLAB!')")
    
    # Example 5: Plotting (uncomment to create plots)
    # print("\n=== Example 5: Plotting ===")
    # matlab.plot_function("sin", (-2*3.14159, 2*3.14159))
    
    print("\n✅ All examples completed successfully!")
    print("MATLAB engine is ready for your custom operations!")
