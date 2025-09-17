# SIH 2025 Full-Stack Agricultural Dashboard Launcher
# PowerShell Script to run both React frontend and FastAPI backend with MATLAB integration

Write-Host "============================================" -ForegroundColor Green
Write-Host "SIH 2025 - Full-Stack Agricultural Dashboard" -ForegroundColor Green
Write-Host "React Frontend + FastAPI Backend + MATLAB" -ForegroundColor Green
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
Write-Host "🚀 Starting Full-Stack Dashboard..." -ForegroundColor Magenta
Write-Host ""
Write-Host "Services that will be started:" -ForegroundColor White
Write-Host "  🔧 FastAPI Backend Server (Port 8000)" -ForegroundColor Yellow
Write-Host "  ⚛️  React Frontend Server (Port 3000)" -ForegroundColor Yellow
Write-Host ""
Write-Host "URLs:" -ForegroundColor White
Write-Host "  📱 React Dashboard: http://localhost:3000" -ForegroundColor Green
Write-Host "  🔌 API Documentation: http://localhost:8000/api/docs" -ForegroundColor Green
Write-Host ""
Write-Host "🌾 Features Available:" -ForegroundColor White
Write-Host "   • Modern React TypeScript interface" -ForegroundColor Cyan
Write-Host "   • Real-time WebSocket data streaming" -ForegroundColor Cyan
Write-Host "   • MATLAB-powered AI analysis" -ForegroundColor Cyan
Write-Host "   • Advanced sensor data visualization" -ForegroundColor Cyan
Write-Host "   • Professional Material-UI components" -ForegroundColor Cyan
Write-Host "   • Intelligent alert system" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚡ Starting servers... Press Ctrl+C to stop both services" -ForegroundColor Red
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Start FastAPI backend in background
Write-Host "🔧 Starting FastAPI Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "cd 'F:\SIH 2025\SIH-2025'; ..\..venv\Scripts\Activate.ps1; `$env:PATH = 'F:\\MATLAB\\bin;' + `$env:PATH; uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start React frontend
Write-Host "⚛️  Starting React Frontend Server..." -ForegroundColor Cyan
Set-Location "F:\SIH 2025\SIH-2025\frontend-react"
npm start

Write-Host ""
Write-Host "Services have been stopped." -ForegroundColor Yellow
Write-Host "Thank you for using SIH 2025 Full-Stack Agricultural Dashboard!" -ForegroundColor Green
pause