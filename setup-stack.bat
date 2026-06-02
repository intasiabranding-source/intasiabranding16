@echo off
cd /d "%~dp0.."
echo === Digital Growth Ecosystem - Database Setup ===
echo.

call "%ProgramFiles%\nodejs\npm.cmd" run db:check
if errorlevel 1 exit /b 1

echo.
echo Pushing schema to database...
call "%ProgramFiles%\nodejs\npm.cmd" run db:push
if errorlevel 1 exit /b 1

echo.
echo Seeding data...
call "%ProgramFiles%\nodejs\npm.cmd" run db:seed
if errorlevel 1 exit /b 1

echo.
echo === Done! Start the app with: npm run dev ===
pause
