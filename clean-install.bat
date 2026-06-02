@echo off
cd /d "%~dp0.."
echo Removing old node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f package-lock.json
echo Installing fresh dependencies...
call "%ProgramFiles%\nodejs\npm.cmd" install
if errorlevel 1 (
  echo.
  echo Install failed. Try: npm.cmd install --legacy-peer-deps
  exit /b 1
)
echo.
echo Success! Next steps:
echo   1. copy .env.example .env
echo   2. npm run db:push
echo   3. npm run db:seed
echo   4. npm run dev
pause
