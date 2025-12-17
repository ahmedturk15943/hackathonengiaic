import { createRoot } from 'react-dom/client';
import React, { useState, useRef, useEffect } from 'react';

const ChatbotButton = () => {
  const [showChat, setShowChat] = useState(false);
  const [position, setPosition] = useState({ top: '60px', right: '20px' });
  const buttonRef = useRef(null);
  const chatRef = useRef(null);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowChat(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate position relative to button
  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: `${rect.bottom + window.scrollY}px`,
          right: `${window.innerWidth - rect.right}px`
        });
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }}>
      <button
        ref={buttonRef}
        onClick={() => setShowChat(!showChat)}
        style={{
          background: showChat ? '#2980b9' : '#3498db',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          position: 'relative',
          zIndex: 101
        }}
        aria-label="Open AI Assistant"
      >
        🤖
      </button>
      
      {showChat && (
        <div
          ref={chatRef}
          style={{
            position: 'fixed',
            top: position.top,
            right: position.right,
            width: '350px',
            zIndex: 100,
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #ddd',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#3498db',
            color: 'white',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}>
            <span style={{ fontWeight: 'bold' }}>AI Assistant</span>
            <button
              onClick={() => setShowChat(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          <div style={{ padding: '10px' }}>
            <iframe
              src="/rag-chatbot/index.html"
              width="100%"
              height="400px"
              frameBorder="0"
              title="Physical AI & Humanoid Robotics Assistant"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Initialize the chatbot button in the navbar
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Wait for the navbar to be rendered
    setTimeout(() => {
      const navbarItemsRight = document.querySelector('.navbar__items--right');
      if (navbarItemsRight) {
        const container = document.createElement('div');
        container.id = 'chatbot-navbar-container';
        navbarItemsRight.insertBefore(container, navbarItemsRight.firstChild);

        const root = createRoot(container);
        root.render(<ChatbotButton />);
      }
    }, 500);
  });
}

export default ChatbotButton;