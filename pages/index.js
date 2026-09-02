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
      if (Array.isArray(data)) setHistory(data);
    } catch (err) {
      console.error('Fetch error:', err);
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

      if (data.roast) {
        setRoast(data.roast);
        fetchHistory();
      } else {
        setRoast(data.error || 'An error occurred while roasting your resume.');
      }
    } catch (err) {
      setRoast('An error occurred while roasting your resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/roast?id=${id}`, { method: 'DELETE' });
      fetchHistory();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1>🔥 Resume Roaster</h1>
      <p>Paste your resume text below to get an honest AI critique.</p>

      <textarea
        rows={8}
        style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc' }}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste resume here..."
      />

      <br /><br />

      <button
        onClick={handleRoast}
        disabled={loading}
        style={{
          backgroundColor: '#d9534f',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Roasting...' : 'Roast My Resume 🔥'}
      </button>

      {roast && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderLeft: '4px solid #d9534f', borderRadius: '4px' }}>
          <h3>The Verdict:</h3>
          <p style={{ whitespace: 'pre-wrap' }}>{roast}</p>
        </div>
      )}

      <hr style={{ margin: '40px 0' }} />

      <h2>📜 Recent Database Roasts</h2>
      {history.length === 0 ? (
        <p>No saved roasts in database yet.</p>
      ) : (
        history.map((item) => (
          <div key={item.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
            <p><strong>Input:</strong> {item.content}</p>
            <p><strong>Roast:</strong> {item.roast}</p>
            <button
              onClick={() => handleDelete(item.id)}
              style={{ backgroundColor: '#ff4d4f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Delete 🗑️
            </button>
          </div>
        ))
      )}
    </div>
  );
}