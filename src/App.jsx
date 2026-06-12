import { useState, useEffect } from 'react';

// Seeding some initial atmospheric confessions so the feed has content on first load.
const INITIAL_CONFESSIONS = [
  {
    key: 'init-1',
    text: "I write poetry about strangers I pass on the street. They will never know they are immortalized in the notebook under my floorboards.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    key: 'init-2',
    text: "I pretended to lose my wedding ring just to see how much my spouse cared. Seeing their heartbreak made me find it immediately, but the guilt of that lie still haunts me every day.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
  },
  {
    key: 'init-3',
    text: "I secretly buy groceries for my elderly neighbor and leave them on her porch, claiming it's an anonymous charity program. She thinks there's an angel watching over her, but it's just the quiet kid from next door.",
    timestamp: new Date(Date.now() - 1000 * 60 * 480), // 8 hours ago
  }
];

function App() {
  const [confessions, setConfessions] = useState(() => {
    // Attempt to keep in-memory but seed with the initial list
    return INITIAL_CONFESSIONS;
  });
  const [text, setText] = useState('');
  const [timeTicker, setTimeTicker] = useState(Date.now());

  // Periodically trigger a re-render to keep relative time strings fresh
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTicker(Date.now());
    }, 30000); // refresh every 30s
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    // Strictly block input beyond 280 characters
    if (inputValue.length <= 280) {
      setText(inputValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanText = text.trim();
    
    // Validate empty or all-whitespace submissions
    if (!cleanText) return;

    // Create new confession object
    const newConfession = {
      key: `confession-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: cleanText,
      timestamp: new Date()
    };

    // Prepend new confession (newest first)
    setConfessions((prev) => [newConfession, ...prev]);
    
    // Clear input
    setText('');
  };

  // Check character limits
  const charCount = text.length;
  const isLimitReached = charCount >= 280;
  const isLimitNear = charCount >= 250;
  
  // Submit is active only if there is non-whitespace text
  const isFormValid = text.trim().length > 0 && charCount <= 280;

  // Format the time posted
  const formatTime = (date) => {
    // Formats absolute time: e.g. "2:34 PM"
    const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    // Relative time calculation
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) {
      return `Just now (at ${timeString})`;
    } else if (diffMins < 60) {
      return `${diffMins}m ago (at ${timeString})`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return `${diffHours}h ago (at ${timeString})`;
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ` at ${timeString}`;
      }
    }
  };

  return (
    <>
      {/* Decorative ambient gradients */}
      <div className="bg-ambience" aria-hidden="true" />
      
      <header>
        <h1 className="cathedral-title">Confession Cathedral</h1>
        <div className="header-divider" aria-hidden="true">
          <span>✙</span>
        </div>
        <p className="cathedral-subtitle">Speak your truth in absolute silence.</p>
      </header>

      <main>
        {/* Form Altar */}
        <section className="confession-altar">
          <form onSubmit={handleSubmit}>
            <div className="textarea-container">
              <textarea
                className="confession-input"
                placeholder="Unburden your soul, child. Whisper your secrets here..."
                value={text}
                onChange={handleChange}
                maxLength={280}
                aria-label="Your confession"
              />
            </div>
            
            <div className="altar-actions">
              <div 
                className={`char-counter ${isLimitReached ? 'limit-reached' : isLimitNear ? 'limit-near' : ''}`}
                aria-live="polite"
              >
                <span className="count">{charCount}</span> / 280
                {isLimitReached && <span className="warning-text"> (Limit reached)</span>}
              </div>

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={!isFormValid}
              >
                Confess
              </button>
            </div>
          </form>
        </section>

        {/* Feed Section */}
        <section>
          <div className="feed-header">
            <h2>The Whispering Walls</h2>
            <div className="feed-header-line" aria-hidden="true" />
          </div>

          <div className="confessions-feed">
            {confessions.length === 0 ? (
              <div className="empty-feed">
                The cathedral is silent. No one has confessed yet.
              </div>
            ) : (
              confessions.map((confession) => (
                <article className="confession-card" key={confession.key}>
                  <div className="confession-card-header">
                    <div className="anon-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                        <path d="M12 2a10 10 0 0 1 10 10h-10V2z" />
                        <path d="M12 12L2.5 12" />
                        <path d="M12 12l7.5 7.5" />
                      </svg>
                      Anonymous
                    </div>
                    <time className="confession-time" dateTime={confession.timestamp.toISOString()}>
                      {formatTime(confession.timestamp)}
                    </time>
                  </div>
                  <p className="confession-text">{confession.text}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
