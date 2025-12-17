# Docusaurus Integration Guide

This guide explains how to integrate the RAG chatbot into your Docusaurus documentation site.

## Step 1: Copy Build Files

First, copy the built frontend files to your Docusaurus static directory:

```bash
cp -r chat-frontend/dist/* my-website/static/rag-chatbot/
```

## Step 2: Create a Docusaurus Component

Create a new file at `my-website/src/components/RAGChatbot.js`:

```javascript
import React from 'react';

const RAGChatbot = ({ backendUrl = 'http://localhost:8000/api/v1' }) => {
  return (
    <div className="rag-chatbot-container" style={{ marginTop: '2rem' }}>
      <iframe
        src="/rag-chatbot/index.html"
        width="100%"
        height="500px"
        frameBorder="0"
        title="Physical AI & Humanoid Robotics Assistant"
        style={{ borderRadius: '8px', border: '1px solid #ddd' }}
      />
    </div>
  );
};

export default RAGChatbot;
```

## Step 3: Use in Your Documentation

You can now use the chatbot component in any of your MDX files:

```mdx
import RAGChatbot from '@site/src/components/RAGChatbot';

# My Documentation Page

Here's some content about Physical AI...

<RAGChatbot backendUrl="https://your-production-backend.com/api/v1" />

Learn more about humanoid robotics...
```

## Alternative: Direct Component Integration

If you prefer a tighter integration without iframes, you can add the component directly to your Docusaurus site. First, install the required dependencies in your Docusaurus project:

```bash
cd my-website
npm install axios
```

Then copy the `RAGChatbot.docusaurus.jsx` file to your Docusaurus `src/components/` folder as `RAGChatbot.js` and use it in your MDX files:

```mdx
import RAGChatbot from '@site/src/components/RAGChatbot';

<RAGChatbot backendUrl="https://your-production-backend.com/api/v1" />
```

## Configuration

- `backendUrl`: Set this to your deployed RAG backend URL
- The chatbot works with the `/api/v1/chat` endpoint of your RAG backend

## Styling

The chatbot comes with its own styling but can be customized by adding CSS classes or modifying the React component styles.

## Notes

- Ensure CORS settings on your backend allow requests from your Docusaurus site
- For production use, make sure your backend URL is properly configured
- Consider adding loading states and error handling for better UX