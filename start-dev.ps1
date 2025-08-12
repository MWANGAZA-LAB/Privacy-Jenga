# Privacy Jenga Development Startup Script
# This script starts both the server and client development servers

Write-Host "🚀 Starting Privacy Jenga Development Environment..." -ForegroundColor Green

# Start server in background
Write-Host "📡 Starting server on port 3001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Start client in background
Write-Host "🎮 Starting client on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

# Wait a moment for client to start
Start-Sleep -Seconds 3

Write-Host "✅ Development environment started!" -ForegroundColor Green
Write-Host "🌐 Client: http://localhost:5173/" -ForegroundColor Yellow
Write-Host "📡 Server: http://localhost:3001/" -ForegroundColor Yellow
Write-Host "Press any key to exit this script..." -ForegroundColor Gray

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
