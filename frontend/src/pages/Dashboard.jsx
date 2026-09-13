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
  AlertCircle,
  Mic,
  Radio,
  Volume2,
  AlertOctagon,
  VolumeX,
  MapPin
} from 'lucide-react';
import { apiService } from '../services/apiService';
import audioService from '../services/audioService';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import SosButton from '../components/SosButton';
import VoiceRecorderModal from '../components/VoiceRecorderModal';
import VoicePlayer from '../components/VoicePlayer';

export const Dashboard = ({ currentUser }) => {
  const [metrics, setMetrics] = useState(null);
  const [recentDisasters, setRecentDisasters] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [voiceAlerts, setVoiceAlerts] = useState([]);

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const [showEmergencyAlertModal, setShowEmergencyAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('CRITICAL');

  const [showVoiceRecorderModal, setShowVoiceRecorderModal] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);

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
      const myTasks = allTasks.filter(t => t.assignedVolunteer && (
        Number(t.assignedVolunteer.user_id) === Number(currentUser?.user_id) ||
        Number(t.assignedVolunteer.volunteer_id) === Number(currentUser?.user_id)
      ));
      setAssignedTasks(myTasks);
    }

    const centers = await apiService.getReliefCenters();
    setShelters(centers.slice(0, 3));

    const alerts = await apiService.getEmergencyAlerts();
    setEmergencyAlerts(alerts);

    const voices = await apiService.getVoiceAlerts();
    setVoiceAlerts(voices);
  };

  useEffect(() => {
    loadDashboardData();
    const handleStorageUpdate = () => loadDashboardData();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, [currentUser, isAdmin]);

  // Check critical alerts and trigger siren sound if new critical alert exists
  const hasCritical = emergencyAlerts.some(a => a.severity === 'CRITICAL') || recentDisasters.some(d => d.severity === 'CRITICAL');

  const toggleSiren = () => {
    if (sirenPlaying) {
      audioService.stopEmergencySiren();
      setSirenPlaying(false);
    } else {
      audioService.playEmergencySiren();
      setSirenPlaying(true);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await apiService.updateTaskStatus(taskId, newStatus);
    loadDashboardData();
  };

  const handleCreateEmergencyAlert = async (e) => {
    e.preventDefault();
    if (!alertTitle || !alertMessage) return;

    await apiService.createEmergencyAlert({
      title: alertTitle,
      message: alertMessage,
      severity: alertSeverity,
      created_by: currentUser?.user_id || 1
    });

    if (alertSeverity === 'CRITICAL') {
      audioService.playEmergencySiren();
      setSirenPlaying(true);
    }

    setAlertTitle('');
    setAlertMessage('');
    setShowEmergencyAlertModal(false);
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
      
      {/* Prominent Emergency Warning Banner */}
      {hasCritical && (
        <div className="alert-banner alert-banner-critical" style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.35) 100%)',
          border: '2px solid #ef4444',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)'
        }}>
          <AlertCircle size={28} color="#ef4444" style={{ flexShrink: 0 }} className="animate-pulse" />
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '1.05rem', color: '#fca5a5', display: 'block' }}>
              CRITICAL EMERGENCY ALERT IN EFFECT
            </strong>
            <p style={{ fontSize: '0.88rem', margin: '4px 0 0 0', color: '#fecaca' }}>
              {emergencyAlerts.find(a => a.severity === 'CRITICAL')?.message || 'Flash flood landfall imminent in Sector 14. Evacuate immediately.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={`btn ${sirenPlaying ? 'btn-amber' : 'btn-danger'} btn-sm`} onClick={toggleSiren}>
              {sirenPlaying ? <VolumeX size={15} /> : <Volume2 size={15} />}
              {sirenPlaying ? 'Silence Siren' : 'Play Alarm Siren'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/disasters')}>
              View Incident Details
            </button>
          </div>
        </div>
      )}

      {/* Volunteer SOS Emergency Button Bar */}
      {!isAdmin && (
        <div className="glass-card" style={{ marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
          <h3 style={{ fontSize: '1rem', color: '#ef4444', marginBottom: '0.25rem' }}>VOLUNTEER DISTRESS & EMERGENCY SIGNAL</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            In danger or trapped? Press SOS below to transmit your live GPS coordinates to the Command Center.
          </p>
          <SosButton currentUser={currentUser} onSosCreated={loadDashboardData} />
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{isAdmin ? 'System Command Center' : `Welcome Back, ${currentUser?.name || 'Volunteer'}`}</h1>
          <p>
            {isAdmin 
              ? 'Real-time monitoring, emergency alerts, voice dispatches, and SOS command matrix.' 
              : 'Your active assignments, disaster warnings, SOS emergency portal, and voice broadcasts.'}
          </p>
        </div>

        <div className="header-actions">
          {isAdmin ? (
            <>
              <button className="btn btn-danger" onClick={() => setShowEmergencyAlertModal(true)}>
                <AlertOctagon size={16} /> Create Emergency Alert
              </button>
              <button
  className="btn btn-rose"
  onClick={() => setShowVoiceRecorderModal(true)}
>
  <Mic size={16} /> Record Voice Alert
</button>
              <button className="btn btn-primary" onClick={() => navigate('/sos-alerts')}>
                <Shield size={16} /> SOS Center ({metrics?.activeSosCount || 0})
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/emergency-radio')}>
              <Radio size={16} /> Emergency Radio PTT
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
          icon={AlertOctagon}
          value={metrics?.activeSosCount || 0}
          label="Active SOS Distress Calls"
          subtext="Immediate Assistance Requested"
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
          icon={Home}
          value={metrics?.totalShelters || 0}
          label="Relief Shelters"
          subtext={`${metrics?.totalOccupancy || 0} / ${metrics?.totalCapacity || 0} Capacity`}
          color="purple"
        />
      </div>

      {/* Voice Alerts Feed Section */}
      {voiceAlerts.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={18} color="var(--accent-rose)" />
            Latest Emergency Voice Dispatches
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {voiceAlerts.slice(0, 2).map(voice => (
              <VoicePlayer key={voice.voice_id} voiceAlert={voice} />
            ))}
          </div>
        </div>
      )}

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

        {/* Right Column: Active Disasters & Emergency Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Emergency Alerts Feed */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertOctagon size={18} color="var(--accent-rose)" />
                Active Emergency Alerts ({emergencyAlerts.length})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {emergencyAlerts.map(alert => (
                <div key={alert.alert_id} style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: alert.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0,0,0,0.2)',
                  borderLeft: `4px solid ${alert.severity === 'CRITICAL' ? '#ef4444' : alert.severity === 'HIGH' ? '#f97316' : '#3b82f6'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem', color: alert.severity === 'CRITICAL' ? '#fca5a5' : 'var(--text-primary)' }}>
                      {alert.title}
                    </strong>
                    <Badge variant={alert.severity}>{alert.severity}</Badge>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{alert.message}</p>
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

      {/* Emergency Alert Creation Modal */}
      <Modal
        isOpen={showEmergencyAlertModal}
        onClose={() => setShowEmergencyAlertModal(false)}
        title="Create Emergency Alert Broadcast"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowEmergencyAlertModal(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleCreateEmergencyAlert}>Dispatch Emergency Alert</button>
          </>
        }
      >
        <form onSubmit={handleCreateEmergencyAlert}>
          <div className="form-group">
            <label>Emergency Alert Headline</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. FLASH FLOOD EVACUATION ORDER SECTOR 14"
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Alert Severity Level</label>
            <select
              className="form-control"
              value={alertSeverity}
              onChange={(e) => setAlertSeverity(e.target.value)}
            >
              <option value="LOW">LOW - Advisory / Status Update</option>
              <option value="MEDIUM">MEDIUM - High Preparedness</option>
              <option value="HIGH">HIGH - Danger / Urgent Action</option>
              <option value="CRITICAL">CRITICAL - Severe Siren & Sound Warning</option>
            </select>
          </div>

          <div className="form-group">
            <label>Alert Detailed Message</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Describe danger location, required volunteer actions, or evacuation points..."
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={showVoiceRecorderModal}
        onClose={() => setShowVoiceRecorderModal(false)}
        onVoiceSent={() => loadDashboardData()}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Dashboard;

