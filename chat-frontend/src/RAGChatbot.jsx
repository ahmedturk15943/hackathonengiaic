import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Main Chat Component
const RAGChatbot = ({ backendUrl = 'http://localhost:8000/api/v1' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send request to backend
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversation_id: conversationId,
          top_k: 5,
          ...(selectedDoc && { context: selectedDoc })
        })
      });

      const data = await response.json();

      // Update conversation ID if new conversation
      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      // Add assistant response to chat
      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        sources: data.sources || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rag-chatbot">
      <div className="chat-header">
        <h3>Physical AI & Humanoid Robotics Assistant</h3>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <p>Hello! I'm your Physical AI & Humanoid Robotics assistant.</p>
            <p>Ask me anything about the textbook content.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-content">
                {msg.content}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="sources">
                    <details>
                      <summary>Sources</summary>
                      <ul>
                        {msg.sources.map((source, idx) => (
                          <li key={idx}>{source.filename || source.title || 'Source'}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Physical AI & Humanoid Robotics..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .rag-chatbot {
          display: flex;
          flex-direction: column;
          height: 500px;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }
        
        .chat-header {
          background-color: #f0f8ff;
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        
        .chat-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 16px;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background-color: #fafafa;
        }
        
        .welcome-message {
          text-align: center;
          color: #7f8c8d;
          padding: 20px 0;
        }
        
        .message {
          margin-bottom: 16px;
          max-width: 80%;
        }
        
        .user {
          margin-left: auto;
        }
        
        .assistant {
          margin-right: auto;
        }
        
        .message-content {
          padding: 10px 14px;
          border-radius: 18px;
          line-height: 1.4;
        }
        
        .user .message-content {
          background-color: #3498db;
          color: white;
        }
        
        .assistant .message-content {
          background-color: white;
          border: 1px solid #e0e0e0;
        }
        
        .sources {
          margin-top: 8px;
          font-size: 0.85em;
        }
        
        .sources summary {
          cursor: pointer;
          color: #3498db;
        }
        
        .sources ul {
          margin: 5px 0 0 0;
          padding-left: 20px;
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #7f8c8d;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        
        .chat-input-form {
          padding: 12px;
          border-top: 1px solid #ddd;
          background-color: white;
        }
        
        .input-row {
          display: flex;
          gap: 8px;
        }
        
        input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 18px;
          font-size: 14px;
        }
        
        button {
          padding: 10px 16px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 18px;
          cursor: pointer;
          font-size: 14px;
        }
        
        button:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

// For standalone usage (if needed)
const App = () => {
  return (
    <div className="app-container">
      <RAGChatbot backendUrl="http://localhost:8000/api/v1" />
    </div>
  );
};

// Export the component for embedding
export { RAGChatbot };

// For standalone usage (uncomment if needed for development)
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);