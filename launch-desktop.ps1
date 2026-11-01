# TUM Sovereign Agent IDE — Native Windows Application Launcher
Set-Location $PSScriptRoot
if ($env:Path -notmatch [regex]::Escape("C:\Program Files\nodejs")) {
    $env:Path += ";C:\Program Files\nodejs"
}
Write-Host "🚀 Launching TUM Sovereign Agent IDE (Native Desktop Application)..." -ForegroundColor Cyan
Start-Process "npx" -ArgumentList "electron ."
Write-Host "✓ Native Window launched!" -ForegroundColor Green
