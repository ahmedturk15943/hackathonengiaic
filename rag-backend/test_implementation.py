"""
Test script to verify the chatbot rules implementation
"""
import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath('.'))

from app.core.rag_service import rag_service
from app.routers.chat import chat_endpoint
from app.schemas.chat_schemas import ChatRequest
from sqlalchemy.orm import sessionmaker
from app.database.database import get_db
from sqlalchemy import create_engine

def test_greeting():
    print("Testing greeting handling...")
    
    # Simulating a greeting request
    greeting_request = ChatRequest(message="hi", conversation_id=None, top_k=3)
    
    # Create a dummy DB session for testing
    engine = create_engine("sqlite:///rag_test.db")
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Call the chat endpoint directly
        result = chat_endpoint(greeting_request, db)
        print(f"Greeting response: '{result.response}'")
        
        if "Hello! Ask me anything about the textbook." in result.response:
            print("✓ Greeting correctly handled")
        else:
            print("✗ Greeting not handled correctly")
    except Exception as e:
        print(f"Error testing greeting: {e}")
    finally:
        db.close()

def test_question_answer():
    print("\nTesting question answering...")
    
    question_request = ChatRequest(message="What is Physical AI?", conversation_id=None, top_k=3)
    
    # Create a dummy DB session for testing
    engine = create_engine("sqlite:///rag_test.db")
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Call the chat endpoint directly
        result = chat_endpoint(question_request, db)
        print(f"Question response: '{result.response}'")
        print(f"Sources: {result.sources}")
        
        # Check if response has source information
        if "[Source:" in result.response:
            print("✓ Source information correctly included")
        else:
            print("✗ Source information missing")
    except Exception as e:
        print(f"Error testing question: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_greeting()
    test_question_answer()