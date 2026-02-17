#!/bin/bash

echo "================================"
echo "DTMS Mobile App Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  Please update the API_URL in .env file:"
    echo "   - Android Emulator: http://10.0.2.2:8000"
    echo "   - iOS Simulator: http://localhost:8000"
    echo "   - Physical Device: http://YOUR_COMPUTER_IP:8000"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "To start the app:"
echo "  npm start"
echo ""
echo "To run on Android:"
echo "  npm run android"
echo ""
echo "To run on iOS:"
echo "  npm run ios"
echo ""
