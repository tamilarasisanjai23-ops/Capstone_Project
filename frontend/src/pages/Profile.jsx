import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Key, HeartHandshake, CheckCircle, Save } from 'lucide-react';
import { authService, volunteerService } from '../services/storageService';
import Badge from '../components/Badge';

export const Profile = ({ currentUser, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    skills: 'First Aid, Search & Rescue, Medical Support',
    availability: 'Flexible / On-Call'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      name: formData.name,
      phone: formData.phone
    };
    localStorage.setItem('vdr_current_user', JSON.stringify(updatedUser));
    onUserUpdate(updatedUser);
    setMessage('Profile details saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setMessage('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>My Profile & Settings</h1>
          <p>Manage contact information, skills registry, and security credentials.</p>
        </div>
      </div>

      {message && (
        <div className="alert-banner alert-banner-info" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} /> {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Profile Info Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="avatar-circle" style={{ width: '56px', height: '56px', fontSize: '1.5rem' }}>
              {currentUser?.name ? currentUser.name[0] : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{currentUser?.name}</h2>
              <Badge variant={currentUser?.role || 'VOLUNTEER'}>{currentUser?.role || 'VOLUNTEER'}</Badge>
            </div>
          </div>

          <form onSubmit={handleProfileSave}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
            <div className="form-group">
              <label>Phone Contact</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {currentUser?.role === 'VOLUNTEER' && (
              <>
                <div className="form-group">
                  <label>Skills & Qualifications</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Availability Schedule</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <Save size={16} /> Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} color="var(--accent-amber)" />
            Security & Credentials
          </h3>

          <form onSubmit={handlePasswordSave}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
              Update Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
