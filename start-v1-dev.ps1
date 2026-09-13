$ErrorActionPreference = "Stop"

# Force current directory to the script's directory to avoid path issues
Set-Location $PSScriptRoot

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "             NANI SYSTEMS V1 LAUNCHER              " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    cmd.exe /c "npm install"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies." -ForegroundColor Red
        Read-Host "Press Enter to exit..."
        exit 1
    }
}

# 2. Check if port 3000 is occupied
$portInUse = $false
try {
    $connection = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
    if ($connection) {
        $portInUse = $true
    }
} catch { }

if ($portInUse) {
    Write-Host "[INFO] A service is already running on port 3000." -ForegroundColor Yellow
    Write-Host "[INFO] Assuming Next.js dev server is already active." -ForegroundColor Green
    Write-Host "[INFO] The local URL is: http://localhost:3000" -ForegroundColor Green
    Write-Host "[INFO] Opening browser..." -ForegroundColor Green
    Start-Process "http://localhost:3000"
    Write-Host ""
    Read-Host "Press Enter to exit the launcher (this will leave the existing server running)..."
    exit 0
}

Write-Host "[INFO] Starting local PostgreSQL database..." -ForegroundColor Yellow
cmd.exe /c "start_pg.bat"

Write-Host "[INFO] Starting Next.js dev server..." -ForegroundColor Yellow
Write-Host "[INFO] The local URL will be: http://localhost:3000" -ForegroundColor Green
Write-Host "[INFO] Press Ctrl+C at any time to stop the server." -ForegroundColor Cyan
Write-Host ""

# 3. Start a background job to poll and open the browser
$browserJob = Start-Job {
    $serverReady = $false
    $maxRetries = 30
    $retryCount = 0

    while (!$serverReady -and $retryCount -lt $maxRetries) {
        Start-Sleep -Seconds 1
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $serverReady = $true
            }
        } catch { }
        $retryCount++
    }

    if ($serverReady) {
        Start-Process "http://localhost:3000"
    }
}

# 4. Run the server in the foreground so the user sees all logs
try {
    cmd.exe /c "npm run dev"
} catch {
    Write-Host "[ERROR] Server crashed or failed to start: $_" -ForegroundColor Red
} finally {
    # Clean up the background job when the server exits
    Stop-Job $browserJob -ErrorAction SilentlyContinue
    Remove-Job $browserJob -ErrorAction SilentlyContinue
    
    Write-Host "[INFO] Stopping local PostgreSQL database..." -ForegroundColor Yellow
    cmd.exe /c "stop_pg.bat"
}

Write-Host ""
Write-Host "[INFO] Server stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit..."
