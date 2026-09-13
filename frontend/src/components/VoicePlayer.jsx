import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Volume2, Radio, Clock } from 'lucide-react';
import Badge from './Badge';

export const VoicePlayer = ({ voiceAlert }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(voiceAlert?.duration || 0);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(voiceAlert.audio_data);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.round(audio.duration));
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(Math.round(audio.currentTime));
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [voiceAlert]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.warn('Audio playback prevented:', err));
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="voice-player-card glass-card" style={{
      padding: '1rem 1.25rem',
      borderRadius: '12px',
      borderLeft: `4px solid ${
        voiceAlert.alert_level === 'CRITICAL' ? '#ef4444' :
        voiceAlert.alert_level === 'HIGH' ? '#f97316' : '#3b82f6'
      }`,
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio size={18} color="var(--accent-rose)" />
          <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{voiceAlert.title}</strong>
        </div>
        <Badge variant={voiceAlert.alert_level || 'HIGH'}>
          {voiceAlert.alert_level || 'HIGH'} VOICE ALERT
        </Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
        {/* Controls */}
        <button
          className={`btn ${isPlaying ? 'btn-amber' : 'btn-primary'} btn-sm`}
          onClick={handlePlayPause}
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={isPlaying ? 'Pause Voice Message' : 'Play Voice Message'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={handleStop}
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Stop Audio"
        >
          <Square size={14} />
        </button>

        {/* Timeline / Progress Bar */}
        <div style={{ flex: 1, margin: '0 0.5rem' }}>
          <div style={{ background: 'var(--border-color)', height: '6px', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent-sky)', transition: 'width 0.2s linear' }} />
          </div>
        </div>

        {/* Duration Readout */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={12} />
          <span>{currentTime}s / {duration}s</span>
        </div>
      </div>
    </div>
  );
};

export default VoicePlayer;
