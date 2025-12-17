// src/plugins/chatbot-navbar-plugin.js
const path = require('path');

module.exports = function (context) {
  const { siteConfig } = context;

  return {
    name: 'chatbot-navbar-plugin',

    getClientModules() {
      return [path.resolve(__dirname, '../components/CustomChatbot.tsx')];
    },

    injectHtmlTags() {
      return {
        headTags: [
          // Add CSS for the navbar chatbot
          {
            tagName: 'style',
            innerHTML: `
              #custom-chatbot-root {
                display: inline-block;
                margin-left: 10px;
              }
            `,
          },
        ],
        postBodyTags: [
          // The div for the chatbot component to render into
          {
            tagName: 'div',
            attributes: {
              id: 'custom-chatbot-root',
              style: 'display: inline-block; margin-left: 10px;'
            }
          },
          // Script to render the component
          {
            tagName: 'script',
            innerHTML: `
              // Wait for React to load, then render the component
              function waitForReactAndRender() {
                if (window.React && window.ReactDOM) {
                  const rootElement = document.getElementById('custom-chatbot-root');
                  if (rootElement) {
                    const { createRoot } = window.ReactDOM;
                    const root = createRoot(rootElement);

                    // Define the component
                    function CustomChatbot() {
                      const [showChat, setShowChat] = window.React.useState(false);
                      const [position, setPosition] = window.React.useState({ top: '60px', right: '20px' });
                      const buttonRef = window.React.useRef(null);
                      const chatRef = window.React.useRef(null);

                      // Close chat when clicking outside
                      window.React.useEffect(() => {
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
                      window.React.useEffect(() => {
                        const updatePosition = () => {
                          if (buttonRef.current) {
                            const rect = buttonRef.current.getBoundingClientRect();
                            setPosition({
                              top: \`\${rect.bottom + window.scrollY}px\`,
                              right: \`\${window.innerWidth - rect.right}px\`
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

                      return window.React.createElement('div', {
                          style: { position: 'relative', display: 'inline-block', marginLeft: '10px' }
                        },
                        window.React.createElement('button', {
                          ref: buttonRef,
                          onClick: () => setShowChat(!showChat),
                          style: {
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
                          },
                          'aria-label': 'Open AI Assistant'
                        },
                          window.React.createElement('span', {
                            style: { marginRight: '5px' }
                          }, '🤖'),
                          window.React.createElement('span', null, 'Chat')
                        ),

                        showChat && window.React.createElement('div', {
                          ref: chatRef,
                          style: {
                            position: 'fixed',
                            top: position.top,
                            right: position.right,
                            width: '350px',
                            zIndex: 100,
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }
                        },
                          window.React.createElement('div', {
                            style: {
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px',
                              backgroundColor: '#3498db',
                              color: 'white',
                              borderTopLeftRadius: '8px',
                              borderTopRightRadius: '8px'
                            }
                          },
                            window.React.createElement('span', {
                              style: { fontWeight: 'bold' }
                            }, 'AI Assistant'),
                            window.React.createElement('button', {
                              onClick: () => setShowChat(false),
                              style: {
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '18px',
                                cursor: 'pointer'
                              }
                            }, '×')
                          ),
                          window.React.createElement('div', {
                            style: { padding: '10px' }
                          },
                            window.React.createElement('iframe', {
                              src: '/rag-chatbot/index.html',
                              width: '100%',
                              height: '400px',
                              frameBorder: '0',
                              title: 'Physical AI & Humanoid Robotics Assistant'
                            })
                          )
                        )
                      );
                    }

                    root.render(window.React.createElement(CustomChatbot));
                  }
                } else {
                  setTimeout(waitForReactAndRender, 100);
                }
              }

              // Start the process when the page loads
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', waitForReactAndRender);
              } else {
                setTimeout(waitForReactAndRender, 100);
              }
            `,
          }
        ],
      };
    },
  };
};