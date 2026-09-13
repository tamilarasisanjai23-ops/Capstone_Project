// Web Audio API & MediaRecorder Utility for Volunteer Disaster Relief System

let audioCtx = null;
let sirenOscillator = null;
let sirenGain = null;
let sirenInterval = null;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const audioService = {
  // 1. Critical Siren Generator using Web Audio API
  playEmergencySiren: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      audioService.stopEmergencySiren();

      sirenOscillator = ctx.createOscillator();
      sirenGain = ctx.createGain();

      sirenOscillator.type = 'sawtooth';
      sirenOscillator.frequency.setValueAtTime(600, ctx.currentTime);
      sirenGain.gain.setValueAtTime(0.15, ctx.currentTime);

      sirenOscillator.connect(sirenGain);
      sirenGain.connect(ctx.destination);

      sirenOscillator.start();

      let high = false;
      sirenInterval = setInterval(() => {
        if (!sirenOscillator || !audioCtx) return;
        const targetFreq = high ? 600 : 960;
        sirenOscillator.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.15);
        high = !high;
      }, 400);
    } catch (err) {
      console.warn('Audio siren playback failed:', err);
    }
  },

  stopEmergencySiren: () => {
    if (sirenInterval) {
      clearInterval(sirenInterval);
      sirenInterval = null;
    }
    if (sirenOscillator) {
      try {
        sirenOscillator.stop();
        sirenOscillator.disconnect();
      } catch (e) {}
      sirenOscillator = null;
    }
    if (sirenGain) {
      try {
        sirenGain.disconnect();
      } catch (e) {}
      sirenGain = null;
    }
  },

  // Play a quick alert beep
  playAlertBeep: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  },

  // 2. Microphone Recorder using MediaRecorder API
  createVoiceRecorder: () => {
    let mediaRecorder = null;
    let audioChunks = [];
    let startTime = 0;
    let stream = null;

    return {
      start: async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Microphone access is not supported in this browser environment.');
        }

        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];
        mediaRecorder = new MediaRecorder(stream);
        startTime = Date.now();

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.start();
      },

      stop: () => {
        return new Promise((resolve, reject) => {
          if (!mediaRecorder) {
            return reject(new Error('Recorder not initialized'));
          }

          const duration = Math.round((Date.now() - startTime) / 1000);

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
              const base64Data = reader.result;
              // Stop stream tracks
              if (stream) {
                stream.getTracks().forEach(track => track.stop());
              }
              resolve({
                audioData: base64Data,
                duration: duration || 1,
                blob: audioBlob
              });
            };
          };

          mediaRecorder.stop();
        });
      },

      cancel: () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  },

  // 3. Emergency Radio Audio Visualizer & Channel Broadcaster
  createRadioChannelManager: (channelName, onAudioMessage) => {
    const broadcast = new BroadcastChannel(`vdr_radio_${channelName.toLowerCase().replace(/\s+/g, '_')}`);
    let localStream = null;

    broadcast.onmessage = (event) => {
      if (onAudioMessage && event.data) {
        onAudioMessage(event.data);
      }
    };

    return {
      requestMicPermission: async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          return false;
        }
        try {
          const testStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          testStream.getTracks().forEach(track => track.stop());
          return true;
        } catch (e) {
          return false;
        }
      },

      transmitAudioMessage: (speakerName, base64Audio) => {
        broadcast.postMessage({
          sender: speakerName,
          audioData: base64Audio,
          timestamp: new Date().toLocaleTimeString()
        });
      },

      close: () => {
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }
        broadcast.close();
      }
    };
  }
};

export default audioService;
