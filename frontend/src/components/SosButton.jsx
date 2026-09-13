import React, { useState } from 'react';
import { AlertOctagon, MapPin, Send, CheckCircle, ShieldAlert } from 'lucide-react';
import { apiService } from '../services/apiService';
import audioService from '../services/audioService';

export const SosButton = ({ currentUser, onSosCreated }) => {
  const [activeSos, setActiveSos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sosMessage, setSosMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const triggerSos = async () => {
    setLoading(true);
    let lat = 13.0827; // Default Chennai Sector 14 coords fallback
    let lng = 80.2707;

    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 });
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch (err) {
        console.warn('Geolocation permission not granted or timed out. Using current fallback zone.', err);
      }
    }

    try {
      const volId = currentUser?.volunteer_id || currentUser?.user_id || 1;
      const sosData = {
        volunteer_id: volId,
        volunteer_name: currentUser?.name || 'Volunteer',
        volunteer_phone: currentUser?.phone || '',
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        message: sosMessage || 'MAYDAY! Emergency rescue required immediately!',
        status: 'ACTIVE'
      };

      const result = await apiService.createSosAlert(sosData);
      setActiveSos(result);
      audioService.playAlertBeep();
      setShowConfirmModal(false);
      setSosMessage('');

      // Also auto update volunteer live location
      await apiService.updateVolunteerLocation({
        volunteer_id: volId,
        volunteer_name: currentUser?.name || 'Volunteer',
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        status: 'SOS_ACTIVE'
      });

      if (onSosCreated) onSosCreated(result);
    } catch (err) {
      alert('Failed to send SOS signal. Please retry!');
    } finally {
      setLoading(false);
    }
  };

  const resolveSos = async () => {
    if (!activeSos) return;
    try {
      await apiService.updateSosStatus(activeSos.sos_id, 'RESOLVED');
      setActiveSos(null);
    } catch (e) {}
  };

  return (
    <div className="sos-button-wrapper" style={{ margin: '1rem 0' }}>
      {activeSos ? (
        <div className="sos-active-panel glass-card" style={{ border: '2px solid #ef4444', background: 'rgba(239, 68, 68, 0.08)', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="pulse-beacon-red" style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444' }}></span>
            <strong style={{ color: '#ef4444', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
              SOS EMERGENCY SIGNAL ACTIVE
            </strong>
          </div>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Status: <span className="badge badge-critical">{activeSos.status}</span>
          </p>
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Coordinates: {activeSos.latitude}, {activeSos.longitude}
          </p>
          <button className="btn btn-secondary btn-sm" onClick={resolveSos}>
            <CheckCircle size={15} /> Mark SOS Resolved
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            className="sos-trigger-btn"
            onClick={() => setShowConfirmModal(true)}
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              color: '#ffffff',
              border: '4px solid rgba(254, 202, 202, 0.4)',
              borderRadius: '50px',
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(220, 38, 38, 0.5)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <AlertOctagon size={28} className="animate-pulse" />
            <span>PRESS SOS EMERGENCY</span>
          </button>

          {showConfirmModal && (
            <div className="modal-backdrop" onClick={() => setShowConfirmModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginBottom: '1rem' }}>
                  <ShieldAlert size={26} />
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Send SOS Emergency Alert?</h3>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  This will dispatch an urgent distress signal to Command Center Admins and capture your current live geolocation coordinates.
                </p>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Emergency Message / Situation Details</label>
                  <textarea
                    rows={3}
                    className="form-input"
                    placeholder="Describe your location or immediate danger (optional)..."
                    value={sosMessage}
                    onChange={e => setSosMessage(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={triggerSos} disabled={loading}>
                    <Send size={16} /> {loading ? 'Dispatching SOS...' : 'Confirm & Dispatch SOS'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SosButton;
