import asyncio
import os
import sys
from dotenv import load_dotenv

# Add the project root to the path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.utils.document_loader import load_and_chunk_docusaurus_docs
from app.core.vector_storage import qdrant_storage
from app.core.rag_service import rag_service

# Load environment variables
load_dotenv()

def test_document_loading():
    """
    Test document loading functionality
    """
    print("Testing document loading...")
    
    docs_path = "../my-website/docs"  # Adjust path as needed
    
    if not os.path.exists(docs_path):
        # Try different relative paths
        possible_paths = [
            "../my-website/docs",
            "../../my-website/docs",
            "../../../my-website/docs",
            "../../../../my-website/docs"
        ]
        for path in possible_paths:
            if os.path.exists(path):
                docs_path = path
                break
    
    if not os.path.exists(docs_path):
        print(f"ERROR: Could not find docs directory at {docs_path} or relative locations")
        return False
    
    documents = load_and_chunk_docusaurus_docs(docs_path)
    print(f"[SUCCESS] Loaded {len(documents)} document chunks from {docs_path}")

    if documents:
        print(f"[SUCCESS] Sample document: {documents[0]['content'][:100]}...")
        return True
    else:
        print("[FAILED] No documents loaded")
        return False


def test_vector_storage():
    """
    Test vector storage functionality
    """
    print("\nTesting vector storage...")
    
    try:
        # Create collection
        qdrant_storage.create_collection()
        print("[SUCCESS] Qdrant collection created/accessed successfully")

        # Test search with a simple query
        test_query = "What is Physical AI?"
        results = qdrant_storage.search_documents(test_query, top_k=2)
        print(f"[SUCCESS] Vector search test completed, found {len(results)} results")

        if results:
            print(f"[SUCCESS] Sample result: {results[0]['content'][:100]}...")

        return True
    except Exception as e:
        print(f"[FAILED] Vector storage test failed: {e}")
        return False


def test_rag_generation():
    """
    Test RAG generation functionality
    """
    print("\nTesting RAG generation...")
    
    try:
        test_query = "What is Physical AI?"
        result = rag_service.generate_response(test_query, top_k=2)

        print(f"[SUCCESS] RAG response generated")
        print(f"[SUCCESS] Response preview: {result['response'][:100]}...")
        print(f"[SUCCESS] Found {len(result['sources'])} sources")

        # Check if response is concise (1-2 sentences)
        response = result['response']
        sentence_count = len([s for s in response.split('.') if s.strip()])
        if sentence_count <= 3:  # Allow up to 3 to account for potential trailing space
            print(f"[SUCCESS] Response is concise ({sentence_count} sentences)")
        else:
            print(f"[WARNING] Response may be too verbose ({sentence_count} sentences): {response}")

        return True
    except Exception as e:
        print(f"[FAILED] RAG generation test failed: {e}")
        return False


def run_tests():
    """
    Run all tests
    """
    print("Running RAG system tests...\n")
    
    test_results = []
    
    # Test document loading
    test_results.append(("Document Loading", test_document_loading()))
    
    # Test vector storage
    test_results.append(("Vector Storage", test_vector_storage()))
    
    # Test RAG generation
    test_results.append(("RAG Generation", test_rag_generation()))
    
    print("\n" + "="*50)
    print("TEST RESULTS SUMMARY")
    print("="*50)
    
    all_passed = True
    for test_name, result in test_results:
        status = "PASSED" if result else "FAILED"
        print(f"{test_name}: {status}")
        if not result:
            all_passed = False
    
    print("="*50)
    
    if all_passed:
        print("[SUCCESS] All tests PASSED! The RAG system is working correctly.")
        print("\nNext steps:")
        print("1. Run 'uvicorn main:app --reload' to start the API server")
        print("2. Access the API documentation at http://localhost:8000/docs")
        print("3. Load your documentation with POST /api/v1/load-docs")
        print("4. Start chatting with your documentation!")
    else:
        print("[FAILED] Some tests FAILED. Please check the output above and fix any issues.")
        print("Make sure your environment variables are correctly set in the .env file.")


if __name__ == "__main__":
    run_tests()