// Audio + Emergency Radio Service

let audioCtx = null;
let sirenOscillator = null;
let sirenGain = null;
let sirenInterval = null;

const BACKEND_URL =
    "https://capstone-project-c6bv.onrender.com";


const getAudioContext = () => {

    if (!audioCtx) {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (AudioContextClass) {

            audioCtx =
                new AudioContextClass();

        }

    }


    if (
        audioCtx &&
        audioCtx.state === "suspended"
    ) {

        audioCtx.resume();

    }


    return audioCtx;
};


export const audioService = {


    // =====================================================
    // EMERGENCY SIREN
    // =====================================================

    playEmergencySiren: () => {

        try {

            const ctx =
                getAudioContext();

            if (!ctx) {
                return;
            }


            audioService.stopEmergencySiren();


            sirenOscillator =
                ctx.createOscillator();


            sirenGain =
                ctx.createGain();


            sirenOscillator.type =
                "sawtooth";


            sirenOscillator.frequency
                .setValueAtTime(
                    600,
                    ctx.currentTime
                );


            sirenGain.gain
                .setValueAtTime(
                    0.15,
                    ctx.currentTime
                );


            sirenOscillator.connect(
                sirenGain
            );


            sirenGain.connect(
                ctx.destination
            );


            sirenOscillator.start();


            let high =
                false;


            sirenInterval =
                setInterval(
                    () => {

                        if (
                            !sirenOscillator ||
                            !audioCtx
                        ) {

                            return;

                        }


                        const targetFreq =
                            high
                                ? 600
                                : 960;


                        sirenOscillator.frequency
                            .setTargetAtTime(
                                targetFreq,
                                audioCtx.currentTime,
                                0.15
                            );


                        high =
                            !high;

                    },
                    400
                );

        }
        catch (error) {

            console.warn(
                "Siren error:",
                error
            );

        }

    },


    // =====================================================
    // STOP SIREN
    // =====================================================

    stopEmergencySiren: () => {

        if (sirenInterval) {

            clearInterval(
                sirenInterval
            );

            sirenInterval =
                null;

        }


        if (sirenOscillator) {

            try {

                sirenOscillator.stop();

                sirenOscillator.disconnect();

            }
            catch (error) {
            }


            sirenOscillator =
                null;

        }


        if (sirenGain) {

            try {

                sirenGain.disconnect();

            }
            catch (error) {
            }


            sirenGain =
                null;

        }

    },


    // =====================================================
    // ALERT BEEP
    // =====================================================

    playAlertBeep: () => {

        try {

            const ctx =
                getAudioContext();

            if (!ctx) {
                return;
            }


            const osc =
                ctx.createOscillator();


            const gain =
                ctx.createGain();


            osc.type =
                "sine";


            osc.frequency
                .setValueAtTime(
                    880,
                    ctx.currentTime
                );


            gain.gain
                .setValueAtTime(
                    0.1,
                    ctx.currentTime
                );


            gain.gain
                .exponentialRampToValueAtTime(
                    0.001,
                    ctx.currentTime + 0.5
                );


            osc.connect(
                gain
            );


            gain.connect(
                ctx.destination
            );


            osc.start();


            osc.stop(
                ctx.currentTime + 0.5
            );

        }
        catch (error) {
        }

    },


    // =====================================================
    // VOICE RECORDER
    // =====================================================

    createVoiceRecorder: () => {

        let mediaRecorder =
            null;

        let audioChunks =
            [];

        let startTime =
            0;

        let stream =
            null;


        return {

            start: async () => {

                if (
                    !navigator.mediaDevices ||
                    !navigator.mediaDevices
                        .getUserMedia
                ) {

                    throw new Error(
                        "Microphone access is not supported."
                    );

                }


                stream =
                    await navigator
                        .mediaDevices
                        .getUserMedia({
                            audio: true
                        });


                audioChunks =
                    [];


                mediaRecorder =
                    new MediaRecorder(
                        stream
                    );


                startTime =
                    Date.now();


                mediaRecorder.ondataavailable =
                    (event) => {

                        if (
                            event.data &&
                            event.data.size > 0
                        ) {

                            audioChunks.push(
                                event.data
                            );

                        }

                    };


                mediaRecorder.start();

            },


            stop: () => {

                return new Promise(
                    (resolve, reject) => {

                        if (!mediaRecorder) {

                            reject(
                                new Error(
                                    "Recorder not initialized"
                                )
                            );

                            return;

                        }


                        const duration =
                            Math.round(
                                (
                                    Date.now() -
                                    startTime
                                ) / 1000
                            );


                        mediaRecorder.onstop =
                            () => {

                                const audioBlob =
                                    new Blob(
                                        audioChunks,
                                        {
                                            type:
                                                "audio/webm"
                                        }
                                    );


                                const reader =
                                    new FileReader();


                                reader.readAsDataURL(
                                    audioBlob
                                );


                                reader.onloadend =
                                    () => {

                                        if (stream) {

                                            stream
                                                .getTracks()
                                                .forEach(
                                                    track =>
                                                        track.stop()
                                                );

                                        }


                                        resolve({

                                            audioData:
                                                reader.result,

                                            duration:
                                                duration || 1,

                                            blob:
                                                audioBlob

                                        });

                                    };

                            };


                        mediaRecorder.stop();

                    }
                );

            },


            cancel: () => {

                if (
                    mediaRecorder &&
                    mediaRecorder.state !==
                    "inactive"
                ) {

                    mediaRecorder.stop();

                }


                if (stream) {

                    stream
                        .getTracks()
                        .forEach(
                            track =>
                                track.stop()
                        );

                }

            }

        };

    },


    // =====================================================
    // REAL BACKEND RADIO CHANNEL MANAGER
    // =====================================================

    createRadioChannelManager:
        (channelName, onAudioMessage) => {

            let pollingTimer =
                null;

            let closed =
                false;

            const seenMessageIds =
                new Set();


            // ---------------------------------------------
            // PLAY RECEIVED AUDIO
            // ---------------------------------------------

            const playIncomingAudio =
                (audioData) => {

                    if (!audioData) {
                        return;
                    }


                    try {

                        const audio =
                            new Audio(
                                audioData
                            );

                        audio.play()
                            .catch(
                                () => {}
                            );

                    }
                    catch (error) {

                        console.warn(
                            "Incoming radio audio error:",
                            error
                        );

                    }

                };


            // ---------------------------------------------
            // LOAD MESSAGES
            // ---------------------------------------------

            const loadMessages =
                async () => {

                    if (closed) {
                        return;
                    }


                    try {

                        const response =
                            await fetch(
                                BACKEND_URL +
                                "/api/radio-messages?channelName=" +
                                encodeURIComponent(
                                    channelName
                                )
                            );


                        if (!response.ok) {

                            throw new Error(
                                "Failed to load radio messages"
                            );

                        }


                        const messages =
                            await response.json();


                        if (
                            !Array.isArray(messages)
                        ) {

                            return;
                        }


                        const ordered =
                            [...messages]
                                .reverse();


                        ordered.forEach(
                            (message) => {

                                if (
                                    !message.messageId ||
                                    seenMessageIds.has(
                                        message.messageId
                                    )
                                ) {

                                    return;

                                }


                                seenMessageIds.add(
                                    message.messageId
                                );


                                const mappedMessage = {

                                    sender:
                                        message.senderName,

                                    audioData:
                                        message.audioData,

                                    message:
                                        message.audioData
                                            ? "Voice transmission"
                                            : "Radio message",

                                    timestamp:
                                        message.createdAt
                                            ? new Date(
                                                message.createdAt
                                            )
                                                .toLocaleTimeString()
                                            : new Date()
                                                .toLocaleTimeString()

                                };


                                if (
                                    onAudioMessage
                                ) {

                                    onAudioMessage(
                                        mappedMessage
                                    );

                                }


                                playIncomingAudio(
                                    message.audioData
                                );

                            }
                        );

                    }
                    catch (error) {

                        console.warn(
                            "Radio polling error:",
                            error
                        );

                    }

                };


            // Start polling every 2 seconds
            pollingTimer =
                setInterval(
                    loadMessages,
                    2000
                );


            // Load immediately
            loadMessages();


            return {

                // -----------------------------------------
                // MICROPHONE PERMISSION
                // -----------------------------------------

                requestMicPermission:
                    async () => {

                        if (
                            !navigator.mediaDevices ||
                            !navigator.mediaDevices
                                .getUserMedia
                        ) {

                            return false;

                        }


                        try {

                            const stream =
                                await navigator
                                    .mediaDevices
                                    .getUserMedia({
                                        audio: true
                                    });


                            stream
                                .getTracks()
                                .forEach(
                                    track =>
                                        track.stop()
                                );


                            return true;

                        }
                        catch (error) {

                            return false;

                        }

                    },


                // -----------------------------------------
                // SEND AUDIO TO BACKEND
                // -----------------------------------------

                transmitAudioMessage:
                    async (
                        speakerName,
                        base64Audio
                    ) => {

                        try {

                            const response =
                                await fetch(
                                    BACKEND_URL +
                                    "/api/radio-messages",
                                    {

                                        method:
                                            "POST",

                                        headers: {

                                            "Content-Type":
                                                "application/json"

                                        },

                                        body:
                                            JSON.stringify({

                                                channelName:
                                                    channelName,

                                                senderName:
                                                    speakerName,

                                                audioData:
                                                    base64Audio

                                            })

                                    }
                                );


                            if (!response.ok) {

                                throw new Error(
                                    "Radio transmission failed"
                                );

                            }


                            const saved =
                                await response.json();


                            // Prevent own message
                            // from being processed twice
                            if (
                                saved &&
                                saved.messageId
                            ) {

                                seenMessageIds.add(
                                    saved.messageId
                                );

                            }


                            return saved;

                        }
                        catch (error) {

                            console.error(
                                "Radio transmission error:",
                                error
                            );


                            throw error;

                        }

                    },


                // -----------------------------------------
                // CLOSE CHANNEL
                // -----------------------------------------

                close: () => {

                    closed =
                        true;


                    if (pollingTimer) {

                        clearInterval(
                            pollingTimer
                        );

                        pollingTimer =
                            null;

                    }

                }

            };

        }

};


export default audioService;