# SIH 2025 Enhanced Agricultural Dashboard Launcher
# PowerShell Script to run the dashboard with proper MATLAB integration

Write-Host "============================================" -ForegroundColor Green
Write-Host "SIH 2025 - Agricultural Monitoring Dashboard" -ForegroundColor Green
Write-Host "Enhanced Version with MATLAB Integration" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Set working directory
Set-Location "F:\SIH 2025\SIH-2025"
Write-Host "Working Directory: $(Get-Location)" -ForegroundColor Yellow

# Activate virtual environment
Write-Host "Activating Python virtual environment..." -ForegroundColor Cyan
& "..\..venv\Scripts\Activate.ps1"

# Add MATLAB to PATH
Write-Host "Adding MATLAB to PATH..." -ForegroundColor Cyan
$env:PATH = "F:\MATLAB\bin;" + $env:PATH

# Verify MATLAB availability
Write-Host "Verifying MATLAB installation..." -ForegroundColor Cyan
if (Test-Path "F:\MATLAB\bin\matlab.exe") {
    Write-Host "✅ MATLAB found at F:\MATLAB\bin\matlab.exe" -ForegroundColor Green
} else {
    Write-Host "❌ MATLAB not found! Please check installation." -ForegroundColor Red
    pause
    exit 1
}

# Test MATLAB Engine
Write-Host "Testing MATLAB Engine connectivity..." -ForegroundColor Cyan
try {
    $testResult = python -c "import matlab.engine; print('MATLAB Engine API available'); exit(0)" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MATLAB Engine API is available" -ForegroundColor Green
    } else {
        Write-Host "❌ MATLAB Engine API test failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error testing MATLAB Engine" -ForegroundColor Red
}

Write-Host ""
Write-Host "Starting Enhanced Agricultural Dashboard..." -ForegroundColor Magenta
Write-Host "Dashboard will be available at: http://localhost:8501" -ForegroundColor Yellow
Write-Host ""
Write-Host "Features available:" -ForegroundColor White
Write-Host "  🌾 Real-time crop health monitoring" -ForegroundColor White
Write-Host "  🔬 MATLAB-powered AI analysis" -ForegroundColor White
Write-Host "  📊 Advanced sensor data visualization" -ForegroundColor White
Write-Host "  🚨 Intelligent alert system" -ForegroundColor White
Write-Host "  📤 Data export functionality" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the dashboard" -ForegroundColor Red
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Start Streamlit with proper configuration
streamlit run frontend\app_enhanced.py --server.port 8501 --server.headless false --server.runOnSave false

Write-Host ""
Write-Host "Dashboard has been stopped." -ForegroundColor Yellow
Write-Host "Thank you for using SIH 2025 Agricultural Dashboard!" -ForegroundColor Green
pause