import React from 'react';
import ReactDOM from 'react-dom/client';
import { RAGChatbot } from './RAGChatbot';

// For development/testing purposes
const App = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Physical AI & Humanoid Robotics Assistant</h1>
      <p>This is a standalone view of the chatbot component.</p>
      <RAGChatbot backendUrl="http://localhost:8000/api/v1" />
    </div>
  );
};

// Render the app if this is the main entry point
if (document.getElementById('root')) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
}

// Export for Docusaurus integration
export { RAGChatbot };