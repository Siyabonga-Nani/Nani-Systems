$ErrorActionPreference = 'SilentlyContinue'
while ($true) {
    try {
        $file = [System.IO.File]::Open("postgres.zip", 'Open', 'Read', 'None')
        $file.Close()
        break
    } catch {
        $size = (Get-Item postgres.zip).Length
        Write-Host "Locked. Size: $size"
        Start-Sleep -Seconds 5
    }
}
Write-Host "Done! Extracting..."
Expand-Archive postgres.zip -DestinationPath pg -Force
Write-Host "Extracted!"
