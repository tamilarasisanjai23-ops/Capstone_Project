import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import {
  Radio,
  Mic,
  MicOff,
  Volume2,
  LogOut,
  Users,
  Signal,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import audioService from '../services/audioService';


/* =========================================================
   RADIO CHANNELS
   ========================================================= */

const CHANNELS = [
  {
    id: 1,
    name: 'Medical',
    code: 'CH-101',
    description:
      'Priority channel for emergency medical teams, triage, and doctor dispatch.'
  },
  {
    id: 2,
    name: 'Rescue',
    code: 'CH-102',
    description:
      'Search and rescue squad coordination, boat operations, and evacuation.'
  },
  {
    id: 3,
    name: 'Food Distribution',
    code: 'CH-103',
    description:
      'Supply chain dispatch, food ration delivery, and drinking water logistics.'
  },
  {
    id: 4,
    name: 'Transport',
    code: 'CH-104',
    description:
      'Heavy vehicle squad, ambulance routing, and debris clearance convoy.'
  },
  {
    id: 5,
    name: 'General Emergency',
    code: 'CH-105',
    description:
      'Main public emergency channel for general field updates and broadcasts.'
  }
];


/* =========================================================
   COMPONENT
   ========================================================= */

export const EmergencyRadio = ({
  currentUser
}) => {

  const [activeChannel, setActiveChannel] =
    useState(CHANNELS[0]);

  const [isConnected, setIsConnected] =
    useState(false);

  const [micPermitted, setMicPermitted] =
    useState(null);

  const [isMuted, setIsMuted] =
    useState(false);

  const [isTransmitting, setIsTransmitting] =
    useState(false);

  const [recentTransmissions, setRecentTransmissions] =
    useState([]);

  const [activeListenersCount, setActiveListenersCount] =
    useState(12);


  const channelManagerRef =
    useRef(null);

  const mediaRecorderRef =
    useRef(null);


  /* =======================================================
     CHECK MICROPHONE PERMISSION
     ======================================================= */

  useEffect(() => {

    let stream = null;

    if (
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {

      navigator.mediaDevices
        .getUserMedia({
          audio: true
        })
        .then((newStream) => {

          stream = newStream;

          setMicPermitted(true);

          newStream
            .getTracks()
            .forEach((track) => {
              track.stop();
            });

        })
        .catch(() => {

          setMicPermitted(false);

        });

    }
    else {

      setMicPermitted(false);

    }


    return () => {

      if (stream) {

        stream
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

      }

    };

  }, []);


  /* =======================================================
     CREATE / CLOSE RADIO CHANNEL MANAGER
     ======================================================= */

  useEffect(() => {

    if (!isConnected) {

      return;

    }


    if (channelManagerRef.current) {

      channelManagerRef.current.close();

      channelManagerRef.current = null;

    }


    channelManagerRef.current =
      audioService.createRadioChannelManager(
        activeChannel.name,
        (msg) => {

          if (!msg) {
            return;
          }


          setRecentTransmissions((prev) => {

            const alreadyExists =
              prev.some(
                (item) =>
                  item.messageId &&
                  msg.messageId &&
                  item.messageId ===
                    msg.messageId
              );


            if (alreadyExists) {

              return prev;

            }


            return [
              msg,
              ...prev.slice(0, 15)
            ];

          });


          audioService.playAlertBeep();

        }
      );


    setActiveListenersCount(12);


    return () => {

      if (channelManagerRef.current) {

        channelManagerRef.current.close();

        channelManagerRef.current = null;

      }

    };

  }, [
    isConnected,
    activeChannel
  ]);


  /* =======================================================
     JOIN CHANNEL
     ======================================================= */

  const joinChannel = (
    channel
  ) => {

    if (channelManagerRef.current) {

      channelManagerRef.current.close();

      channelManagerRef.current = null;

    }


    setActiveChannel(channel);

    setIsConnected(true);

    setIsTransmitting(false);


    setRecentTransmissions((prev) => [

      {
        sender: 'SYSTEM',
        audioData: null,
        message:
          `Joined ${channel.name} (${channel.code}) channel.`,
        timestamp:
          new Date().toLocaleTimeString()
      },

      ...prev.slice(0, 15)

    ]);

  };


  /* =======================================================
     LEAVE CHANNEL
     ======================================================= */

  const leaveChannel = () => {

    setIsConnected(false);

    setIsTransmitting(false);


    if (mediaRecorderRef.current) {

      try {

        mediaRecorderRef.current.cancel();

      }
      catch (error) {

        console.warn(
          'Recorder cleanup failed:',
          error
        );

      }

      mediaRecorderRef.current = null;

    }


    if (channelManagerRef.current) {

      channelManagerRef.current.close();

      channelManagerRef.current = null;

    }


    setActiveListenersCount(0);

  };


  /* =======================================================
     START PUSH-TO-TALK
     ======================================================= */

  const startPTT = async () => {

    if (
      !isConnected ||
      isMuted ||
      isTransmitting
    ) {

      return;

    }


    try {

      mediaRecorderRef.current =
        audioService.createVoiceRecorder();


      await mediaRecorderRef.current.start();


      setIsTransmitting(true);

    }
    catch (error) {

      console.error(
        'Radio recording start failed:',
        error
      );


      setIsTransmitting(false);


      alert(
        'Unable to transmit audio. Please allow microphone permission.'
      );

    }

  };


  /* =======================================================
     STOP PUSH-TO-TALK
     ======================================================= */

  const stopPTT = async () => {

    if (
      !isTransmitting ||
      !mediaRecorderRef.current
    ) {

      return;

    }


    setIsTransmitting(false);


    try {

      const recorded =
        await mediaRecorderRef.current.stop();


      mediaRecorderRef.current =
        null;


      if (
        !recorded ||
        !recorded.audioData
      ) {

        alert(
          'No audio was recorded.'
        );

        return;

      }


      if (
        !channelManagerRef.current
      ) {

        alert(
          'Radio channel is not connected.'
        );

        return;

      }


      const speakerName =
        currentUser?.name ||
        currentUser?.email ||
        'Field Unit';


      /* ================================================
         SEND AUDIO TO BACKEND
         ================================================ */

      const savedMessage =
        await channelManagerRef.current
          .transmitAudioMessage(
            speakerName,
            recorded.audioData
          );


      /* ================================================
         SHOW OWN TRANSMISSION IMMEDIATELY
         ================================================ */

      setRecentTransmissions((prev) => [

        {
          messageId:
            savedMessage?.messageId ||
            `local-${Date.now()}`,

          sender:
            speakerName,

          audioData:
            recorded.audioData,

          message:
            'Voice transmission sent successfully.',

          timestamp:
            new Date().toLocaleTimeString()

        },

        ...prev.slice(0, 15)

      ]);


      audioService.playAlertBeep();

    }
    catch (error) {

      console.error(
        'Radio transmission failed:',
        error
      );


      alert(
        'Radio transmission failed: ' +
        (
          error?.message ||
          'Unknown error'
        )
      );

    }

  };


  /* =======================================================
     HANDLE CHANNEL SELECTION
     ======================================================= */

  const handleChannelSelect = (
    channel
  ) => {

    if (
      activeChannel.id === channel.id &&
      isConnected
    ) {

      return;

    }


    joinChannel(channel);

  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <div
      className="emergency-radio-page"
      style={{
        padding: '1rem'
      }}
    >

      {/* ===================================================
           HEADER
           =================================================== */}

      <div
        className="page-header"
        style={{
          marginBottom: '1.5rem'
        }}
      >

        <div className="page-title-group">

          <h1>

            <Radio
              size={28}
              color="var(--accent-rose)"
              style={{
                display: 'inline',
                marginRight: '8px',
                verticalAlign: 'middle'
              }}
            />

            Emergency Radio / Push-to-Talk (PTT)

          </h1>


          <p>

            Real-time tactical audio walkie-talkie
            channels for field squads and emergency
            operators.

          </p>

        </div>


        <div className="header-actions">

          {micPermitted === false && (

            <span
              className="badge badge-critical"
              style={{
                padding: '0.5rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >

              <AlertCircle size={14} />

              Mic Permission Denied

            </span>

          )}


          {micPermitted === true && (

            <span
              className="badge badge-success"
              style={{
                padding: '0.5rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >

              <CheckCircle size={14} />

              Microphone Ready

            </span>

          )}

        </div>

      </div>


      {/* ===================================================
           MAIN LAYOUT
           =================================================== */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >


        {/* =================================================
             LEFT COLUMN
             ================================================= */}

        <div
          className="glass-card"
          style={{
            background:
              'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
            borderRadius: '20px',
            border:
              '2px solid rgba(255, 255, 255, 0.1)',
            padding: '1.75rem',
            boxShadow:
              '0 20px 40px rgba(0,0,0,0.5)',
            maxWidth: '460px',
            margin: '0 auto',
            width: '100%'
          }}
        >


          {/* =============================================
               RADIO SCREEN
               ============================================= */}

          <div
            style={{
              background: '#090d16',
              border:
                '2px solid #334155',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              fontFamily: 'monospace'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color:
                    isConnected
                      ? '#10b981'
                      : '#f43f5e'
                }}
              >

                <Signal
                  size={18}
                  className={
                    isConnected
                      ? 'animate-pulse'
                      : ''
                  }
                />


                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}
                >

                  {
                    isConnected
                      ? 'ONLINE / CONNECTED'
                      : 'OFFLINE / DISCONNECTED'
                  }

                </span>

              </div>


              <span
                style={{
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >

                <Users size={14} />

                {
                  isConnected
                    ? activeListenersCount
                    : 0
                }

                Active

              </span>

            </div>


            <div
              style={{
                textAlign: 'center',
                padding: '0.75rem 0'
              }}
            >

              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >

                SELECTED CHANNEL

              </div>


              <div
                style={{
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  color: '#38bdf8',
                  letterSpacing: '1px'
                }}
              >

                {
                  activeChannel.code
                }

                {' - '}

                {
                  activeChannel.name.toUpperCase()
                }

              </div>


              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  marginTop: '4px'
                }}
              >

                {
                  activeChannel.description
                }

              </div>

            </div>


            {/* ===========================================
                 AUDIO VISUALIZER
                 =========================================== */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                height: '28px',
                marginTop: '0.5rem'
              }}
            >

              {[
                40,
                70,
                30,
                90,
                60,
                100,
                50,
                80,
                35,
                65,
                85,
                45
              ].map(
                (value, index) => (

                  <div
                    key={index}
                    style={{
                      width: '4px',
                      height:
                        isTransmitting
                          ? `${value}%`
                          : isConnected
                          ? '15%'
                          : '5%',
                      background:
                        isTransmitting
                          ? '#ef4444'
                          : isConnected
                          ? '#38bdf8'
                          : '#334155',
                      borderRadius: '2px',
                      transition:
                        'height 0.15s ease'
                    }}
                  />

                )
              )}

            </div>

          </div>


          {/* =============================================
               PTT BUTTON
               ============================================= */}

          <div
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}
          >

            <button
              type="button"

              onMouseDown={startPTT}
              onMouseUp={stopPTT}
              onMouseLeave={() => {

                if (isTransmitting) {

                  stopPTT();

                }

              }}

              onTouchStart={(event) => {

                event.preventDefault();

                startPTT();

              }}

              onTouchEnd={(event) => {

                event.preventDefault();

                stopPTT();

              }}

              disabled={
                !isConnected ||
                isMuted
              }

              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background:
                  !isConnected
                    ? 'radial-gradient(circle, #334155 0%, #1e293b 100%)'
                    : isTransmitting
                    ? 'radial-gradient(circle, #ef4444 0%, #991b1b 100%)'
                    : 'radial-gradient(circle, #0284c7 0%, #0369a1 100%)',
                border:
                  isTransmitting
                    ? '6px solid #fca5a5'
                    : '6px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                cursor:
                  isConnected && !isMuted
                    ? 'pointer'
                    : 'not-allowed',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  isTransmitting
                    ? '0 0 40px rgba(239, 68, 68, 0.8)'
                    : isConnected
                    ? '0 10px 30px rgba(2, 132, 199, 0.5)'
                    : 'none',
                transition:
                  'all 0.15s ease',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            >

              <Mic
                size={42}
                style={{
                  marginBottom: '6px'
                }}
              />


              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: '800',
                  letterSpacing: '0.5px'
                }}
              >

                {
                  isTransmitting
                    ? 'TRANSMITTING...'
                    : 'HOLD TO TALK'
                }

              </span>


              <span
                style={{
                  fontSize: '0.7rem',
                  opacity: 0.8,
                  marginTop: '2px'
                }}
              >

                {
                  isConnected
                    ? '(PUSH-TO-TALK)'
                    : 'CONNECT TO CHANNEL'
                }

              </span>

            </button>

          </div>


          {/* =============================================
               CONTROLS
               ============================================= */}

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center'
            }}
          >

            {isConnected ? (

              <>

                <button
                  className={
                    `btn ${
                      isMuted
                        ? 'btn-danger'
                        : 'btn-secondary'
                    }`
                  }

                  onClick={() =>
                    setIsMuted(
                      !isMuted
                    )
                  }

                  style={{
                    flex: 1,
                    gap: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >

                  {
                    isMuted
                      ? <MicOff size={16} />
                      : <Mic size={16} />
                  }

                  {
                    isMuted
                      ? 'Unmute Mic'
                      : 'Mute Mic'
                  }

                </button>


                <button
                  className="btn btn-danger"

                  onClick={
                    leaveChannel
                  }

                  style={{
                    flex: 1,
                    gap: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >

                  <LogOut size={16} />

                  Leave Channel

                </button>

              </>

            ) : (

              <button
                className="btn btn-primary"

                onClick={() =>
                  joinChannel(
                    activeChannel
                  )
                }

                style={{
                  width: '100%',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >

                <Radio size={18} />

                Connect to {
                  activeChannel.name
                }

              </button>

            )}

          </div>

        </div>


        {/* =================================================
             RIGHT COLUMN
             ================================================= */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >


          {/* =============================================
               CHANNEL SELECTOR
               ============================================= */}

          <div className="glass-card">

            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >

              <Radio
                size={18}
                color="var(--accent-sky)"
              />

              Tactical Radio Channels

            </h3>


            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}
            >

              {CHANNELS.map(
                (channel) => (

                  <div
                    key={channel.id}

                    onClick={() =>
                      handleChannelSelect(
                        channel
                      )
                    }

                    style={{
                      padding:
                        '0.85rem 1rem',
                      borderRadius:
                        '10px',
                      border:
                        activeChannel.id ===
                        channel.id
                          ? '2px solid var(--accent-sky)'
                          : '1px solid var(--border-color)',
                      background:
                        activeChannel.id ===
                        channel.id
                          ? 'rgba(56, 189, 248, 0.08)'
                          : 'transparent',
                      cursor:
                        'pointer',
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'space-between',
                      transition:
                        'all 0.2s ease'
                    }}
                  >

                    <div>

                      <div
                        style={{
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap:
                            '0.5rem'
                        }}
                      >

                        <strong
                          style={{
                            fontSize:
                              '0.95rem'
                          }}
                        >

                          {
                            channel.name
                          }

                        </strong>


                        <span
                          style={{
                            fontSize:
                              '0.75rem',
                            padding:
                              '0.15rem 0.4rem',
                            borderRadius:
                              '4px',
                            background:
                              'var(--border-color)',
                            fontFamily:
                              'monospace'
                          }}
                        >

                          {
                            channel.code
                          }

                        </span>

                      </div>


                      <p
                        style={{
                          margin:
                            '4px 0 0 0',
                          fontSize:
                            '0.8rem',
                          color:
                            'var(--text-muted)'
                        }}
                      >

                        {
                          channel.description
                        }

                      </p>

                    </div>


                    {
                      activeChannel.id ===
                        channel.id &&
                      isConnected && (

                        <span
                          className="badge badge-success"
                        >

                          ACTIVE

                        </span>

                      )
                    }

                  </div>

                )
              )}

            </div>

          </div>


          {/* =============================================
               TRANSMISSION FEED
               ============================================= */}

          <div
            className="glass-card"
            style={{
              flex: 1
            }}
          >

            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >

              <Volume2
                size={18}
                color="var(--accent-emerald)"
              />

              Channel Activity & Transmission Feed

            </h3>


            {
              recentTransmissions.length ===
              0 ? (

                <p
                  style={{
                    fontSize: '0.85rem',
                    color:
                      'var(--text-muted)',
                    textAlign:
                      'center',
                    padding:
                      '1.5rem 0'
                  }}
                >

                  No active voice
                  transmissions yet on
                  {' '}
                  {
                    activeChannel.name
                  }.
                  {' '}
                  Hold PTT button
                  to transmit.

                </p>

              ) : (

                <div
                  style={{
                    display:
                      'flex',
                    flexDirection:
                      'column',
                    gap:
                      '0.5rem',
                    maxHeight:
                      '320px',
                    overflowY:
                      'auto'
                  }}
                >

                  {
                    recentTransmissions.map(
                      (transmission, index) => (

                        <div
                          key={
                            transmission.messageId ||
                            index
                          }

                          style={{
                            padding:
                              '0.6rem 0.85rem',
                            borderRadius:
                              '8px',
                            background:
                              transmission.sender ===
                              'SYSTEM'
                                ? 'rgba(255,255,255,0.03)'
                                : 'rgba(56, 189, 248, 0.05)',
                            borderLeft:
                              transmission.sender ===
                              'SYSTEM'
                                ? '3px solid #64748b'
                                : '3px solid #38bdf8',
                            fontSize:
                              '0.85rem'
                          }}
                        >

                          <div
                            style={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              justifyContent:
                                'space-between',
                              gap:
                                '0.75rem'
                            }}
                          >

                            <div>

                              <strong
                                style={{
                                  color:
                                    transmission.sender ===
                                    'SYSTEM'
                                      ? '#94a3b8'
                                      : '#38bdf8'
                                }}
                              >

                                {
                                  transmission.sender ||
                                  'Unknown'
                                }

                                :&nbsp;

                              </strong>


                              <span>

                                {
                                  transmission.message ||
                                  'Voice transmission'
                                }

                              </span>

                            </div>


                            <span
                              style={{
                                fontSize:
                                  '0.75rem',
                                color:
                                  'var(--text-muted)',
                                fontFamily:
                                  'monospace',
                                whiteSpace:
                                  'nowrap'
                              }}
                            >

                              {
                                transmission.timestamp ||
                                ''
                              }

                            </span>

                          </div>


                          {
                            transmission.audioData && (

                              <audio
                                controls
                                src={
                                  transmission.audioData
                                }

                                style={{
                                  width:
                                    '100%',
                                  marginTop:
                                    '8px'
                                }}
                              />

                            )
                          }

                        </div>

                      )
                    )
                  }

                </div>

              )
            }

          </div>

        </div>

      </div>

    </div>

  );

};


export default EmergencyRadio;