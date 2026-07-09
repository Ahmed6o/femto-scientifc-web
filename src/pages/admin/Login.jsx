import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import BASE_URL from '../../config';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection failed. Is the server running?');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="text-center mb-20">
          <img src="/images/logo.svg" alt="Logo" style={{height: '40px', marginBottom: '20px'}} />
          <h2>Admin Login</h2>
        </div>
        {error && <div className="admin-alert error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className="admin-input"
            />
          </div>
          <button type="submit" className="admin-btn primary full-width">Login</button>
        </form>
      </div>
    </div>
  );
}
