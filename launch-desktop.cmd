@echo off
title TUM Sovereign Agent IDE (Desktop)
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs"
echo [TUM Director] Building latest Sovereign Agent IDE bundle...
call npm run build
echo [TUM Director] Launching TUM Sovereign Agent IDE Native Windows Application...
start "" npx electron .
exit
