import React, { useState, useEffect } from 'react';
import { AlertOctagon, MapPin, Phone, CheckCircle, RefreshCw, Clock, ShieldAlert } from 'lucide-react';
import { apiService } from '../services/apiService';
import Badge from '../components/Badge';

export const SosAlerts = ({ currentUser }) => {
  const [sosAlerts, setSosAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSosAlerts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getSosAlerts();
      setSosAlerts(data);
    } catch (e) {
      console.error('Failed to load SOS alerts', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSosAlerts();
  }, []);

  const handleStatusUpdate = async (sosId, newStatus) => {
    await apiService.updateSosStatus(sosId, newStatus);
    loadSosAlerts();
  };

  const activeCount = sosAlerts.filter(s => s.status === 'ACTIVE').length;
  const respondingCount = sosAlerts.filter(s => s.status === 'RESPONDING').length;

  return (
    <div className="sos-alerts-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <AlertOctagon size={28} color="#ef4444" style={{ display: 'inline', marginRight: '8px' }} />
            SOS Distress Emergency Alerts
          </h1>
          <p>Admin Command Center portal for active volunteer distress calls and emergency rescue dispatches.</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={loadSosAlerts}>
            <RefreshCw size={15} /> Refresh Signals
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ACTIVE DISTRESS CALLS</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', color: '#ef4444' }}>{activeCount}</h2>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #f97316' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RESCUE SQUAD RESPONDING</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', color: '#f97316' }}>{respondingCount}</h2>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RESOLVED INCIDENTS</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', color: '#10b981' }}>
            {sosAlerts.filter(s => s.status === 'RESOLVED').length}
          </h2>
        </div>
      </div>

      {/* SOS Alerts Table / Cards */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} color="#ef4444" />
          Live SOS Emergency Queue
        </h3>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading SOS requests...</div>
        ) : sosAlerts.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No active SOS distress signals reported. All volunteer units operational.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sosAlerts.map(sos => (
              <div
                key={sos.sos_id}
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: `2px solid ${
                    sos.status === 'ACTIVE' ? '#ef4444' :
                    sos.status === 'RESPONDING' ? '#f97316' : 'var(--border-color)'
                  }`,
                  background: sos.status === 'ACTIVE' ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-card-secondary, rgba(255,255,255,0.02))',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {sos.volunteer_name || `Volunteer #${sos.volunteer_id}`}
                    </strong>
                    <Badge variant={sos.status === 'ACTIVE' ? 'CRITICAL' : sos.status === 'RESPONDING' ? 'HIGH' : 'LOW'}>
                      {sos.status}
                    </Badge>
                  </div>

                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    "{sos.message}"
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '3px' }} />
                      Coordinates: ({sos.latitude}, {sos.longitude})
                    </span>
                    {sos.volunteer_phone && (
                      <span>
                        <Phone size={13} style={{ display: 'inline', marginRight: '3px' }} />
                        Phone: {sos.volunteer_phone}
                      </span>
                    )}
                    <span>
                      <Clock size={13} style={{ display: 'inline', marginRight: '3px' }} />
                      Reported: {sos.created_at}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {sos.status === 'ACTIVE' && (
                    <button
                      className="btn btn-amber btn-sm"
                      onClick={() => handleStatusUpdate(sos.sos_id, 'RESPONDING')}
                    >
                      Dispatch Squad (Responding)
                    </button>
                  )}

                  {sos.status !== 'RESOLVED' && (
                    <button
                      className="btn btn-emerald btn-sm"
                      onClick={() => handleStatusUpdate(sos.sos_id, 'RESOLVED')}
                    >
                      <CheckCircle size={15} /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SosAlerts;
