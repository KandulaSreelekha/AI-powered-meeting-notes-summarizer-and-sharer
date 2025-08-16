import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState('');
  const [emailSubject, setEmailSubject] = useState('Meeting Summary');
  const [isSharing, setIsSharing] = useState(false);

  // Get API URL from environment or use default
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const generateSummary = async () => {
    if (!text.trim()) {
      setAlert({ type: 'error', message: 'Please enter some text to summarize.' });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const response = await fetch(`${API_URL}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          customPrompt: customPrompt.trim() || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.error && data.error.includes('Groq API key not configured')) {
          throw new Error('API key not configured. Please set up your Groq API key in the backend.');
        }
        throw new Error(data.error || 'Failed to generate summary');
      }

      setSummary(data.summary);
      setAlert({ type: 'success', message: 'Summary generated successfully!' });
      setShowShare(true);
    } catch (error) {
      console.error('Error generating summary:', error);
      setAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to generate summary. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipientInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = recipientInput.trim();
      if (email && isValidEmail(email) && !recipients.includes(email)) {
        setRecipients([...recipients, email]);
        setRecipientInput('');
      }
    }
  };

  const removeRecipient = (emailToRemove) => {
    setRecipients(recipients.filter(email => email !== emailToRemove));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const shareSummary = async () => {
    if (!summary.trim()) {
      setAlert({ type: 'error', message: 'No summary to share.' });
      return;
    }

    if (recipients.length === 0) {
      setAlert({ type: 'error', message: 'Please add at least one recipient.' });
      return;
    }

    setIsSharing(true);
    setAlert(null);

    try {
      const response = await fetch(`${API_URL}/api/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: summary.trim(),
          recipients,
          subject: emailSubject.trim() || 'Meeting Summary'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.error && data.error.includes('Email configuration')) {
          throw new Error('Email not configured. Please set up your Gmail credentials in the backend.');
        }
        throw new Error(data.error || 'Failed to share summary');
      }

      setAlert({ type: 'success', message: data.message });
      setRecipients([]);
      setRecipientInput('');
      setEmailSubject('Meeting Summary');
    } catch (error) {
      console.error('Error sharing summary:', error);
      setAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to share summary. Please try again.' 
      });
    } finally {
      setIsSharing(false);
    }
  };

  const clearAll = () => {
    setText('');
    setCustomPrompt('');
    setSummary('');
    setRecipients([]);
    setRecipientInput('');
    setEmailSubject('Meeting Summary');
    setShowShare(false);
    setAlert(null);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>📝 Notes Summarizer</h1>
          <p>AI-powered meeting notes summarizer and sharer</p>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        <div className="form-section">
          <h2>📄 Input Your Text</h2>
          <div className="form-group">
            <label htmlFor="text">Meeting Notes / Transcript:</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your meeting notes, call transcript, or any text you want to summarize..."
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="customPrompt">Custom Instructions (Optional):</label>
            <input
              id="customPrompt"
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items'"
              disabled={isLoading}
            />
          </div>

          <button 
            className="btn" 
            onClick={generateSummary}
            disabled={isLoading || !text.trim()}
          >
            {isLoading && <span className="loading"></span>}
            {isLoading ? 'Generating Summary...' : 'Generate Summary'}
          </button>
        </div>

        {summary && (
          <div className="summary-section">
            <h2>📋 Generated Summary</h2>
            <div className="form-group">
              <label htmlFor="summary">Edit the summary if needed:</label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="summary-content"
                placeholder="Summary will appear here..."
              />
            </div>
          </div>
        )}

        {showShare && summary && (
          <div className="share-section">
            <h2>📧 Share Summary</h2>
            
            <div className="form-group">
              <label htmlFor="emailSubject">Email Subject:</label>
              <input
                id="emailSubject"
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Meeting Summary"
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipients">Recipients:</label>
              <div className="recipients-input">
                {recipients.map((email) => (
                  <span key={email} className="recipient-tag">
                    {email}
                    <button onClick={() => removeRecipient(email)}>×</button>
                  </span>
                ))}
                <input
                  id="recipients"
                  type="email"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={handleRecipientInput}
                  placeholder="Enter email addresses (press Enter or comma to add)"
                />
              </div>
              <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                Press Enter or comma to add each email address
              </small>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                className="btn" 
                onClick={shareSummary}
                disabled={isSharing || recipients.length === 0}
              >
                {isSharing && <span className="loading"></span>}
                {isSharing ? 'Sharing...' : 'Share via Email'}
              </button>
              
              <button 
                className="btn btn-secondary" 
                onClick={clearAll}
                disabled={isSharing}
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
