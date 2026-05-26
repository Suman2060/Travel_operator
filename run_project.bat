@echo off
title Chill Travel Project Launcher
color 0B
echo =======================================================================
echo          CHILL TRAVEL - FULL-STACK TOUR OPERATOR SYSTEM
echo =======================================================================
echo.

:: Check for Python
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Python is not installed or not in your system PATH!
    echo Please install Python (3.10+ recommended) and check "Add Python to PATH".
    pause
    exit /b
)
echo Python is installed.

:: Check for Node.js / NPM
echo [2/4] Checking Node.js / NPM installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js / NPM is not installed or not in your system PATH!
    echo Please install Node.js (LTS version recommended).
    pause
    exit /b
)
echo Node.js/NPM is installed.

echo.
echo =======================================================================
echo [3/4] SETTING UP DJANGO BACKEND...
echo =======================================================================
cd Backend

:: Create virtual environment if it doesn't exist
if not exist .venv (
    echo Creating Python Virtual Environment (.venv)...
    python -m venv .venv
)

:: Activate venv and install requirements
echo Activating Virtual Environment...
call .venv\Scripts\activate

echo Installing Python packages from requirements.txt...
pip install -r requirements.txt

echo Running Database Migrations...
python manage.py migrate

:: Launch Backend in a new window
echo Starting Django Backend Server in a new window...
start cmd /k "title Django Backend Server && color 0E && call .venv\Scripts\activate && python manage.py runserver"

cd ..
echo Backend is starting up on http://127.0.0.1:8000
echo.

echo =======================================================================
echo [4/4] SETTING UP REACT FRONTEND...
echo =======================================================================
cd Frontend\travel

:: Check if node_modules exists
if not exist node_modules (
    echo node_modules not found. Installing frontend dependencies (npm install)...
    call npm install
)

:: Launch Frontend in a new window
echo Starting Vite Frontend Server in a new window...
start cmd /k "title Vite Frontend Server && color 0D && npm run dev"

echo.
echo =======================================================================
echo                     PROJECT LAUNCH INITIATED!
echo =======================================================================
echo.
echo The Django Backend should be running on: http://127.0.0.1:8000
echo The React Frontend will be running on: http://localhost:5173 (default)
echo.
echo You can close this window now. The servers will keep running in their respective windows.
echo.
pause
