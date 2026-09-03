import { useState, useEffect } from 'react';

export default function Home() {
  const [resumeText, setResumeText] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsingPdf, setParsingPdf] = useState(false);
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setParsingPdf(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64Data = reader.result.split(',')[1];
        const res = await fetch('/api/parse-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileData: base64Data }),
        });

        let data;
        try {
          data = await res.json();
        } catch (err) {
          throw new Error(`Server returned error code ${res.status}`);
        }

        if (res.ok && data.text) {
          setResumeText(data.text);
        } else {
          alert(`PDF Parsing Error: ${data.error || 'Failed to extract text.'}`);
        }
      } catch (err) {
        alert(err.message || 'Error connecting to PDF parser endpoint.');
      } finally {
        setParsingPdf(false);
      }
    };

    reader.onerror = () => {
      alert('Error reading file in browser.');
      setParsingPdf(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRoast = async () => {
    if (!resumeText.trim()) {
      alert('Please paste resume text or wait for the PDF to parse before roasting.');
      return;
    }
    setLoading(true);
    setRoast('');

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();

      if (res.ok && data.roast) {
        setRoast(data.roast);
        fetchHistory();
      } else {
        setRoast(`Error: ${data.error || 'Failed to generate roast.'}`);
      }
    } catch (err) {
      setRoast('Server error. Check Vercel logs.');
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
      <p>Upload a PDF resume or paste your text below to get an honest AI critique.</p>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
          Upload PDF Resume:
        </label>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileUpload} 
          disabled={parsingPdf}
        />
        {parsingPdf && <span style={{ marginLeft: '10px', color: '#d9534f' }}>Extracting text...</span>}
      </div>

      <textarea
        rows={8}
        style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc' }}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste resume here or upload a PDF above..."
      />

      <br /><br />

      <button
        onClick={handleRoast}
        disabled={loading || parsingPdf}
        style={{
          backgroundColor: '#d9534f',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '6px',
          cursor: (loading || parsingPdf) ? 'not-allowed' : 'pointer',
          opacity: (loading || parsingPdf) ? 0.7 : 1
        }}
      >
        {loading ? 'Roasting...' : parsingPdf ? 'Parsing PDF...' : 'Roast My Resume 🔥'}
      </button>

      {roast && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderLeft: '4px solid #d9534f', borderRadius: '4px' }}>
          <h3>The Verdict:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{roast}</p>
        </div>
      )}

      <hr style={{ margin: '40px 0' }} />

      <h2>📜 History</h2>
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