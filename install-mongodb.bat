@echo off
echo Installing MongoDB Community Edition...
echo.

REM Download MongoDB
powershell -Command "& {Invoke-WebRequest -Uri 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.2-signed.msi' -OutFile 'mongodb-installer.msi'}"

REM Install MongoDB
msiexec /i mongodb-installer.msi /quiet /norestart ADDLOCAL="all"

REM Create data directory
if not exist "C:\data\db" mkdir "C:\data\db"

REM Add to PATH (requires restart)
setx PATH "%PATH%;C:\Program Files\MongoDB\Server\7.0\bin"

echo.
echo Installation complete! Please restart your computer.
echo Then run: mongod
echo.
pause