import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

const ChatLayout = (props) => {
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000/api/v1');
  const [showChat, setShowChat] = useState(true);

  // Initialize backend URL from environment or default
  useEffect(() => {
    // In production, you might want to set this to your actual backend URL
    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api/v1';
    setBackendUrl(url);
  }, []);

  return (
    <Layout {...props}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          {props.children}
        </div>
        {showChat && (
          <div style={{ 
            position: 'fixed', 
            right: '20px', 
            bottom: '20px', 
            width: '350px',
            zIndex: 1000
          }}>
            <div 
              onClick={() => setShowChat(false)} 
              style={{ 
                textAlign: 'right', 
                marginBottom: '5px',
                cursor: 'pointer',
                color: '#999',
                fontSize: '12px'
              }}
            >
              HIDE CHAT
            </div>
            <div>
              <iframe
                src="/rag-chatbot/index.html"
                width="100%"
                height="500px"
                frameBorder="0"
                title="Physical AI & Humanoid Robotics Assistant"
                style={{ borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>
          </div>
        )}
        {!showChat && (
          <button 
            onClick={() => setShowChat(true)}
            style={{ 
              position: 'fixed', 
              right: '20px', 
              bottom: '20px', 
              zIndex: 1000,
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '20px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            💬
          </button>
        )}
      </div>
    </Layout>
  );
};

export default ChatLayout;