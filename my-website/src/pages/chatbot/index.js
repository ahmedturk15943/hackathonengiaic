import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React, { useState, useRef, useEffect } from 'react';

if (ExecutionEnvironment.canUseDOM) {
  // Create the chatbot icon and functionality when the DOM is available
  const initializeChatbot = () => {
    // Create the button element
    const chatbotButton = document.createElement('div');
    chatbotButton.innerHTML = '<button id="chatbot-navbar-btn" style="background:#3498db;border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;box-shadow:0 2px 5px rgba(0,0,0,0.2);margin-left:10px;">🤖</button>';
    
    // Find the navbar container
    const navbarItems = document.querySelector('.navbar__items--right');
    if (navbarItems) {
      // Insert the chatbot button
      navbarItems.insertBefore(chatbotButton, navbarItems.firstChild);
      
      // Add click functionality
      const button = document.getElementById('chatbot-navbar-btn');
      let showChat = false;
      let chatContainer = null;
      
      button.addEventListener('click', () => {
        if (showChat) {
          // Close chat
          if (chatContainer && chatContainer.parentNode) {
            chatContainer.parentNode.removeChild(chatContainer);
          }
          showChat = false;
        } else {
          // Open chat
          chatContainer = document.createElement('div');
          chatContainer.id = 'chatbot-dropdown';
          chatContainer.style.cssText = `
            position: fixed;
            top: ${button.getBoundingClientRect().bottom + window.scrollY}px;
            right: ${window.innerWidth - button.getBoundingClientRect().right}px;
            width: 350px;
            z-index: 1000;
            background-color: white;
            border-radius: 8px;
            border: 1px solid #ddd;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          `;
          
          chatContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #3498db; color: white; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <span style="font-weight: bold;">AI Assistant</span>
              <button id="close-chat-btn" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
            </div>
            <div style="padding: 10px;">
              <iframe 
                src="/rag-chatbot/index.html" 
                width="100%" 
                height="400px" 
                frameborder="0" 
                title="Physical AI & Humanoid Robotics Assistant">
              </iframe>
            </div>
          `;
          
          document.body.appendChild(chatContainer);
          
          // Add close functionality
          document.getElementById('close-chat-btn').addEventListener('click', () => {
            if (chatContainer && chatContainer.parentNode) {
              chatContainer.parentNode.removeChild(chatContainer);
            }
            showChat = false;
          });
          
          // Close when clicking outside
          const closeOnOutsideClick = (event) => {
            if (chatContainer && !chatContainer.contains(event.target) && 
                !button.contains(event.target)) {
              document.body.removeChild(chatContainer);
              showChat = false;
              document.removeEventListener('click', closeOnOutsideClick);
            }
          };
          
          setTimeout(() => {
            document.addEventListener('click', closeOnOutsideClick);
          }, 100);
          
          showChat = true;
        }
      });
    }
  };

  // Initialize when the page loads
  window.addEventListener('load', initializeChatbot);
}

// This React component is just a placeholder since the actual functionality is implemented above
const ChatbotIcon = () => {
  return <div id="chatbot-navbar-container" />;
};

export default ChatbotIcon;