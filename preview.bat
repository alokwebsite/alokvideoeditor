@echo off
title Alok Video Editor - Local Live Preview
echo =======================================================
echo   ALOK VIDEO EDITOR - PORTFOLIO LOCAL PREVIEW
echo =======================================================
echo.
echo Launching your portfolio in your browser with full inline
echo video playback enabled:
echo http://localhost:5500/portfolio.html
echo.
echo Press Ctrl+C in this terminal window anytime to stop.
echo =======================================================
echo.

start "" "http://localhost:5500/portfolio.html"
python -m http.server 5500

pause
