@echo off
title TUM Sovereign Agent IDE (Desktop)
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs"
echo Launching TUM Sovereign Agent IDE Native Windows Application...
start "" npx electron .
exit
