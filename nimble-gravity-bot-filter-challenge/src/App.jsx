import { useState } from 'react'
import './App.css'
import { getCandidateByEmail } from './api';
import JobList from './api/JobList/JobList';

export default function App() {
  const [email, setEmail] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  async function handleLoadCandidate(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCandidateByEmail(email.trim());
      setCandidate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleMessage(msg, type = 'success') {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="app">
      <h1 className="app__title">Postulación a posiciones</h1>

      {!candidate ? (
        <form className="form" onSubmit={handleLoadCandidate}>
          <label className="form__label" htmlFor="email">Tu email</label>
          <input
            id="email"
            className="form__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            disabled={loading}
          />
          <button type="submit" className="form__submit" disabled={loading}>
            {loading ? 'Cargando…' : 'Cargar mis datos'}
          </button>
          {error && <p className="form__error">{error}</p>}
        </form>
      ) : (
        <>
          <p className="welcome">
            Hola, {candidate.firstName} {candidate.lastName}.
          </p>
          {message && (
            <p className={`message message--${messageType}`}>
              {message}
            </p>
          )}
          <JobList candidate={candidate} onMessage={handleMessage} />
        </>
      )}
    </div>
  );
}
