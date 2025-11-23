#!/bin/bash

# PitchBridge Project Initialization Script
echo "🚀 Initializing PitchBridge Full-Stack Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "🎉 Project initialization complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables in backend/.env"
echo "2. Make sure MongoDB is running (local or cloud)"
echo "3. Run the development servers:"
echo ""
echo "   Backend:  cd backend && npm start"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "   Or run both: npm run dev (from root directory)"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "📚 Documentation: See README.md for more details"
echo ""
echo "Happy coding! 🎯"
