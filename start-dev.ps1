# Privacy Jenga Development Server Starter
# PowerShell script to start both API and Web servers

Write-Host "🚀 Starting Privacy Jenga Development Servers..." -ForegroundColor Green
Write-Host ""

# Function to start a server
function Start-Server {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command
    )
    
    Write-Host "Starting $Name server..." -ForegroundColor Yellow
    
    # Start the server in a new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; $Command" -WindowStyle Normal
    
    Write-Host "$Name server started in new window" -ForegroundColor Green
    Write-Host ""
}

# Start API Server
Start-Server -Name "API" -Path "services/api" -Command "npm run dev"

# Wait a moment for API server to start
Start-Sleep -Seconds 3

# Start Web Client Server
Start-Server -Name "Web Client" -Path "apps/web" -Command "npm run dev"

Write-Host "✅ Both servers started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Web Client: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔌 API Server: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
