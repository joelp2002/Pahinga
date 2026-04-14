@echo off
echo Setting up portable MongoDB...
echo.

REM Create data directory
if not exist "mongodb-data" mkdir mongodb-data

REM Download MongoDB binaries (you may need to download manually if this fails)
echo Please download MongoDB from: https://www.mongodb.com/try/download/community
echo Choose: Windows x64, MSI installer
echo.
echo After downloading, extract to a 'mongodb' folder in this directory
echo Then run: start-mongodb.bat
echo.
pause