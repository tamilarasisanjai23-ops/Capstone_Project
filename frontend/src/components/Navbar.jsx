import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, ShieldCheck, HeartHandshake, LogOut } from 'lucide-react';
import { apiService } from '../services/apiService';
import Badge from './Badge';

export const Navbar = ({ currentUser, onLogout }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnread = async () => {
    if (!currentUser) return;
    const notifs = await apiService.getNotifications(currentUser.user_id);
    const unread = notifs.filter(n => !n.is_read).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    fetchUnread();
    const handleStorageUpdate = () => fetchUnread();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, [currentUser]);

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <header className="top-navbar">
      <div className="nav-search">
        <Search size={16} />
        <input type="text" placeholder="Search tasks, disasters, shelters..." />
      </div>

      <div className="top-nav-actions">
        <Link to="/notifications" className="icon-btn" title="Notifications">
          <Bell size={18} />
          {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
        </Link>

        <div className="user-profile-badge" onClick={() => navigate('/profile')}>
          <div className="avatar-circle">
            {initials}
          </div>
          <div className="user-details">
            <span className="user-name">{currentUser?.name || 'User'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Badge variant={currentUser?.role || 'VOLUNTEER'}>
                {currentUser?.role || 'VOLUNTEER'}
              </Badge>
            </div>
          </div>
        </div>

        <button 
          onClick={onLogout} 
          className="btn btn-secondary btn-sm" 
          title="Sign Out"
          style={{ padding: '0.4rem 0.75rem', gap: '0.35rem' }}
        >
          <LogOut size={15} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
