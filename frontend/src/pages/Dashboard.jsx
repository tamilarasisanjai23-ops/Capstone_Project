import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  AlertTriangle,
  CheckSquare,
  Package,
  Home,
  Clock,
  CheckCircle,
  Megaphone,
  Plus,
  ArrowRight,
  Shield,
  Activity,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../services/apiService';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

export const Dashboard = ({ currentUser }) => {
  const [metrics, setMetrics] = useState(null);
  const [recentDisasters, setRecentDisasters] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === 'ADMIN';

  const loadDashboardData = async () => {
    const summary = await apiService.getReportsSummary();
    setMetrics(summary);

    const disasters = await apiService.getDisasters();
    setRecentDisasters(disasters.slice(0, 3));

    const allTasks = await apiService.getTasks();
    if (isAdmin) {
      setAssignedTasks(allTasks.slice(0, 5));
    } else {
      // Filter tasks assigned to this volunteer
      const myTasks = allTasks.filter(t => t.assignedVolunteer && (
        Number(t.assignedVolunteer.user_id) === Number(currentUser?.user_id) ||
        Number(t.assignedVolunteer.volunteer_id) === Number(currentUser?.user_id)
      ));
      setAssignedTasks(myTasks);
    }

    const centers = await apiService.getReliefCenters();
    setShelters(centers.slice(0, 3));
  };

  useEffect(() => {
    loadDashboardData();
    const handleStorageUpdate = () => loadDashboardData();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, [currentUser, isAdmin]);

  const handleStatusChange = async (taskId, newStatus) => {
    await apiService.updateTaskStatus(taskId, newStatus);
    loadDashboardData();
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    await apiService.createNotification({
      user_id: 'BROADCAST',
      title: broadcastTitle,
      message: broadcastMessage,
      type: 'DISASTER_ALERT'
    });

    setBroadcastTitle('');
    setBroadcastMessage('');
    setShowBroadcastModal(false);
    alert('Broadcast notification sent to all volunteers!');
  };

  return (
    <div className="dashboard-page">
      {/* Active Disaster Warning Banner */}
      {recentDisasters.some(d => d.severity === 'CRITICAL') && (
        <div className="alert-banner alert-banner-critical">
          <AlertCircle size={24} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '1rem', display: 'block' }}>HIGH ALERT: CRITICAL DISASTER IN PROGRESS</strong>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>
              {recentDisasters.find(d => d.severity === 'CRITICAL')?.type} - {recentDisasters.find(d => d.severity === 'CRITICAL')?.description}
            </p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => navigate('/disasters')}>
            View Disaster Alert
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{isAdmin ? 'System Command Center' : `Welcome Back, ${currentUser?.name || 'Volunteer'}`}</h1>
          <p>
            {isAdmin 
              ? 'Real-time monitoring and coordination across disaster zones and relief squads.' 
              : 'Your active assignments, disaster warnings, and emergency contact portal.'}
          </p>
        </div>

        <div className="header-actions">
          {isAdmin ? (
            <>
              <button className="btn btn-primary" onClick={() => setShowBroadcastModal(true)}>
                <Megaphone size={16} /> Broadcast Alert
              </button>
              <button className="btn btn-emerald" onClick={() => navigate('/tasks')}>
                <Plus size={16} /> Dispatch Task
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
              <CheckSquare size={16} /> My Tasks
            </button>
          )}
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="stat-grid">
        <StatCard
          icon={Users}
          value={metrics?.totalVolunteers || 0}
          label="Total Volunteers"
          subtext={`${metrics?.activeVolunteers || 0} Ready on Duty`}
          color="indigo"
        />
        <StatCard
          icon={AlertTriangle}
          value={metrics?.totalDisasters || 0}
          label="Disaster Incidents"
          subtext={`${metrics?.activeDisasters || 0} Active Crisis Zones`}
          color="rose"
        />
        <StatCard
          icon={Clock}
          value={metrics?.pendingTasks || 0}
          label="Pending Tasks"
          subtext="Requires Volunteer Action"
          color="amber"
        />
        <StatCard
          icon={CheckCircle}
          value={metrics?.completedTasks || 0}
          label="Tasks Completed"
          subtext="Successfully Resolved"
          color="emerald"
        />
        <StatCard
          icon={Package}
          value={metrics?.totalResources || 0}
          label="Resource Items"
          subtext={`${metrics?.deliveredResources || 0} Delivered`}
          color="sky"
        />
        <StatCard
          icon={Home}
          value={metrics?.totalShelters || 0}
          label="Relief Shelters"
          subtext={`${metrics?.totalOccupancy || 0} / ${metrics?.totalCapacity || 0} Capacity`}
          color="purple"
        />
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Tasks Board */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckSquare size={18} color="var(--accent-sky)" />
              {isAdmin ? 'Recent Emergency Tasks' : 'My Assigned Duties'}
            </h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/tasks')}
              style={{ gap: '0.25rem' }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          {assignedTasks.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tasks currently assigned.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {assignedTasks.map(t => (
                <div key={t.task_id} style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{t.title}</strong>
                    <Badge variant={t.priority}>{t.priority}</Badge>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{t.description}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Badge variant={t.status}>{t.status.replace('_', ' ')}</Badge>
                      {t.assignedVolunteer && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Assigned: <strong>{t.assignedVolunteer.name}</strong>
                        </span>
                      )}
                    </div>

                    {!isAdmin && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {t.status === 'ASSIGNED' && (
                          <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(t.task_id, 'IN_PROGRESS')}>
                            Start Task
                          </button>
                        )}
                        {t.status === 'IN_PROGRESS' && (
                          <button className="btn btn-emerald btn-sm" onClick={() => handleStatusChange(t.task_id, 'COMPLETED')}>
                            Mark Done
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Disasters & Shelters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Active Disasters */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="var(--accent-rose)" />
                Active Crisis Zones
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/disasters')}>
                Manage
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentDisasters.map(d => (
                <div key={d.disaster_id} style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block' }}>{d.type}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Location: {d.location?.city || 'Zone ' + d.location_id}
                    </span>
                  </div>
                  <Badge variant={d.severity}>{d.severity}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Relief Shelters Summary */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Home size={18} color="var(--accent-emerald)" />
                Shelter Occupancy
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/relief-centers')}>
                Shelters
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {shelters.map(c => {
                const percent = Math.min(100, Math.round((c.occupancy / c.capacity) * 100));
                const barColor = percent > 85 ? 'var(--accent-rose)' : percent > 60 ? 'var(--accent-amber)' : 'var(--accent-emerald)';

                return (
                  <div key={c.center_id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{c.name}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{c.occupancy} / {c.capacity} ({percent}%)</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${percent}%`, background: barColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      <Modal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        title="Broadcast Disaster Alert to Volunteers"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowBroadcastModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSendBroadcast}>Dispatch Notification</button>
          </>
        }
      >
        <form onSubmit={handleSendBroadcast}>
          <div className="form-group">
            <label>Alert Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Cyclone Standby Notice"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Message Content</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Enter operational details or instructions for field teams..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
