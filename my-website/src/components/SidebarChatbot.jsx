import React, { useState, useEffect } from 'react';

const SidebarChatbot = ({ backendUrl = 'http://localhost:8000/api/v1' }) => {
  const [showChat, setShowChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 996); // Docusaurus mobile breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Don't render on mobile to avoid layout issues
  if (isMobile) {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      right: '20px', 
      top: '100px', 
      width: '300px',
      zIndex: 100 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        border: '1px solid #ddd',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          backgroundColor: '#3498db', 
          color: 'white', 
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px' }}>🤖 AI Assistant</h3>
          <button 
            onClick={() => setShowChat(!showChat)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {showChat ? '−' : '+'}
          </button>
        </div>
        
        {showChat && (
          <div style={{ padding: '10px' }}>
            <iframe
              src="/rag-chatbot/index.html"
              width="100%"
              height="400px"
              frameBorder="0"
              title="Physical AI & Humanoid Robotics Assistant"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarChatbot;