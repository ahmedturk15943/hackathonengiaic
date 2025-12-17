#!/bin/bash
# Startup script for the RAG Chatbot API

echo "Starting Physical AI & Humanoid Robotics RAG Chatbot API..."

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Warning: Virtual environment not activated. Please activate it first."
    echo "Run: source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows)"
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please copy .env.example to .env and update with your credentials."
    exit 1
fi

# Start the FastAPI application
echo "Starting uvicorn server..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload