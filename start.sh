#!/bin/bash

# Optimizer App Startup Script
echo "🚀 Starting Optimizer App..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Display versions
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found."
    echo "   Create .env file with your SendGrid API key for email functionality."
    echo "   See STARTUP_GUIDE.md for details."
fi

# Start the development server
echo "🌐 Starting development server..."
echo "   App will be available at: http://localhost:3000"
echo "   Email test page: http://localhost:3000/email-test"
echo "   Press Ctrl+C to stop the server"
echo ""

npm start
