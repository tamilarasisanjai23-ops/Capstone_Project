import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, UserCheck, Shield } from 'lucide-react';
import { apiService } from '../services/apiService';

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@disaster.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDemoFill = (role) => {
    if (role === 'ADMIN') {
      setEmail('admin@disaster.org');
      setPassword('admin123');
    } else {
      setEmail('john@disaster.org');
      setPassword('volunteer123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiService.login(email, password);
      if (res && res.user) {
        onLoginSuccess(res.user);
        navigate('/dashboard');
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="logo-badge">
            <ShieldAlert size={28} />
          </div>
          <h2>Disaster Relief System</h2>
          <p>Emergency Response & Volunteer Coordination</p>
        </div>

        <div className="demo-credentials-box">
          <h4>⚡ Quick Demo Credentials</h4>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoFill('ADMIN')}
              style={{ gap: '0.3rem' }}
            >
              <Shield size={14} color="#a5b4fc" /> Admin Login
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoFill('VOLUNTEER')}
              style={{ gap: '0.3rem' }}
            >
              <UserCheck size={14} color="#38bdf8" /> Volunteer Login
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-banner alert-banner-critical" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                placeholder="name@disaster.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Want to join as a relief responder?{' '}
          <Link to="/register" style={{ color: 'var(--accent-sky)', fontWeight: '600', textDecoration: 'none' }}>
            Register as Volunteer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
