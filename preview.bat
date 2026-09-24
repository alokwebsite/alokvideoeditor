@echo off
title Alok Video Editor - Local Live Preview
echo =======================================================
echo   ALOK VIDEO EDITOR - PORTFOLIO LOCAL PREVIEW
echo =======================================================
echo.
echo Launching your portfolio in your browser with clean URL:
echo http://localhost:5500/portfolio
echo.
echo Press Ctrl+C in this terminal window anytime to stop.
echo =======================================================
echo.

start "" "http://localhost:5500/portfolio"
python server.py

pause
