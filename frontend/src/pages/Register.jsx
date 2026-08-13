import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, User, Mail, Phone, Lock, HeartHandshake } from 'lucide-react';
import { apiService } from '../services/apiService';

export const Register = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    skills: 'First Aid, Search & Rescue',
    availability: 'Flexible / On-Call',
    role: 'VOLUNTEER'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiService.register(formData);
      if (res && res.user) {
        onLoginSuccess(res.user);
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-brand">
          <div className="logo-badge" style={{ background: 'linear-gradient(135deg, var(--accent-emerald), #059669)' }}>
            <HeartHandshake size={28} />
          </div>
          <h2>Volunteer Registration</h2>
          <p>Join Emergency Response & Community Relief Team</p>
        </div>

        {error && (
          <div className="alert-banner alert-banner-critical" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Jane Smith"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="jane@disaster.org"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.4rem' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+91-9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.4rem' }}
                />
                <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Key Skills & Expertise</label>
            <input
              type="text"
              name="skills"
              className="form-control"
              placeholder="e.g. First Aid, Heavy Driver, Cooking, Medical Support"
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Availability Schedule</label>
            <select
              name="availability"
              className="form-control"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="Flexible / On-Call">Flexible / On-Call</option>
              <option value="Full-Time / Weekends">Full-Time / Weekends</option>
              <option value="Weekdays">Weekdays Only</option>
              <option value="Emergency Response Only">Emergency Response Only</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-emerald"
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--accent-emerald)', fontWeight: '600', textDecoration: 'none' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
