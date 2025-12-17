from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    neon_database_url: str

    # Qdrant
    qdrant_host: str
    qdrant_api_key: Optional[str] = None
    collection_name: str = "docusaurus_docs"

    # OpenAI API (for embeddings and chat)
    openai_api_key: str
    model_name: str = "gpt-3.5-turbo"  # Default OpenAI model name

    class Config:
        env_file = ".env"


settings = Settings()