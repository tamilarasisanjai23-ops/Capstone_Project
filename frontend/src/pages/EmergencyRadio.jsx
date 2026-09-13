import React, { useState, useEffect, useRef } from 'react';
import { Radio, Mic, MicOff, Volume2, LogOut, Users, Signal, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';
import audioService from '../services/audioService';

const CHANNELS = [
  { id: 1, name: 'Medical', code: 'CH-101', description: 'Priority channel for emergency medical teams, triage, and doctor dispatch.' },
  { id: 2, name: 'Rescue', code: 'CH-102', description: 'Search and rescue squad coordination, boat operations, and evacuation.' },
  { id: 3, name: 'Food Distribution', code: 'CH-103', description: 'Supply chain dispatch, food ration delivery, and drinking water logistics.' },
  { id: 4, name: 'Transport', code: 'CH-104', description: 'Heavy vehicle squad, ambulance routing, and debris clearance convoy.' },
  { id: 5, name: 'General Emergency', code: 'CH-105', description: 'Main public emergency channel for general field updates and broadcasts.' }
];

export const EmergencyRadio = ({ currentUser }) => {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);
  const [isConnected, setIsConnected] = useState(false);
  const [micPermitted, setMicPermitted] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [recentTransmissions, setRecentTransmissions] = useState([]);
  const [activeListenersCount, setActiveListenersCount] = useState(12);

  const channelManagerRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    // Check initial mic permission status
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(stream => {
        setMicPermitted(true);
        stream.getTracks().forEach(t => t.stop());
      })
      .catch(() => setMicPermitted(false));
  }, []);

  useEffect(() => {
    if (isConnected) {
      channelManagerRef.current = audioService.createRadioChannelManager(activeChannel.name, (msg) => {
        setRecentTransmissions(prev => [msg, ...prev.slice(0, 15)]);
        audioService.playAlertBeep();
      });
    }

    return () => {
      if (channelManagerRef.current) {
        channelManagerRef.current.close();
      }
    };
  }, [isConnected, activeChannel]);

  const joinChannel = (channel) => {
    setActiveChannel(channel);
    setIsConnected(true);
    // Add simulated join notification
    setRecentTransmissions(prev => [{
      sender: 'SYSTEM',
      audioData: null,
      message: `Joined ${channel.name} (${channel.code}) channel.`,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const leaveChannel = () => {
    setIsConnected(false);
    setIsTransmitting(false);
    if (channelManagerRef.current) {
      channelManagerRef.current.close();
    }
  };

  const startPTT = async () => {
    if (!isConnected || isMuted) return;
    try {
      mediaRecorderRef.current = audioService.createVoiceRecorder();
      await mediaRecorderRef.current.start();
      setIsTransmitting(true);
    } catch (e) {
      alert('Unable to transmit audio: Microphone permission required.');
    }
  };

  const stopPTT = async () => {
    if (!isTransmitting || !mediaRecorderRef.current) return;
    setIsTransmitting(false);
    try {
      const recorded = await mediaRecorderRef.current.stop();
      if (channelManagerRef.current && recorded.audioData) {
        channelManagerRef.current.transmitAudioMessage(currentUser?.name || 'Field Unit', recorded.audioData);
      }
    } catch (e) {
      console.warn('PTT stop failed:', e);
    }
  };

  return (
    <div className="emergency-radio-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Radio size={28} color="var(--accent-rose)" style={{ display: 'inline', marginRight: '8px' }} />
            Emergency Radio / Push-to-Talk (PTT)
          </h1>
          <p>Real-time tactical audio walkie-talkie channels for field squads and emergency operators.</p>
        </div>

        <div className="header-actions">
          {micPermitted === false && (
            <span className="badge badge-critical" style={{ padding: '0.5rem 0.75rem' }}>
              <AlertCircle size={14} /> Mic Permission Denied
            </span>
          )}
          {micPermitted === true && (
            <span className="badge badge-success" style={{ padding: '0.5rem 0.75rem' }}>
              <CheckCircle size={14} /> Microphone Ready
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Radio Device UI */}
        <div className="glass-card" style={{
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          borderRadius: '20px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          padding: '1.75rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          maxWidth: '460px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Walkie-Talkie Screen Header */}
          <div style={{
            background: '#090d16',
            border: '2px solid #334155',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            fontFamily: 'monospace'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isConnected ? '#10b981' : '#f43f5e' }}>
                <Signal size={18} className={isConnected ? 'animate-pulse' : ''} />
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {isConnected ? 'ONLINE / CONNECTED' : 'OFFLINE / DISCONNECTED'}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={14} /> {isConnected ? activeListenersCount : 0} Active
              </span>
            </div>

            <div style={{ textAlign: 'center', padding: '0.75rem 0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                SELECTED CHANNEL
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '1px' }}>
                {activeChannel.code} - {activeChannel.name.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                {activeChannel.description}
              </div>
            </div>

            {/* Audio Wave Visualizer Simulation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '28px', marginTop: '0.5rem' }}>
              {[40, 70, 30, 90, 60, 100, 50, 80, 35, 65, 85, 45].map((val, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '4px',
                    height: isTransmitting ? `${val}%` : isConnected ? '15%' : '5%',
                    background: isTransmitting ? '#ef4444' : isConnected ? '#38bdf8' : '#334155',
                    borderRadius: '2px',
                    transition: 'height 0.15s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* PTT Main Action Area */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onMouseDown={startPTT}
              onMouseUp={stopPTT}
              onTouchStart={startPTT}
              onTouchEnd={stopPTT}
              disabled={!isConnected || isMuted}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: !isConnected
                  ? 'radial-gradient(circle, #334155 0%, #1e293b 100%)'
                  : isTransmitting
                  ? 'radial-gradient(circle, #ef4444 0%, #991b1b 100%)'
                  : 'radial-gradient(circle, #0284c7 0%, #0369a1 100%)',
                border: isTransmitting ? '6px solid #fca5a5' : '6px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                cursor: isConnected && !isMuted ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyIn: 'center',
                justifyContent: 'center',
                boxShadow: isTransmitting
                  ? '0 0 40px rgba(239, 68, 68, 0.8)'
                  : isConnected
                  ? '0 10px 30px rgba(2, 132, 199, 0.5)'
                  : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Mic size={42} style={{ marginBottom: '6px' }} />
              <span style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                {isTransmitting ? 'TRANSMITTING...' : 'HOLD TO TALK'}
              </span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                {isConnected ? '(PUSH-TO-TALK)' : 'CONNECT TO CHANNEL'}
              </span>
            </button>
          </div>

          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {isConnected ? (
              <>
                <button
                  className={`btn ${isMuted ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={() => setIsMuted(!isMuted)}
                  style={{ flex: 1, gap: '0.4rem' }}
                >
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  {isMuted ? 'Unmute Mic' : 'Mute Mic'}
                </button>

                <button
                  className="btn btn-danger"
                  onClick={leaveChannel}
                  style={{ flex: 1, gap: '0.4rem' }}
                >
                  <LogOut size={16} /> Leave Channel
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => joinChannel(activeChannel)}
                style={{ width: '100%', gap: '0.5rem', padding: '0.75rem' }}
              >
                <Radio size={18} /> Connect to {activeChannel.name}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Channels Selector & Live Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Channels Selector Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={18} color="var(--accent-sky)" />
              Tactical Radio Channels
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {CHANNELS.map(ch => (
                <div
                  key={ch.id}
                  onClick={() => joinChannel(ch)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: activeChannel.id === ch.id ? '2px solid var(--accent-sky)' : '1px solid var(--border-color)',
                    background: activeChannel.id === ch.id ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{ch.name}</strong>
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'var(--border-color)', fontFamily: 'monospace' }}>
                        {ch.code}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {ch.description}
                    </p>
                  </div>
                  {activeChannel.id === ch.id && isConnected && (
                    <span className="badge badge-success">ACTIVE</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Transmission History / Live Log */}
          <div className="glass-card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Volume2 size={18} color="var(--accent-emerald)" />
              Channel Activity & Transmission Feed
            </h3>

            {recentTransmissions.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
                No active voice transmissions yet on {activeChannel.name}. Hold PTT button to transmit.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
                {recentTransmissions.map((t, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      background: t.sender === 'SYSTEM' ? 'rgba(255,255,255,0.03)' : 'rgba(56, 189, 248, 0.05)',
                      borderLeft: t.sender === 'SYSTEM' ? '3px solid #64748b' : '3px solid #38bdf8',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ color: t.sender === 'SYSTEM' ? '#94a3b8' : '#38bdf8' }}>{t.sender}: </strong>
                      <span>{t.message || 'Transmitted voice packet'}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {t.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmergencyRadio;
