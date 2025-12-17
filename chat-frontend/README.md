# RAG Chatbot Frontend

A React-based chat interface for the Physical AI & Humanoid Robotics RAG system.

## Overview

This is a standalone React application that provides a chat interface to interact with the RAG backend. It can be used as:
1. A standalone application
2. A component embedded in other applications
3. Integrated into Docusaurus documentation sites

## Features

- Real-time chat interface
- Conversation history
- Source citations for responses
- Responsive design
- Easy integration with Docusaurus

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Integration with Docusaurus

See the [INTEGRATION.md](./INTEGRATION.md) file for detailed instructions on how to integrate this component into your Docusaurus site.

## API Configuration

The component expects the backend API to be available at:
- Default: `http://localhost:8000/api/v1`
- Chat endpoint: `/chat`
- Documents endpoint: `/load-docs` (optional)

## Customization

You can customize the component by passing props:
- `backendUrl`: The URL of your RAG backend API