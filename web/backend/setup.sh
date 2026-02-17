#!/bin/bash

echo "========================================"
echo "Smart DTC Backend Setup (Linux/Mac)"
echo "========================================"
echo ""

echo "Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "Error: Failed to create virtual environment"
    exit 1
fi

echo ""
echo "Activating virtual environment..."
source venv/bin/activate

echo ""
echo "Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo ""
echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Create PostgreSQL database: CREATE DATABASE smart_dtc_db;"
echo "2. Copy .env.example to .env and configure DATABASE_URL"
echo "3. Run: alembic upgrade head"
echo "4. Run: python seed_data.py"
echo "5. Start server: uvicorn main:app --reload"
echo ""
