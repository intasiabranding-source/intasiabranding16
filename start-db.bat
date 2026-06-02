@echo off
cd /d "%~dp0.."
echo Starting PostgreSQL (Docker)...
docker compose up -d
if errorlevel 1 (
  echo.
  echo Docker failed. Make sure Docker Desktop is running, then try again.
  exit /b 1
)
echo.
echo Waiting for database to be ready...
timeout /t 5 /nobreak >nul
echo Database should be ready at localhost:5432
echo.
echo Next commands:
echo   copy .env.example .env
echo   npm run db:push
echo   npm run db:seed
echo   npm run dev
