// src/plugins/homepage-chatbot-plugin.js
const path = require('path');

module.exports = function (context) {
  const { siteConfig } = context;
  
  return {
    name: 'homepage-chatbot-plugin',
    
    getClientModules() {
      return [path.resolve(__dirname, '../components/CustomChatbot.tsx')];
    },
    
    injectHtmlTags() {
      return {
        headTags: [
          // Add CSS for the homepage chatbot
          {
            tagName: 'style',
            innerHTML: `
              .homepage-chatbot-button {
                position: fixed;
                top: 80px;
                right: 20px;
                background: #3498db;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                cursor: pointer;
                color: white;
                font-size: 20px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s;
              }
              
              .homepage-chatbot-button:hover {
                background: #2980b9;
              }
              
              .homepage-chatbot-button.active {
                background: #2980b9;
              }
              
              .chatbot-dropdown {
                position: fixed;
                top: 140px;
                right: 20px;
                width: 350px;
                z-index: 999;
                background-color: white;
                border-radius: 8px;
                border: 1px solid #ddd;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              }
              
              .chatbot-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background-color: #3498db;
                color: white;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
              }
              
              .chatbot-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
              }
              
              .chatbot-iframe-container {
                padding: 10px;
              }
              
              /* Only show the button on the homepage */
              body:not(.docs-doc-page) .homepage-chatbot-container {
                display: block;
              }
              
              body.docs-doc-page .homepage-chatbot-container {
                display: none;
              }
            `,
          },
        ],
        postBodyTags: [
          // The container for the chatbot button on the homepage
          {
            tagName: 'div',
            attributes: {
              class: 'homepage-chatbot-container',
            },
            innerHTML: `
              <button id="homepage-chatbot-btn" class="homepage-chatbot-button" aria-label="Open AI Assistant">
                🤖
              </button>
              <div id="homepage-chatbot-dropdown" class="chatbot-dropdown" style="display: none;">
                <div class="chatbot-header">
                  <span style="font-weight: bold;">AI Assistant</span>
                  <button id="close-homepage-chat-btn" class="chatbot-close-btn">×</button>
                </div>
                <div class="chatbot-iframe-container">
                  <iframe
                    src="/rag-chatbot/chat.html"
                    width="100%"
                    height="400px"
                    frameborder="0"
                    title="Physical AI & Humanoid Robotics Assistant">
                  </iframe>
                </div>
              </div>
            `
          },
          // Script to handle the chatbot functionality on the homepage
          {
            tagName: 'script',
            innerHTML: `
              document.addEventListener('DOMContentLoaded', function() {
                // Only add the functionality if we're on the homepage
                if (!document.body.classList.contains('docs-doc-page')) {
                  const chatButton = document.getElementById('homepage-chatbot-btn');
                  const chatDropdown = document.getElementById('homepage-chatbot-dropdown');
                  const closeButton = document.getElementById('close-homepage-chat-btn');
                  
                  let isOpen = false;
                  
                  chatButton.addEventListener('click', function() {
                    isOpen = !isOpen;
                    chatDropdown.style.display = isOpen ? 'block' : 'none';
                    chatButton.classList.toggle('active', isOpen);
                  });
                  
                  closeButton.addEventListener('click', function() {
                    isOpen = false;
                    chatDropdown.style.display = 'none';
                    chatButton.classList.remove('active');
                  });
                  
                  // Close when clicking outside
                  document.addEventListener('click', function(event) {
                    if (isOpen && 
                        !chatButton.contains(event.target) && 
                        !chatDropdown.contains(event.target)) {
                      isOpen = false;
                      chatDropdown.style.display = 'none';
                      chatButton.classList.remove('active');
                    }
                  });
                }
              });
            `,
          }
        ],
      };
    },
  };
};