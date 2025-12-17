# Physical AI & Humanoid Robotics RAG Chatbot

This is a Retrieval-Augmented Generation (RAG) chatbot backend that connects to your Docusaurus documentation for the Physical AI & Humanoid Robotics textbook using FastAPI, Neon Serverless Postgres, and Qdrant Cloud.

## Features

- Semantic search through your Docusaurus documentation
- Conversational interface with memory
- Vector storage using Qdrant Cloud
- Persistent conversation history in Neon Postgres
- FastAPI-powered RESTful API with automatic documentation

## Prerequisites

Before getting started, you'll need:

1. **Neon Serverless PostgreSQL account**: Sign up at [neon.tech](https://neon.tech)
2. **Qdrant Cloud account**: Sign up at [qdrant.tech](https://qdrant.tech)
3. **OpenAI API key**: Get one from [platform.openai.com](https://platform.openai.com)

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rag-backend
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Then update the `.env` file with your actual values:

```env
# Neon Serverless Postgres
NEON_DATABASE_URL=your_neon_database_url_here

# Qdrant Cloud
QDRANT_HOST=your_qdrant_cloud_url_here
QDRANT_API_KEY=your_qdrant_api_key_here
COLLECTION_NAME=docusaurus_docs

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
MODEL_NAME=gpt-3.5-turbo  # or gpt-4
```

### 4. Initialize the Vector Database

To load your Docusaurus documentation into the vector database:

```bash
python initialize_db.py
```

This will:
- Create a collection in Qdrant called `docusaurus_docs`
- Load all markdown files from your Docusaurus `docs` directory
- Chunk the documents into manageable pieces
- Generate embeddings and store them in Qdrant

## Running the Application

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will be accessible at `http://localhost:8000`, with:
- Interactive API documentation at `http://localhost:8000/docs`
- Alternative documentation at `http://localhost:8000/redoc`

## API Endpoints

### Chat Endpoint

Send a message to the chatbot (with optional conversation ID):

```
POST /api/v1/chat
```

Request body:
```json
{
  "message": "What are the fundamentals of Physical AI?",
  "conversation_id": "optional_existing_conversation_id",
  "top_k": 5
}
```

Response:
```json
{
  "response": "The fundamentals of Physical AI involve...",
  "conversation_id": "new_or_existing_conversation_id",
  "sources": [
    {
      "filename": "intro.md",
      "relative_path": "intro.md",
      "chunk_index": 0,
      "total_chunks": 1
    }
  ]
}
```

### Get Conversation History

Retrieve the history of a specific conversation:

```
GET /api/v1/conversation/{conversation_id}
```

### Load Documentation

Manually reload documentation into the vector database:

```
POST /api/v1/load-docs
```

### Health Check

Check the service health:

```
GET /api/v1/health
```

## Testing the RAG System

Once the server is running, you can test the system in several ways:

1. Using the interactive API documentation at `/docs`
2. Or with curl:

```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Physical AI?",
    "top_k": 5
  }'
```

## Architecture

The application follows a standard FastAPI project structure:

```
rag-backend/
├── main.py                 # Main application entry point
├── requirements.txt        # Dependencies
├── .env.example           # Environment variable template
├── initialize_db.py       # Script to initialize vector database
├── app/
│   ├── routers/
│   │   └── chat.py       # API endpoints
│   ├── models/
│   │   └── chat_models.py # Database models
│   ├── schemas/
│   │   └── chat_schemas.py # Request/response models
│   ├── database/
│   │   └── database.py    # Database configuration
│   ├── core/
│   │   ├── config.py      # Settings and configuration
│   │   ├── rag_service.py # RAG logic
│   │   └── vector_storage.py # Qdrant integration
│   └── utils/
│       └── document_loader.py # Documentation loading utilities
```

## Customization

### Changing Model

You can change the language model by updating the `MODEL_NAME` in your environment variables to any OpenAI model of your choice.

### Adjusting Retrieval

Adjust the number of documents retrieved during RAG by changing the `top_k` parameter in your requests (defaults to 5).

## Troubleshooting

1. **Connection Issues**: Ensure your Neon and Qdrant credentials are correctly set in the `.env` file
2. **Document Loading Issues**: Make sure your Docusaurus docs directory is located at the correct path relative to the application
3. **API Errors**: Check that your OpenAI API key is valid and has sufficient credits

## Security Considerations

- Never commit your `.env` file to version control
- In production, use environment variables or a secret management system instead of `.env` files
- Implement rate limiting to prevent abuse of the API
- Add authentication middleware as needed for your use case

## Next Steps

1. Integrate with your frontend application
2. Add authentication and authorization
3. Implement rate limiting
4. Add monitoring and logging
5. Deploy to a cloud platform (AWS, GCP, Azure, etc.)