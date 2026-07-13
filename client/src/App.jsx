import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Greetings! I am the Genesis AI engine. How can I help you build today?' }
  ]);
  const [healthStatus, setHealthStatus] = useState('checking');

  useEffect(() => {
    // Attempt health check from backend when server might be running
    fetch('http://localhost:8000/api/v1/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setHealthStatus('connected');
        } else {
          setHealthStatus('disconnected');
        }
      })
      .catch(() => {
        setHealthStatus('disconnected');
      });
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const newMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setPrompt('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `Simulated Response: Received your prompt "${prompt}". Backend integrations can be built in the server module!` 
        }
      ]);
    }, 8000);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="brand">
          <div className="brand-dot glow-glow" />
          <span>GENESIS AI</span>
        </div>

        <nav className="sidebar-menu">
          <div 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span>💻</span> Dashboard
          </div>
          <div 
            className={`menu-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <span>💬</span> AI Sandbox
          </div>
        </nav>

        <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>Local Workspace</div>
          <div style={{ wordBreak: 'break-all', fontSize: '0.7rem', marginTop: '0.2rem' }}>
            genesis-ai/client
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="main-content">
        <header className="header glass">
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Sprint 3 Core Framework
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: healthStatus === 'connected' ? 'var(--accent-emerald)' : 'var(--text-muted)'
            }} />
            <span style={{ fontSize: '0.85rem' }}>
              Backend: {healthStatus === 'connected' ? 'Connected' : 'Offline'}
            </span>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ padding: '2rem 2rem 0 2rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Full-Stack Workspace Scaffolding
              </h1>
              <p style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>
                Your project directories, backend servers, docs, and client scaffolding are fully provisioned. Begin coding inside the monorepo packages.
              </p>
            </div>

            <div className="dashboard-grid">
              <div className="card glass">
                <div className="card-title">
                  <span>📁</span> client/src
                </div>
                <div className="card-desc">
                  Vite + React frontend with hooks, contexts, pages, components, features, modules, layouts, services, utils, and environment configs.
                </div>
              </div>

              <div className="card glass">
                <div className="card-title">
                  <span>🖥️</span> server/src
                </div>
                <div className="card-desc">
                  Express API gateway with configs, controllers, models, services, middlewares, utils, and global error handlers.
                </div>
              </div>

              <div className="card glass">
                <div className="card-title">
                  <span>📚</span> docs/
                </div>
                <div className="card-desc">
                  Technical requirements, architecture flow diagrams, API specs, database schemas, and product roadmaps.
                </div>
              </div>
            </div>

            <div style={{ padding: '0 2rem 2rem 2rem' }}>
              <div className="card glass" style={{ borderStyle: 'dashed', cursor: 'default' }}>
                <div className="card-title" style={{ color: 'var(--accent-cyan)' }}>
                  💡 Pro-Tip
                </div>
                <div className="card-desc">
                  Run <code>npm run dev</code> from the project root workspace directory to run both your frontend server and backend API simultaneously.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-preview">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className="glass"
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    borderLeft: msg.role === 'assistant' ? '3px solid var(--primary)' : '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {msg.role === 'user' ? 'You' : 'Genesis Assistant'}
                  </div>
                  <div>{msg.content}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-wrapper glass">
              <input 
                type="text" 
                className="chat-input"
                placeholder="Ask Genesis anything..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button type="submit" className="chat-send-btn">
                Send
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
