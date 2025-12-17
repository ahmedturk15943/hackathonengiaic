import asyncio
import os
import sys
from dotenv import load_dotenv

# Add the project root to the path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.utils.document_loader import load_and_chunk_docusaurus_docs
from app.core.vector_storage import qdrant_storage

# Load environment variables
load_dotenv()

def initialize_vector_db():
    """
    Initialize the vector database with Docusaurus documentation
    """
    print("Creating Qdrant collection...")
    qdrant_storage.create_collection()
    
    print("Loading documents from Docusaurus docs...")
    docs_path = "./my-website/docs"  # Adjust path as needed
    
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
        print(f"Error: Could not find docs directory at {docs_path} or relative locations")
        return
    
    documents = load_and_chunk_docusaurus_docs(docs_path)
    print(f"Loaded {len(documents)} document chunks from {docs_path}")
    
    print("Storing documents in Qdrant vector database...")
    qdrant_storage.store_documents(documents)
    
    print("Vector database initialization complete!")


if __name__ == "__main__":
    initialize_vector_db()