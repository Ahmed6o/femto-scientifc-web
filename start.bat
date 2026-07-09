@echo off
echo ===================================
echo   FEMTO-SCIENTIFIC CLONE LAUNCHER
echo ===================================
echo.

:: Add portable Node.js to PATH
set PATH=d:\work\Website\node-v20.18.3-win-x64;%PATH%
cd /d "d:\work\Website\femto-clone"

echo Starting development server...
echo The website will open at: http://localhost:3000
echo Press Ctrl+C to stop the server.
echo.
npm run dev
