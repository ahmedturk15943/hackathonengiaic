@echo off
echo Starting Physical AI & Humanoid Robotics RAG Chatbot API...

REM Check if .env file exists
if not exist .env (
    echo Error: .env file not found. Please copy .env.example to .env and update with your credentials.
    pause
    exit /b 1
)

REM Start the FastAPI application
echo Starting uvicorn server...
uvicorn main:app --host 0.0.0.0 --port 8000 --reload