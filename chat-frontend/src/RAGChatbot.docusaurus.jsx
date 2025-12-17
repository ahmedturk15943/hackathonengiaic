import React from 'react';

// Simple chatbot component for Docusaurus that uses fetch API
const RAGChatbot = ({ backendUrl = 'http://localhost:8000/api/v1' }) => {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [conversationId, setConversationId] = React.useState(null);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversation_id: conversationId,
          top_k: 5
        })
      });

      const data = await response.json();

      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

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

  // CSS styles using the style prop
  const styles = {
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '500px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      margin: '20px 0'
    },
    chatHeader: {
      backgroundColor: '#f0f8ff',
      padding: '12px',
      borderBottom: '1px solid #ddd'
    },
    headerText: {
      margin: 0,
      color: '#2c3e50',
      fontSize: '16px'
    },
    chatMessages: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      backgroundColor: '#fafafa'
    },
    welcomeMessage: {
      textAlign: 'center',
      color: '#7f8c8d',
      padding: '20px 0'
    },
    message: {
      marginBottom: '16px',
      maxWidth: '80%'
    },
    userMessage: {
      marginLeft: 'auto',
      backgroundColor: '#3498db',
      color: 'white',
      padding: '10px 14px',
      borderRadius: '18px',
      lineHeight: '1.4'
    },
    assistantMessage: {
      marginRight: 'auto',
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      padding: '10px 14px',
      borderRadius: '18px',
      lineHeight: '1.4'
    },
    sources: {
      marginTop: '8px',
      fontSize: '0.85em'
    },
    sourcesSummary: {
      cursor: 'pointer',
      color: '#3498db'
    },
    sourcesList: {
      margin: '5px 0 0 0',
      paddingLeft: '20px'
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center'
    },
    typingDot: {
      height: '8px',
      width: '8px',
      backgroundColor: '#7f8c8d',
      borderRadius: '50%',
      display: 'inline-block',
      margin: '0 2px',
      animation: 'typing 1.4s infinite ease-in-out'
    },
    typingDot2: {
      height: '8px',
      width: '8px',
      backgroundColor: '#7f8c8d',
      borderRadius: '50%',
      display: 'inline-block',
      margin: '0 2px',
      animation: 'typing 1.4s infinite ease-in-out',
      animationDelay: '0.2s'
    },
    typingDot3: {
      height: '8px',
      width: '8px',
      backgroundColor: '#7f8c8d',
      borderRadius: '50%',
      display: 'inline-block',
      margin: '0 2px',
      animation: 'typing 1.4s infinite ease-in-out',
      animationDelay: '0.4s'
    },
    chatInputForm: {
      padding: '12px',
      borderTop: '1px solid #ddd',
      backgroundColor: 'white'
    },
    inputRow: {
      display: 'flex',
      gap: '8px'
    },
    input: {
      flex: 1,
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '18px',
      fontSize: '14px'
    },
    button: {
      padding: '10px 16px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '18px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    buttonDisabled: {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed'
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        <h3 style={styles.headerText}>Physical AI & Humanoid Robotics Assistant</h3>
      </div>
      
      <div style={styles.chatMessages}>
        {messages.length === 0 ? (
          <div style={styles.welcomeMessage}>
            <p>Hello! I'm your Physical AI & Humanoid Robotics assistant.</p>
            <p>Ask me anything about the textbook content.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} style={{...styles.message, ...(msg.role === 'user' ? { marginLeft: 'auto' } : { marginRight: 'auto' })}}>
                <div style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                  {msg.content}
                  {msg.sources && msg.sources.length > 0 && (
                    <div style={styles.sources}>
                      <details>
                        <summary style={styles.sourcesSummary}>Sources</summary>
                        <ul style={styles.sourcesList}>
                          {msg.sources.map((source, idx) => (
                            <li key={idx}>{source.filename || source.title || 'Source'}</li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={styles.message} style={{marginRight: 'auto'}}>
                <div style={styles.assistantMessage}>
                  <div style={styles.typingIndicator}>
                    <span style={styles.typingDot}></span>
                    <span style={styles.typingDot2}></span>
                    <span style={styles.typingDot3}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} style={styles.chatInputForm}>
        <div style={styles.inputRow}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Physical AI & Humanoid Robotics..."
            disabled={isLoading}
            style={styles.input}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={isLoading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default RAGChatbot;