import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Megaphone, AlertCircle, Info, CheckSquare } from 'lucide-react';
import { apiService } from '../services/apiService';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

export const Notifications = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('DISASTER_ALERT');

  const isAdmin = currentUser?.role === 'ADMIN';

  const loadNotifications = async () => {
    if (!currentUser) return;
    const notifs = await apiService.getNotifications(currentUser.user_id);
    setNotifications(notifs);
  };

  useEffect(() => {
    loadNotifications();
    const handleStorageUpdate = () => loadNotifications();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, [currentUser]);

  const handleMarkAsRead = async (id) => {
    await apiService.markNotificationAsRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    if (!currentUser) return;
    const { notificationService } = await import('../services/storageService');
    notificationService.markAllAsRead(currentUser.user_id);
    loadNotifications();
  };

  const handleDelete = async (id) => {
    const { notificationService } = await import('../services/storageService');
    notificationService.delete(id);
    loadNotifications();
  };

  const handleCreateBroadcast = async (e) => {
    e.preventDefault();
    await apiService.createNotification({
      user_id: 'BROADCAST',
      title,
      message,
      type
    });
    setTitle('');
    setMessage('');
    setShowBroadcastModal(false);
    loadNotifications();
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Alerts & System Notifications</h1>
          <p>Real-time emergency bulletins, broadcast announcements, and personal task alerts.</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark All as Read
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowBroadcastModal(true)}>
              <Megaphone size={16} /> Create Broadcast Alert
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No notifications available.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.notification_id}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                borderLeft: n.is_read ? '1px solid var(--border-glass)' : '4px solid var(--accent-primary)',
                opacity: n.is_read ? 0.75 : 1
              }}
            >
              <div className="stat-icon-wrapper stat-icon-sky" style={{ width: '42px', height: '42px', flexShrink: 0 }}>
                {n.type === 'DISASTER_ALERT' ? <AlertCircle size={20} color="var(--accent-rose)" /> : <Bell size={20} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '1rem' }}>{n.title}</strong>
                  <Badge variant={n.type}>{n.type.replace('_', ' ')}</Badge>
                  {!n.is_read && (
                    <span style={{ fontSize: '0.68rem', background: 'var(--accent-primary)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: '700' }}>
                      NEW
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {n.message}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Posted: {n.created_at}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {!n.is_read && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleMarkAsRead(n.notification_id)} title="Mark as read">
                    <Check size={14} />
                  </button>
                )}
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.notification_id)} title="Delete notification">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Announcement Modal */}
      <Modal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        title="Broadcast System Alert"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowBroadcastModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateBroadcast}>Send Notification</button>
          </>
        }
      >
        <form onSubmit={handleCreateBroadcast}>
          <div className="form-group">
            <label>Alert Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Title of announcement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Category Type</label>
            <select
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="DISASTER_ALERT">DISASTER ALERT</option>
              <option value="TASK_ASSIGNMENT">TASK ASSIGNMENT</option>
              <option value="ANNOUNCEMENT">GENERAL ANNOUNCEMENT</option>
            </select>
          </div>
          <div className="form-group">
            <label>Message Text</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Write broadcast instructions or emergency update..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notifications;
