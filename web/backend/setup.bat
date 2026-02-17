@echo off
echo ========================================
echo Smart DTC Backend Setup (Windows)
echo ========================================
echo.

echo Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error: Failed to create virtual environment
    pause
    exit /b 1
)

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Create PostgreSQL database: CREATE DATABASE smart_dtc_db;
echo 2. Copy .env.example to .env and configure DATABASE_URL
echo 3. Run: alembic upgrade head
echo 4. Run: python seed_data.py
echo 5. Start server: uvicorn main:app --reload
echo.
pause
