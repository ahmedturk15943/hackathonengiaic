"""
Comprehensive test for the RAG chatbot with 20 textbook-related questions
"""
import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath('.'))

from app.core.rag_service import rag_service

def run_comprehensive_test():
    """Test the system with 20 random textbook-related questions"""
    
    test_questions = [
        "What is Physical AI?",
        "Define humanoid robotics",
        "What are the main components of a humanoid robot?",
        "How do robots achieve balance?",
        "What is sensorimotor learning in robotics?",
        "Explain manipulation in robotics",
        "What is locomotion in robotics?",
        "How do robots navigate uneven terrain?",
        "What is Computer Vision for Robotics?",
        "What are the challenges of humanoid robotics?",
        "Explain dexterity in robotics",
        "How do robots interact with humans?",
        "What is the future of Physical AI?",
        "Explain anthropomorphic design",
        "What are biomimetic systems?",
        "How do robots achieve energy efficiency?",
        "What is the role of machine learning in robotics?",
        "Explain control systems in robotics",
        "What are tactile sensors in robotics?",
        "How do robots handle disturbance rejection?"
    ]
    
    print("=" * 80)
    print("COMPREHENSIVE RAG CHATBOT TEST")
    print(f"Testing {len(test_questions)} textbook-related questions")
    print("=" * 80)
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n{i:2d}. Question: {question}")
        
        # Generate response
        result = rag_service.generate_response(question, top_k=3)
        response = result["response"]
        sources = result["sources"]
        
        print(f"    Response: {response}")
        
        # Analyze response
        sentences = [s.strip() for s in response.split('.') if s.strip() and len(s.strip()) > 5]
        num_sentences = len(sentences)
        num_chars = len(response)
        
        print(f"    Analysis: {num_sentences} sentences, {num_chars} chars")
        
        # Check for source reference
        has_source_ref = "[Source:" in response
        print(f"    Source ref: {'[PASS]' if has_source_ref else '[FAIL]'}")

        # Check conciseness
        is_concise = num_sentences <= 4 and num_chars <= 400
        print(f"    Conciseness: {'[PASS]' if is_concise else '[FAIL]'}")
        
        # Show sources
        if sources:
            print(f"    Sources found: {len(sources)} source(s)")
        else:
            print(f"    Sources found: 0 source(s)")
    
    print("\n" + "=" * 80)
    print("TEST SUMMARY:")
    print("- All responses should be from textbook content only")
    print("- Responses should be concise (1-4 sentences)")
    print("- Responses should include source references")
    print("- Responses should be professional and accurate")
    print("=" * 80)

if __name__ == "__main__":
    run_comprehensive_test()