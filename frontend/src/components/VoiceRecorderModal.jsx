import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Send, X, Radio, AlertCircle } from 'lucide-react';
import audioService from '../services/audioService';
import { apiService } from '../services/apiService';

export const VoiceRecorderModal = ({ isOpen, onClose, onVoiceSent, currentUser }) => {
  const [recording, setRecording] = useState(false);
  const [recordedData, setRecordedData] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingPreview, setPlayingPreview] = useState(false);
  const [title, setTitle] = useState('Commander Voice Dispatch');
  const [alertLevel, setAlertLevel] = useState('HIGH');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const audioPreviewRef = useRef(null);

  if (!isOpen) return null;
  console.log("VoiceRecorderModal isOpen:", isOpen);

  const startRecording = async () => {
    setErrorMsg('');
    try {
      recorderRef.current = audioService.createVoiceRecorder();
      await recorderRef.current.start();
      setRecording(true);
      setRecordingTime(0);
      setRecordedData(null);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Microphone permission denied or unavailable.');
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);
    if (recorderRef.current) {
      try {
        const result = await recorderRef.current.stop();
        setRecordedData(result);
      } catch (e) {
        setErrorMsg('Failed to process voice recording.');
      }
    }
  };

  const togglePreview = () => {
    if (!recordedData?.audioData) return;
    if (playingPreview) {
      if (audioPreviewRef.current) audioPreviewRef.current.pause();
      setPlayingPreview(false);
    } else {
      audioPreviewRef.current = new Audio(recordedData.audioData);
      audioPreviewRef.current.play();
      setPlayingPreview(true);
      audioPreviewRef.current.onended = () => setPlayingPreview(false);
    }
  };

  const handleSendVoiceAlert = async (e) => {
    e.preventDefault();
    if (!recordedData) {
      setErrorMsg('Please record a voice message first!');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title || 'Emergency Voice Broadcast',
        audio_data: recordedData.audioData,
        duration: recordedData.duration || recordingTime || 1,
        alert_level: alertLevel,
        created_by: currentUser?.user_id || 1
      };

      const newAlert = await apiService.createVoiceAlert(payload);
      if (onVoiceSent) onVoiceSent(newAlert);

      // Clean up state
      setRecordedData(null);
      setRecordingTime(0);
      onClose();
    } catch (err) {
      setErrorMsg('Failed to publish voice alert.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.2rem' }}>
            <Radio size={20} color="var(--accent-rose)" />
            Record Emergency Voice Alert
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSendVoiceAlert}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Voice Broadcast Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Commander Flood Evacuation Order"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Emergency Alert Level</label>
            <select
              className="form-input"
              value={alertLevel}
              onChange={e => setAlertLevel(e.target.value)}
            >
              <option value="LOW">LOW - Information / Guidance</option>
              <option value="MEDIUM">MEDIUM - Caution / Preparedness</option>
              <option value="HIGH">HIGH - Urgent Action Required</option>
              <option value="CRITICAL">CRITICAL - Severe Life-Safety Danger</option>
            </select>
          </div>

          {/* Recording Studio Box */}
          <div style={{
            background: 'var(--bg-card-secondary, rgba(255,255,255,0.04))',
            border: '1px dashed var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            {recording ? (
              <div>
                <div className="pulse-beacon-red" style={{ width: '20px', height: '20px', background: '#ef4444', borderRadius: '50%', margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ color: '#ef4444', margin: '0 0 0.25rem 0' }}>RECORDING LIVE AUDIO</h4>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'monospace', margin: '0 0 1rem 0' }}>
                  00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}
                </p>
                <button type="button" className="btn btn-danger" onClick={stopRecording} style={{ gap: '0.5rem' }}>
                  <Square size={16} /> Stop Recording
                </button>
              </div>
            ) : recordedData ? (
              <div>
                <h4 style={{ color: 'var(--accent-emerald)', margin: '0 0 0.5rem 0' }}>Voice Message Recorded!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                  Duration: {recordedData.duration} seconds
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={togglePreview}>
                    {playingPreview ? <Pause size={15} /> : <Play size={15} />}
                    {playingPreview ? 'Pause Preview' : 'Play Preview'}
                  </button>

                  <button type="button" className="btn btn-secondary btn-sm" onClick={startRecording}>
                    <Mic size={15} /> Re-record
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <Mic size={36} color="var(--accent-indigo)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Click below to begin recording emergency audio dispatch
                </p>
                <button type="button" className="btn btn-primary" onClick={startRecording} style={{ gap: '0.5rem' }}>
                  <Mic size={16} /> Start Microphone Recording
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-emerald" disabled={!recordedData || loading}>
              <Send size={16} /> {loading ? 'Publishing...' : 'Broadcast Voice Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoiceRecorderModal;
