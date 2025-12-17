"""
Test the specific issues mentioned by the user
"""
import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath('.'))

from app.core.rag_service import rag_service

def test_specific_issues():
    """Test the specific questions that were problematic"""
    
    # Test cases that were mentioned as problematic
    test_cases = [
        "what is physical ai",
        "what is humanoid robotics", 
        "whar is ai",  # Note: this has a typo but should still be handled
        "what is projects",
        "what is concept"
    ]
    
    print("Testing specific issues mentioned by the user:")
    print("="*70)
    
    for i, query in enumerate(test_cases, 1):
        print(f"\n{i}. Query: '{query}'")
        
        result = rag_service.generate_response(query, top_k=3)
        response = result["response"]
        sources = result["sources"]
        
        print(f"   Response: {response}")
        print(f"   Sources: {len(sources)} found")
        
        # Analyze response
        sentences = [s.strip() for s in response.split('.') if s.strip() and len(s.strip()) > 5]
        num_sentences = len(sentences)
        num_chars = len(response)
        
        print(f"   Analysis: {num_sentences} sentences, {num_chars} chars")
        
        # Check if response starts properly (not with fragments)
        starts_properly = not (response.lower().startswith('lation') or 
                              response.lower().startswith('plifies') or
                              response.lower().startswith('robot to'))
        print(f"   Starts properly: {'[PASS]' if starts_properly else '[FAIL]'}")
    
    print("\n" + "="*70)

if __name__ == "__main__":
    test_specific_issues()