from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import PointStruct
from typing import List, Dict, Optional
from app.core.config import settings
import uuid
from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np


class QdrantStorage:
    def __init__(self):
        # Initialize Qdrant client
        if settings.qdrant_api_key:
            self.client = QdrantClient(
                url=settings.qdrant_host,
                api_key=settings.qdrant_api_key,
            )
        else:
            # For local Qdrant or cloud without API key
            self.client = QdrantClient(url=settings.qdrant_host)

        # Initialize embeddings model (using a free open-source model)
        self.model_name = "sentence-transformers/all-MiniLM-L6-v2"

        try:
            # Try to load the model with cache, failing gracefully if network is not available
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, local_files_only=False)
            self.model = AutoModel.from_pretrained(self.model_name, local_files_only=False)
        except OSError:
            # If the model is not downloaded yet and no internet is available, try to load from cache
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, local_files_only=True)
                self.model = AutoModel.from_pretrained(self.model_name, local_files_only=True)
                print("Loaded model from local cache.")
            except OSError:
                # If all else fails, we need to handle this gracefully
                print("ERROR: Embedding model could not be loaded. Please ensure internet connection and run 'python -c \"from transformers import AutoTokenizer, AutoModel; AutoTokenizer.from_pretrained(\\'sentence-transformers/all-MiniLM-L6-v2\\'); AutoModel.from_pretrained(\\'sentence-transformers/all-MiniLM-L6-v2\\')\"' first.")
                raise

        # Collection name from settings
        self.collection_name = settings.collection_name

    def get_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for the given text using a free open-source model
        """
        # Tokenize the input text
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)

        # Get the model outputs
        with torch.no_grad():
            outputs = self.model(**inputs)

        # Get the embeddings from the mean of the last hidden states
        embeddings = outputs.last_hidden_state.mean(dim=1).numpy()

        # Convert to list and return
        return embeddings[0].tolist()

    def create_collection(self):
        """
        Create a Qdrant collection for document storage
        """
        # Check if collection exists
        collections = self.client.get_collections()
        collection_names = [col.name for col in collections.collections]

        if self.collection_name not in collection_names:
            # Use the size of embeddings from the chosen model (all-MiniLM-L6-v2 produces 384-dimensional vectors)
            embedding_size = 384

            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=embedding_size,
                    distance=models.Distance.COSINE
                )
            )
            print(f"Created collection: {self.collection_name} with vector size: {embedding_size}")
        else:
            print(f"Collection {self.collection_name} already exists")

    def store_documents(self, documents: List[Dict]):
        """
        Store documents in Qdrant
        """
        points = []
        for i, doc in enumerate(documents):
            # Generate embedding for the content
            embedding = self.get_embedding(doc['content'])

            # Create a unique ID for the point
            point_id = str(uuid.uuid4())

            # Create the point structure
            point = PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "content": doc['content'],
                    "metadata": doc['metadata'],
                    "source": doc['source']
                }
            )

            points.append(point)

            # Batch insert every 100 points or when at the end
            if len(points) >= 100 or i == len(documents) - 1:
                self.client.upsert(
                    collection_name=self.collection_name,
                    points=points
                )
                print(f"Stored {len(points)} documents in Qdrant")
                points = []  # Reset points list

    def search_documents(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Search for documents similar to the query
        """
        # Generate embedding for the query
        query_embedding = self.get_embedding(query)

        # Search in Qdrant using the new query_points method
        search_results = self.client.query_points(
            collection_name=self.collection_name,
            query=query_embedding,
            limit=top_k
        ).points

        results = []
        for result in search_results:
            results.append({
                "content": result.payload["content"],
                "metadata": result.payload["metadata"],
                "source": result.payload["source"],
                "score": result.score
            })

        return results

    def delete_collection(self):
        """
        Delete the entire collection (use carefully)
        """
        try:
            self.client.delete_collection(self.collection_name)
            print(f"Deleted collection: {self.collection_name}")
        except Exception as e:
            print(f"Error deleting collection: {e}")


# Global instance of QdrantStorage
qdrant_storage = QdrantStorage()