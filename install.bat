@echo off
cd /d "%~dp0.."
echo Installing dependencies...
call "%ProgramFiles%\nodejs\npm.cmd" install
if errorlevel 1 exit /b 1
echo Done. Copy .env.example to .env and configure DATABASE_URL before db:push.
