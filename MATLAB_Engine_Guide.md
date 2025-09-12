# MATLAB Engine for Python - Quick Reference Guide

## ✅ Installation Complete!

The MATLAB Engine for Python has been successfully installed and tested on your system.

- **Python Version**: 3.9.13
- **MATLAB Version**: R2025a (detected from installation)
- **Installation Path**: `F:\MATLAB\extern\engines\python`
- **Virtual Environment**: `F:\SIH 2025\SIH-2025\venv`

## 🚀 Basic Usage

### Initialize MATLAB Engine
```python
import matlab.engine

# Start MATLAB engine
eng = matlab.engine.start_matlab()

# When done (optional - engine will clean up automatically)
eng.quit()
```

### Basic Operations
```python
# Mathematical functions
result = eng.sqrt(25.0)      # Returns 5.0
result = eng.sin(1.57)       # Returns ~1.0
result = eng.power(2.0, 3.0) # Returns 8.0

# Constants
pi_val = eng.pi()            # Get pi value
```

### Matrix Operations
```python
# Create MATLAB matrices
A = matlab.double([[1, 2], [3, 4]])
B = matlab.double([[5, 6], [7, 8]])

# Matrix operations
C = eng.mtimes(A, B)  # Matrix multiplication
D = eng.plus(A, B)    # Matrix addition
E = eng.minus(A, B)   # Matrix subtraction
```

### Linear Algebra
```python
# Solve linear system Ax = b
A = matlab.double([[2, 1], [1, 3]])
b = matlab.double([[5], [6]])
x = eng.mldivide(A, b)  # MATLAB's backslash operator

# Matrix operations
det_A = eng.det(A)           # Determinant
inv_A = eng.inv(A)           # Inverse
eig_vals = eng.eig(A)        # Eigenvalues
```

### Data Generation and Statistics
```python
# Generate data
x = eng.linspace(0.0, 2.0*eng.pi(), 100)  # Linear space
y = eng.sin(x)                             # Apply function

# Statistics
mean_val = eng.mean(y)     # Mean
std_val = eng.std(y)       # Standard deviation
max_val = eng.max(y)       # Maximum
min_val = eng.min(y)       # Minimum
```

### Execute MATLAB Code
```python
# Execute MATLAB commands
eng.eval("disp('Hello from MATLAB!')", nargout=0)

# Create variables in MATLAB workspace
eng.eval("my_data = [1, 2, 3, 4, 5];", nargout=0)

# Access MATLAB workspace variables
my_data = eng.workspace['my_data']
```

### Plotting (if MATLAB has graphics support)
```python
# Create plots
x = eng.linspace(-eng.pi(), eng.pi(), 100)
y = eng.sin(x)

eng.figure(nargout=0)
eng.plot(x, y, nargout=0)
eng.title("Sine Function", nargout=0)
eng.xlabel("x", nargout=0)
eng.ylabel("sin(x)", nargout=0)
eng.grid("on", nargout=0)
```

## 🔧 Data Type Conversion

### Python to MATLAB
```python
import numpy as np

# Lists/arrays to MATLAB
python_list = [[1, 2], [3, 4]]
matlab_array = matlab.double(python_list)

# NumPy to MATLAB (if using NumPy)
np_array = np.array([[1, 2], [3, 4]])
matlab_array = matlab.double(np_array.tolist())
```

### MATLAB to Python
```python
# MATLAB array to Python list
matlab_result = eng.linspace(0, 10, 5)
python_list = list(matlab_result[0])

# For NumPy users
import numpy as np
numpy_array = np.array(matlab_result._data).reshape(matlab_result.size)
```

## 📝 Important Notes

1. **Function Arguments**: Most MATLAB functions require explicit argument types
2. **Output Arguments**: Use `nargout=0` for functions that don't return values (like plotting)
3. **Error Handling**: MATLAB errors will raise Python exceptions
4. **Performance**: Starting the engine has overhead - reuse the engine object when possible
5. **Memory**: MATLAB engine runs in a separate process and may use significant memory

## 🧪 Test Scripts

- **`matlab_engine_test.py`**: Basic functionality test
- **`simple_matlab_test.py`**: Comprehensive test suite
- **`matlab_engine_example.py`**: Advanced examples with NumPy integration

## 🔍 Troubleshooting

If you encounter issues:

1. **Import Error**: Ensure MATLAB Engine is properly installed
   ```bash
   python -c "import matlab.engine; print('OK')"
   ```

2. **Engine Start Error**: Check MATLAB installation and PATH
   ```bash
   where matlab  # Should show MATLAB executable
   ```

3. **Version Compatibility**: Ensure Python version matches MATLAB requirements

4. **Memory Issues**: Use `eng.quit()` to clean up engines when done

## 🎯 Ready to Use!

The MATLAB Engine is now ready for your SIH 2025 project. You can:

- Call any MATLAB function from Python
- Process data using MATLAB's powerful toolboxes
- Integrate MATLAB algorithms into your Python workflow
- Access MATLAB's visualization capabilities

Happy coding! 🚀
