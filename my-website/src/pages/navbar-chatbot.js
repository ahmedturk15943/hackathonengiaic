// Script to render the RAG chatbot component into the navbar
import { createRoot } from 'react-dom/client';
import React, { useState, useRef, useEffect } from 'react';

// The actual chatbot component
const CustomChatbot = () => {
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
          borderRadius: '18px',
          padding: '6px 12px',
          cursor: 'pointer',
          color: 'white',
          fontSize: '14px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          position: 'relative',
          zIndex: 101,
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Open AI Assistant"
      >
        <span style={{ marginRight: '5px' }}>🤖</span>
        <span>Chat</span>
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

// Wait for the DOM to be ready and then render the component
if (typeof document !== 'undefined') {
  const waitForElementAndRender = () => {
    const rootElement = document.getElementById('custom-chatbot-root');
    if (rootElement) {
      // Add a small delay to ensure the navbar is fully rendered
      setTimeout(() => {
        const root = createRoot(rootElement);
        root.render(<CustomChatbot />);
      }, 100);
    } else {
      // Retry after a short delay
      setTimeout(waitForElementAndRender, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForElementAndRender);
  } else {
    // DOM is already ready
    waitForElementAndRender();
  }
}