import os
import re
from typing import List, Dict
from pathlib import Path
import frontmatter  # To handle markdown metadata


def clean_markdown_content(content: str) -> str:
    """
    Clean markdown content by removing metadata, code blocks, and other non-text elements
    """
    # Remove frontmatter if present
    content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
    
    # Remove markdown headers from text (we'll keep them as context)
    # Remove markdown links, code blocks, etc.
    content = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', content)  # Links
    content = re.sub(r'!\[.*?\]\(.*?\)', '', content)  # Images
    content = re.sub(r'```.*?\n.*?\n```', '', content, flags=re.DOTALL)  # Code blocks
    content = re.sub(r'`.*?`', '', content)  # Inline code
    
    # Clean up extra whitespace
    content = re.sub(r'\n\s*\n', '\n\n', content)
    
    return content.strip()


def load_docusaurus_docs(docs_path: str) -> List[Dict]:
    """
    Load all markdown documents from a Docusaurus docs directory
    """
    docs_data = []
    
    for root, dirs, files in os.walk(docs_path):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Extract metadata and clean content
                try:
                    post = frontmatter.loads(content)
                    doc_content = post.content
                    metadata = post.metadata
                except Exception:
                    # If frontmatter parsing fails, treat as plain markdown
                    doc_content = content
                    metadata = {}
                
                clean_content = clean_markdown_content(doc_content)
                
                # Only add if content is substantial
                if len(clean_content.strip()) > 20:
                    docs_data.append({
                        'source': file_path,
                        'content': clean_content,
                        'metadata': {
                            'filename': file,
                            'relative_path': os.path.relpath(file_path, docs_path),
                            **metadata
                        }
                    })
    
    return docs_data


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
    """
    Split text into overlapping chunks
    """
    if len(text) <= chunk_size:
        return [text]
        
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        
        # Find a good breaking point (sentence or paragraph boundary)
        if end < len(text):
            # Look for a period or newline near the end
            for i in range(min(end, len(text)) - 1, max(start, end - 200), -1):
                if text[i] in '.!? \n':
                    end = i + 1
                    break
        
        chunks.append(text[start:end])
        start = end - overlap
        
        # If the remaining text is shorter than chunk_size, add it as the last chunk
        if len(text) - start < chunk_size:
            if start < len(text):
                chunks.append(text[start:])
            break
    
    return chunks


def load_and_chunk_docusaurus_docs(docs_path: str) -> List[Dict]:
    """
    Load Docusaurus docs and split them into chunks for vector storage
    """
    docs = load_docusaurus_docs(docs_path)
    chunked_docs = []
    
    for doc in docs:
        content = doc['content']
        metadata = doc['metadata']
        source = doc['source']
        
        # Chunk the content
        chunks = chunk_text(content)
        
        for i, chunk in enumerate(chunks):
            chunk_metadata = {
                **metadata,
                'chunk_index': i,
                'total_chunks': len(chunks)
            }
            
            chunked_docs.append({
                'content': chunk,
                'metadata': chunk_metadata,
                'source': source
            })
    
    return chunked_docs


if __name__ == "__main__":
    # Test the loader with the actual docs path
    docs_path = "../../../my-website/docs"  # Relative to this script location
    if os.path.exists(docs_path):
        docs = load_and_chunk_docusaurus_docs(docs_path)
        print(f"Loaded {len(docs)} document chunks from {docs_path}")
        if docs:
            print(f"Sample chunk: {docs[0]['content'][:200]}...")
    else:
        print(f"Docs path {docs_path} does not exist")