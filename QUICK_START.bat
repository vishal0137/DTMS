@echo off
echo ========================================
echo DTMS Platform - Quick Start
echo ========================================
echo.

echo IMPORTANT: Before running this script:
echo 1. Install PostgreSQL and create database: dtms_db
echo 2. Update web/backend/.env with your database credentials
echo.
pause

echo.
echo Starting Backend Server...
echo.
start "DTMS Backend" cmd /k "cd web\backend && venv\Scripts\activate && python seed_data.py && uvicorn main:app --reload"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak

echo.
echo Starting Frontend Server...
echo.
start "DTMS Frontend" cmd /k "cd web\frontend && npm run dev"

echo.
echo ========================================
echo Servers Starting!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:5173
echo.
echo Login: admin@smartdtc.com / admin123
echo.
echo Press any key to exit this window...
pause
