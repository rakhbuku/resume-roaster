import { useState, useEffect } from 'react';

export default function Home() {
  const [resumeText, setResumeText] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/roast');
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRoast = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setRoast('');

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      setRoast(data.roast || data.error || 'Failed to generate roast.');
      fetchHistory();
    } catch (err) {
      setRoast('An error occurred while roasting your resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/roast?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Failed to delete from database.');
      }
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1>🔥 Resume Roaster</h1>
      <p>Paste your resume text below to get an honest AI critique.</p>
      
      <textarea
        rows={8}
        style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc' }}
        placeholder="Paste your resume contents here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <button
        onClick={handleRoast}
        disabled={loading}
        style={{
          marginTop: '16px',
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: loading ? '#888' : '#e63946',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Roasting...' : 'Roast My Resume 🔥'}
      </button>

      {roast && (
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #e63946' }}>
          <h3>The Verdict:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{roast}</p>
        </div>
      )}

      <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #ddd' }} />

      <h2>📜 Recent Database Roasts</h2>
      {history.length === 0 ? (
        <p>No saved roasts in database yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.map((item) => (
            <div key={item.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ color: '#666' }}>Entry ID #{item.id}</small>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Delete 🗑️
                </button>
              </div>
              <details style={{ marginTop: '8px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  Resume Text: "{item.content.substring(0, 60)}..."
                </summary>
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f1f3f5', borderRadius: '6px' }}>
                  <strong>Saved Critique:</strong>
                  <p style={{ whiteSpace: 'pre-wrap', marginTop: '6px' }}>{item.roast}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}