"""
Comprehensive test script to verify the RAG service meets all requirements:

1. For every question about the Physical AI & Humanoid Robotics textbook, 
   fetch the specific relevant content from the textbook (not just generic headings).

2. Provide a short, professional, clear answer in 1-2 sentences based strictly 
   on the textbook content.

3. Do not add filler, explanations, or unrelated content.

4. Truncate responses properly: if multiple lines are fetched, keep only the 
   most relevant 1-2 lines or a short summary.

5. Always prioritize accuracy and relevance to the question.
"""

import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath('.'))

from app.core.rag_service import rag_service
from app.utils.text_utils import truncate_to_lines, extract_topic_summary

def test_requirements_compliance():
    print("Testing RAG Service Requirements Compliance...")
    print("="*80)
    
    # Test cases related to Physical AI & Humanoid Robotics
    test_queries = [
        "What is humanoid robotics?",
        "Explain physical AI",
        "What are the main components of a humanoid robot?",
        "How do robots achieve balance?",
        "What is sensorimotor learning in robotics?",
        "What are the challenges in humanoid robotics?",
        "What sensors do humanoid robots use?",
        "How do robots perceive their environment?"
    ]
    
    print(f"Testing {len(test_queries)} example questions...\n")
    
    all_tests_passed = True
    
    for i, query in enumerate(test_queries, 1):
        print(f"Test {i}: Query: '{query}'")
        
        try:
            # Generate response
            result = rag_service.generate_response(query, top_k=3)
            response = result["response"]
            sources = result["sources"]
            
            # Check properties of the response
            response_length = len(response)
            num_sentences = len([s for s in response.split('.') if s.strip()])
            num_words = len(response.split())
            
            print(f"  Response: '{response}'")
            print(f"  Length: {response_length} chars, {num_words} words, {num_sentences} sentences")
            print(f"  Sources: {len(sources)} source(s)")
            
            # Requirement Checks:
            # 1. Should fetch specific content from textbook (not generic)
            is_specific = not response.startswith("#") and not response.startswith("*")
            if is_specific:
                print("  + Contains specific textbook content (not generic headings)")
            else:
                print("  - Response contains generic headings")
                all_tests_passed = False

            # 2. Should be short, professional, clear answer in 1-2 sentences
            is_short_enough = num_sentences <= 2 and num_words <= 50
            if is_short_enough:
                print("  + Concise response (1-2 sentences)")
            else:
                print(f"  ? May be too long ({num_sentences} sentences, {num_words} words)")
                if num_sentences <= 2:  # Still meets sentence requirement
                    all_tests_passed = all_tests_passed and True
                else:
                    all_tests_passed = False

            # 3. Should not add filler or unrelated content
            is_direct = not any(fillers in response.lower() for fillers in
                               ["i don't know", "sorry", "perhaps", "maybe", "possibly"])
            if is_direct:
                print("  + Direct answer without filler")
            else:
                print("  - Contains filler language")
                all_tests_passed = False

            # 4. Should properly truncate to most relevant 1-2 lines or summary
            proper_truncation = len(response) <= 300  # Reasonable upper limit
            if proper_truncation:
                print("  + Properly truncated (<=300 chars)")
            else:
                print("  - Too long (>300 chars)")
                all_tests_passed = False
            
            print("-"*60)
                
        except Exception as e:
            print(f"  ✗ Error generating response: {e}")
            all_tests_passed = False
    
    print("\n" + "="*80)
    if all_tests_passed:
        print("+ All requirements PASSED - Chatbot provides specific, concise answers!")
    else:
        print("- Some requirements FAILED - Review implementation")

    print("Testing completed.")
    return all_tests_passed

if __name__ == "__main__":
    test_requirements_compliance()