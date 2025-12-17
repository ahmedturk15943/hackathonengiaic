# Integrating RAG Chatbot in Docusaurus

This document explains how to integrate the RAG chatbot component into your Docusaurus website.

## Method 1: Using the Pre-built Component

1. Build the chatbot component:
```bash
cd chat-frontend
npm install
npm run build
```

2. Copy the built files to your Docusaurus static directory:
```bash
cp -r dist/* my-website/static/rag-chatbot/
```

3. Create a React component in your Docusaurus site at `src/components/RAGChatbot.js`:

```javascript
import React from 'react';

const RAGChatbot = ({ backendUrl = 'http://localhost:8000/api/v1' }) => {
  return (
    <div className="rag-chatbot-container">
      <iframe
        src="/rag-chatbot/index.html"
        width="100%"
        height="500px"
        frameBorder="0"
        title="Physical AI & Humanoid Robotics Assistant"
      />
    </div>
  );
};

export default RAGChatbot;
```

4. Use the component in your MDX files:

```mdx
import RAGChatbot from '@site/src/components/RAGChatbot';

# My Page

Some content here...

<RAGChatbot backendUrl="https://your-backend-url.com/api/v1" />

More content...
```

## Method 2: Direct React Integration

If your Docusaurus site allows custom React components:

1. Copy the `RAGChatbotComponent.docusaurus.jsx` file to your Docusaurus `src/components/` folder as `RAGChatbot.js`

2. Use directly in MDX:

```mdx
import RAGChatbot from '@site/src/components/RAGChatbot';

<RAGChatbot />
```

## Customization

You can customize the chatbot by passing props:

- `backendUrl`: The URL of your RAG backend API
- Additional props can be added as needed in the component

## Notes

- Ensure your backend API is accessible from where the Docusaurus site will be hosted
- For production, make sure to update the backend URL in the component
- Consider implementing proper error handling and loading states for network requests