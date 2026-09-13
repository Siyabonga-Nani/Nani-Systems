@echo off
TITLE Nani Systems V1 Launcher
COLOR 0B

:: Ensure we execute in the directory of the batch file
cd /d "%~dp0"

:: Check if PowerShell is available
where powershell >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PowerShell is not installed or not in your PATH.
    echo Please install PowerShell to use this launcher.
    pause
    exit /b 1
)

:: Run the PowerShell script
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "start-v1-dev.ps1"

:: If PowerShell crashes hard without pausing, we catch it here
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] The launcher encountered a fatal error.
    pause
)
