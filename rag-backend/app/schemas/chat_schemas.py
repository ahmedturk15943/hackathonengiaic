from pydantic import BaseModel
from typing import List, Optional


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    top_k: Optional[int] = 5


class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    sources: List[dict]


class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ConversationHistory(BaseModel):
    conversation_id: str
    messages: List[Message]


class DocumentChunk(BaseModel):
    content: str
    metadata: dict
    source: str


class LoadDocumentsResponse(BaseModel):
    message: str
    documents_loaded: int