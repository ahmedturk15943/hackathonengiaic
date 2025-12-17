# from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
# from sqlalchemy.orm import Session
# from typing import Optional
# import uuid
# import asyncio

# from app.schemas.chat_schemas import ChatRequest, ChatResponse, LoadDocumentsResponse
# from app.database.database import get_db
# from app.models.chat_models import Conversation, Message as DBMessage
# from app.core.rag_service import rag_service
# from app.utils.document_loader import load_and_chunk_docusaurus_docs
# from app.core.vector_storage import qdrant_storage

# router = APIRouter()


# @router.post("/chat", response_model=ChatResponse)
# async def chat_endpoint(chat_request: ChatRequest, db: Session = Depends(get_db)):
#     """
#     Main chat endpoint that handles user queries and generates RAG responses
#     """
#     try:
#         # Get or create conversation
#         if chat_request.conversation_id:
#             conversation = db.query(Conversation).filter(
#                 Conversation.id == int(chat_request.conversation_id)
#             ).first()
#             if not conversation:
#                 raise HTTPException(status_code=404, detail="Conversation not found")
#         else:
#             # Create new conversation
#             conversation = Conversation(title=chat_request.message[:50] + "..." if len(chat_request.message) > 50 else chat_request.message)
#             db.add(conversation)
#             db.commit()
#             db.refresh(conversation)
        
#         # Save user message
#         user_message = DBMessage(
#             conversation_id=conversation.id,
#             role="user",
#             content=chat_request.message
#         )
#         db.add(user_message)
#         db.commit()
        
#         # Generate response using RAG service
#         rag_result = rag_service.generate_response(chat_request.message, chat_request.top_k)
        
#         # Save assistant message
#         assistant_message = DBMessage(
#             conversation_id=conversation.id,
#             role="assistant",
#             content=rag_result["response"]
#         )
#         db.add(assistant_message)
#         db.commit()
        
#         return ChatResponse(
#             response=rag_result["response"],
#             conversation_id=str(conversation.id),
#             sources=rag_result["sources"]
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")


# @router.get("/conversation/{conversation_id}")
# async def get_conversation_history(conversation_id: int, db: Session = Depends(get_db)):
#     """
#     Retrieve conversation history
#     """
#     conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
#     if not conversation:
#         raise HTTPException(status_code=404, detail="Conversation not found")
    
#     messages = db.query(DBMessage).filter(
#         DBMessage.conversation_id == conversation_id
#     ).order_by(DBMessage.timestamp).all()
    
#     return {
#         "conversation_id": conversation_id,
#         "title": conversation.title,
#         "created_at": conversation.created_at,
#         "updated_at": conversation.updated_at,
#         "messages": [
#             {
#                 "role": msg.role,
#                 "content": msg.content,
#                 "timestamp": msg.timestamp
#             } for msg in messages
#         ]
#     }


# @router.post("/load-docs", response_model=LoadDocumentsResponse)
# async def load_docs(background_tasks: BackgroundTasks):
#     """
#     Load documents from Docusaurus docs directory to vector storage
#     """
#     try:
#         # Create the Qdrant collection if it doesn't exist
#         qdrant_storage.create_collection()
        
#         # Load documents from Docusaurus docs directory
#         docs_path = "../../my-website/docs"  # Relative to the router location
#         documents = load_and_chunk_docusaurus_docs(docs_path)
        
#         if not documents:
#             raise HTTPException(status_code=404, detail="No documents found in the specified path")
        
#         # Store documents in Qdrant in the background to avoid timeout
#         background_tasks.add_task(qdrant_storage.store_documents, documents)
        
#         return LoadDocumentsResponse(
#             message=f"Started loading {len(documents)} document chunks to vector storage",
#             documents_loaded=len(documents)
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error loading documents: {str(e)}")


# @router.get("/health")
# async def health_check():
#     """
#     Health check endpoint
#     """
#     return {"status": "healthy", "service": "RAG Chatbot API"}











from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional

from app.schemas.chat_schemas import ChatRequest, ChatResponse, LoadDocumentsResponse
from app.database.database import get_db
from app.models.chat_models import Conversation, Message as DBMessage
from app.core.rag_service import rag_service
from app.utils.document_loader import load_and_chunk_docusaurus_docs
from app.core.vector_storage import qdrant_storage

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_request: ChatRequest, db: Session = Depends(get_db)):
    """
    Main chat endpoint that handles user queries and generates RAG responses
    """
    try:
        # Get or create conversation
        if chat_request.conversation_id:
            conversation = db.query(Conversation).filter(
                Conversation.id == int(chat_request.conversation_id)
            ).first()
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            # Create new conversation
            conversation = Conversation(
                title=chat_request.message[:50] + "..."
                if len(chat_request.message) > 50
                else chat_request.message
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # Save user message
        user_message = DBMessage(
            conversation_id=conversation.id,
            role="user",
            content=chat_request.message
        )
        db.add(user_message)
        db.commit()

        # Check if it's a greeting
        message_lower = chat_request.message.lower().strip()
        greeting_keywords = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"]

        if message_lower in greeting_keywords or any(keyword in message_lower for keyword in greeting_keywords):
            # Handle greetings with a short response
            response_text = "Hello! Ask me anything about the textbook."
            sources = []
        else:
            # Generate response using RAG for actual questions
            rag_result = rag_service.generate_response(chat_request.message, chat_request.top_k)
            response_text = rag_result["response"]
            sources = rag_result["sources"]

        # Store assistant message
        assistant_message = DBMessage(
            conversation_id=conversation.id,
            role="assistant",
            content=response_text
        )
        db.add(assistant_message)
        db.commit()

        return ChatResponse(
            response=response_text,
            conversation_id=str(conversation.id),
            sources=sources
        )

    except Exception as e:
        import traceback
        traceback.print_exc()     # ❗ FULL ERROR NOW PRINTS IN TERMINAL
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")
