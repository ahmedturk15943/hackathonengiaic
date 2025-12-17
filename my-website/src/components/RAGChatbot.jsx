import React, { useState, useEffect, useRef } from 'react';

const RAGChatbot = ({ backendUrl = 'http://localhost:8000/api/v1' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversation_id: conversationId,
          top_k: 5
        }),
        // Include credentials if needed for authentication
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
        content: `Sorry, there was an error processing your request: ${error.message}. Please check that the backend is running.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chat panel visibility
  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };

  // CSS styles for the component
  const styles = {
    chatContainer: {
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      height: isExpanded ? '500px' : '50px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'height 0.3s ease',
      position: 'relative',
      backgroundColor: '#fff'
    },
    chatHeader: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '10px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    headerText: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 'bold'
    },
    expandButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
      padding: 0,
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    chatMessages: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      backgroundColor: '#fafafa',
      display: isExpanded ? 'block' : 'none'
    },
    welcomeMessage: {
      textAlign: 'center',
      color: '#7f8c8d',
      padding: '20px 0',
      fontStyle: 'italic'
    },
    message: {
      marginBottom: '16px',
      maxWidth: '85%',
    },
    userMessage: {
      marginLeft: 'auto',
      backgroundColor: '#3498db',
      color: 'white',
      padding: '10px 14px',
      borderRadius: '18px',
      lineHeight: '1.4',
      wordWrap: 'break-word'
    },
    assistantMessage: {
      marginRight: 'auto',
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      padding: '10px 14px',
      borderRadius: '18px',
      lineHeight: '1.4',
      wordWrap: 'break-word'
    },
    sources: {
      marginTop: '8px',
      fontSize: '0.8em',
      paddingTop: '5px',
      borderTop: '1px dashed #ccc'
    },
    sourcesSummary: {
      cursor: 'pointer',
      color: '#3498db',
      fontWeight: 'normal',
      fontSize: '0.9em'
    },
    sourcesList: {
      margin: '5px 0 0 0',
      paddingLeft: '15px',
      fontSize: '0.85em'
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center',
      padding: '5px 0'
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
    chatInputForm: {
      padding: '12px',
      borderTop: '1px solid #ddd',
      backgroundColor: 'white',
      display: isExpanded ? 'block' : 'none'
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
      fontSize: '14px',
      outline: 'none'
    },
    inputFocus: {
      border: '1px solid #3498db'
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
      <div style={styles.chatHeader} onClick={toggleChat}>
        <h3 style={styles.headerText}>🤖 Physical AI Assistant</h3>
        <button style={styles.expandButton} onClick={toggleChat}>
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div style={styles.chatMessages}>
            {messages.length === 0 ? (
              <div style={styles.welcomeMessage}>
                <p>Hello! I'm your Physical AI & Humanoid Robotics assistant.</p>
                <p>Ask me anything about the textbook content.</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div key={index} style={styles.message} className={`message ${msg.role}`}>
                    <div style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                      {msg.content}
                      {msg.sources && msg.sources.length > 0 && (
                        <div style={styles.sources}>
                          <details>
                            <summary style={styles.sourcesSummary}>Sources</summary>
                            <ul style={styles.sourcesList}>
                              {msg.sources.map((source, idx) => (
                                <li key={idx}>{source.filename || source.relative_path || source.title || 'Source'}</li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={styles.message} className="message assistant">
                    <div style={styles.assistantMessage}>
                      <div style={styles.typingIndicator}>
                        <span style={styles.typingDot}></span>
                        <span style={styles.typingDot}></span>
                        <span style={styles.typingDot}></span>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button 
                type="submit" 
                disabled={isLoading}
                style={isLoading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
          </form>
        </>
      )}
      
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        .message.user {
          align-self: flex-end;
        }
        .message.assistant {
          align-self: flex-start;
        }
      `}</style>
    </div>
  );
};

export default RAGChatbot;