import React, { useEffect, useRef } from 'react';

// Load the chatbot component dynamically
const RAGChatbotComponent = () => {
  const chatbotRef = useRef(null);

  useEffect(() => {
    // Dynamically load React and the chatbot component
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/react@19/umd/react.production.min.js';
    script.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://unpkg.com/react-dom@19/umd/react-dom.production.min.js';
      script2.onload = () => {
        const script3 = document.createElement('script');
        script3.src = 'https://unpkg.com/axios/dist/axios.min.js';
        
        script3.onload = () => {
          // Create element and render the chatbot
          const root = ReactDOM.createRoot(chatbotRef.current);
          
          // Define the RAGChatbot component in global scope
          window.RAGChatbot = ({ backendUrl = 'http://localhost:8000/api/v1' }) => {
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
                const response = await axios.post(`${backendUrl}/chat`, {
                  message: input,
                  conversation_id: conversationId,
                  top_k: 5
                });

                if (response.data.conversation_id && !conversationId) {
                  setConversationId(response.data.conversation_id);
                }

                const assistantMessage = {
                  role: 'assistant',
                  content: response.data.response,
                  sources: response.data.sources || [],
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

            return React.createElement(
              'div',
              { className: 'rag-chatbot', style: { 
                display: 'flex', 
                flexDirection: 'column', 
                height: '500px', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                overflow: 'hidden',
                fontFamily: 'Arial, sans-serif'
              }},
              
              React.createElement(
                'div',
                { className: 'chat-header', style: { 
                  backgroundColor: '#f0f8ff', 
                  padding: '12px', 
                  borderBottom: '1px solid #ddd' 
                }},
                
                React.createElement('h3', { style: { margin: 0, color: '#2c3e50', fontSize: '16px' }}, 
                  'Physical AI & Humanoid Robotics Assistant')
              ),
              
              React.createElement(
                'div',
                { className: 'chat-messages', style: { 
                  flex: 1, 
                  overflowY: 'auto', 
                  padding: '16px', 
                  backgroundColor: '#fafafa' 
                }},
                
                messages.length === 0 ? 
                  React.createElement(
                    'div',
                    { className: 'welcome-message', style: { textAlign: 'center', color: '#7f8c8d', padding: '20px 0' }},
                    React.createElement('p', null, 'Hello! I\'m your Physical AI & Humanoid Robotics assistant.'),
                    React.createElement('p', null, 'Ask me anything about the textbook content.')
                  ) :
                  [
                    ...messages.map((msg, index) => 
                      React.createElement(
                        'div',
                        { key: index, className: `message ${msg.role}`, style: { 
                          marginBottom: '16px', 
                          maxWidth: '80%' 
                        }},
                        
                        React.createElement(
                          'div',
                          { className: 'message-content', style: { 
                            padding: '10px 14px', 
                            borderRadius: '18px', 
                            lineHeight: '1.4' 
                          }},
                          
                          msg.content,
                          
                          msg.sources && msg.sources.length > 0 && 
                            React.createElement(
                              'div',
                              { className: 'sources', style: { marginTop: '8px', fontSize: '0.85em' }},
                              
                              React.createElement(
                                'details',
                                null,
                                
                                React.createElement('summary', { style: { cursor: 'pointer', color: '#3498db' }}, 'Sources'),
                                
                                React.createElement(
                                  'ul',
                                  null,
                                  
                                  msg.sources.map((source, idx) => 
                                    React.createElement('li', { key: idx }, 
                                      source.filename || source.title || 'Source')
                                  )
                                )
                              )
                            )
                        )
                      )
                    ),
                    
                    isLoading && 
                      React.createElement(
                        'div',
                        { className: 'message assistant', style: { marginBottom: '16px', maxWidth: '80%' }},
                        
                        React.createElement(
                          'div',
                          { className: 'message-content', style: { padding: '10px 14px', borderRadius: '18px', lineHeight: '1.4' }},
                          
                          React.createElement(
                            'div',
                            { className: 'typing-indicator', style: { display: 'flex', alignItems: 'center' }},
                            
                            React.createElement('span', { style: { 
                              height: '8px', 
                              width: '8px', 
                              backgroundColor: '#7f8c8d', 
                              borderRadius: '50%', 
                              display: 'inline-block', 
                              margin: '0 2px',
                              animation: 'typing 1.4s infinite ease-in-out'
                            }}),
                            React.createElement('span', { style: { 
                              height: '8px', 
                              width: '8px', 
                              backgroundColor: '#7f8c8d', 
                              borderRadius: '50%', 
                              display: 'inline-block', 
                              margin: '0 2px',
                              animation: 'typing 1.4s infinite ease-in-out',
                              animationDelay: '0.2s'
                            }}),
                            React.createElement('span', { style: { 
                              height: '8px', 
                              width: '8px', 
                              backgroundColor: '#7f8c8d', 
                              borderRadius: '50%', 
                              display: 'inline-block', 
                              margin: '0 2px',
                              animation: 'typing 1.4s infinite ease-in-out',
                              animationDelay: '0.4s'
                            }})
                          )
                        )
                      ),
                    
                    React.createElement('div', { ref: messagesEndRef })
                  ]
              ),
              
              React.createElement(
                'form',
                { onSubmit: handleSubmit, className: 'chat-input-form', style: { 
                  padding: '12px', 
                  borderTop: '1px solid #ddd', 
                  backgroundColor: 'white' 
                }},
                
                React.createElement(
                  'div',
                  { className: 'input-row', style: { display: 'flex', gap: '8px' }},
                  
                  React.createElement('input', {
                    type: 'text',
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    placeholder: 'Ask about Physical AI & Humanoid Robotics...',
                    disabled: isLoading,
                    style: {
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '18px',
                      fontSize: '14px'
                    }
                  }),
                  
                  React.createElement('button', {
                    type: 'submit',
                    disabled: isLoading,
                    style: {
                      padding: '10px 16px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '18px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }
                  }, isLoading ? 'Sending...' : 'Send')
                )
              ),
              
              React.createElement('style', null, `
                @keyframes typing {
                  0%, 60%, 100% { transform: translateY(0); }
                  30% { transform: translateY(-5px); }
                }
              `)
            );
          };

          // Render the chatbot
          root.render(React.createElement(window.RAGChatbot, { backendUrl: 'http://localhost:8000/api/v1' }));
        };
        
        document.head.appendChild(script3);
      };
      document.head.appendChild(script2);
    };
    document.head.appendChild(script);
  }, []);

  return React.createElement('div', { ref: chatbotRef });
};

export default RAGChatbotComponent;