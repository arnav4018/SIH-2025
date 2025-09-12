@echo off
REM Agricultural Monitoring Dashboard Startup Script
REM SIH 2025 Project - Quick Launch

echo ============================================
echo Agricultural Monitoring Dashboard
echo SIH 2025 Project
echo ============================================
echo.

REM Check if we're in the correct directory
if not exist "frontend\app.py" (
    echo Error: frontend\app.py not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Starting Agricultural Dashboard...
echo.
echo Available versions:
echo 1. Basic Dashboard (app.py) - Simple and reliable
echo 2. Enhanced Dashboard (app_enhanced.py) - Advanced features
echo.

set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo Starting Basic Dashboard...
    echo Opening browser at http://localhost:8501
    echo Press Ctrl+C to stop the dashboard
    echo.
    streamlit run frontend\app.py
) else if "%choice%"=="2" (
    echo Starting Enhanced Dashboard...
    echo Opening browser at http://localhost:8501
    echo Press Ctrl+C to stop the dashboard
    echo.
    streamlit run frontend\app_enhanced.py
) else (
    echo Invalid choice. Starting Basic Dashboard by default...
    echo.
    streamlit run frontend\app.py
)

pause
