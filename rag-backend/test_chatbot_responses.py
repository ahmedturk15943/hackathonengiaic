"""
Simple test script to verify the RAG service provides specific, concise answers
based on the textbook content.
"""

import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath('.'))

from app.core.rag_service import rag_service
from app.utils.text_utils import truncate_to_lines, extract_topic_summary

def test_rag_responses():
    print("Testing RAG Service Response Generation...")
    
    # Test cases related to Physical AI & Humanoid Robotics
    test_queries = [
        "What is humanoid robotics?",
        "Explain physical AI",
        "What are the main components of a humanoid robot?",
        "How do robots achieve balance?",
        "What is sensorimotor learning in robotics?"
    ]
    
    print("\n" + "="*60)
    
    for i, query in enumerate(test_queries, 1):
        print(f"\nTest {i}: Query: '{query}'")
        
        try:
            # Generate response
            result = rag_service.generate_response(query, top_k=3)
            response = result["response"]
            sources = result["sources"]
            
            # Check properties of the response
            response_length = len(response)

            # More accurate sentence counting - only count sentences that end with a period and have substantial content
            potential_sentences = response.split('.')
            # Count only sentences that have more than 5 words and aren't just abbreviations
            meaningful_sentences = []
            for s in potential_sentences:
                s_stripped = s.strip()
                if s_stripped and len(s_stripped.split()) > 5:  # Only count meaningful content
                    meaningful_sentences.append(s_stripped)

            num_sentences = len(meaningful_sentences)
            num_words = len(response.split())

            print(f"  Response: '{response}'")
            print(f"  Length: {response_length} chars, {num_words} words, {num_sentences} meaningful sentences")
            print(f"  Sources: {len(sources)} source(s)")

            # Verification checks
            if response_length > 300:
                print("  Warning: Response may be too long (>300 chars)")
            elif num_words < 10:
                print("  Warning: Response may be too short (<10 words)")
            elif num_sentences > 2:
                print("  Warning: Response may contain >2 sentences")
            else:
                print("  Response appears appropriately concise")

        except Exception as e:
            print(f"  Error generating response: {e}")
    
    print("\n" + "="*60)
    print("Testing completed.")

if __name__ == "__main__":
    test_rag_responses()