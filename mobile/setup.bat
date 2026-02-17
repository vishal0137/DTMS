@echo off
echo ================================
echo DTMS Mobile App Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo √ Node.js version:
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X npm is not installed.
    pause
    exit /b 1
)

echo √ npm version:
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo √ Dependencies installed successfully
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo √ .env file created
    echo.
    echo ! Please update the API_URL in .env file:
    echo    - Android Emulator: http://10.0.2.2:8000
    echo    - iOS Simulator: http://localhost:8000
    echo    - Physical Device: http://YOUR_COMPUTER_IP:8000
) else (
    echo √ .env file already exists
)

echo.
echo ================================
echo √ Setup Complete!
echo ================================
echo.
echo To start the app:
echo   npm start
echo.
echo To run on Android:
echo   npm run android
echo.
echo To run on iOS:
echo   npm run ios
echo.
pause
