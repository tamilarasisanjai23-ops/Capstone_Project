// ============================================================
// AUDIO + EMERGENCY RADIO SERVICE
// ============================================================

let audioCtx = null;
let sirenOscillator = null;
let sirenGain = null;
let sirenInterval = null;

const BACKEND_URL =
    "https://capstone-project-c6bv.onrender.com";


// ============================================================
// GET AUDIO CONTEXT
// ============================================================

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


// ============================================================
// AUDIO SERVICE
// ============================================================

export const audioService = {


    // ========================================================
    // EMERGENCY SIREN
    // ========================================================

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
                setInterval(() => {

                    if (
                        !sirenOscillator ||
                        !audioCtx
                    ) {

                        return;

                    }


                    const targetFrequency =
                        high
                            ? 600
                            : 960;


                    sirenOscillator.frequency
                        .setTargetAtTime(
                            targetFrequency,
                            audioCtx.currentTime,
                            0.15
                        );


                    high =
                        !high;

                }, 400);

        }
        catch (error) {

            console.warn(
                "Emergency siren error:",
                error
            );

        }

    },


    // ========================================================
    // STOP EMERGENCY SIREN
    // ========================================================

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
                // Ignore cleanup error
            }


            sirenOscillator =
                null;

        }


        if (sirenGain) {

            try {

                sirenGain.disconnect();

            }
            catch (error) {
                // Ignore cleanup error
            }


            sirenGain =
                null;

        }

    },


    // ========================================================
    // ALERT BEEP
    // ========================================================

    playAlertBeep: () => {

        try {

            const ctx =
                getAudioContext();

            if (!ctx) {
                return;
            }


            const oscillator =
                ctx.createOscillator();


            const gain =
                ctx.createGain();


            oscillator.type =
                "sine";


            oscillator.frequency
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


            oscillator.connect(
                gain
            );


            gain.connect(
                ctx.destination
            );


            oscillator.start();


            oscillator.stop(
                ctx.currentTime + 0.5
            );

        }
        catch (error) {
            // Ignore beep error
        }

    },


    // ========================================================
    // VOICE RECORDER
    // ========================================================

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


            // ------------------------------------------------
            // START RECORDING
            // ------------------------------------------------

            start: async () => {

                if (
                    !navigator.mediaDevices ||
                    !navigator.mediaDevices
                        .getUserMedia
                ) {

                    throw new Error(
                        "Microphone access is not supported in this browser."
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


            // ------------------------------------------------
            // STOP RECORDING
            // ------------------------------------------------

            stop: () => {

                return new Promise(
                    (resolve, reject) => {

                        if (!mediaRecorder) {

                            reject(
                                new Error(
                                    "Recorder not initialized."
                                )
                            );

                            return;

                        }


                        const duration =
                            Math.max(
                                1,
                                Math.round(
                                    (
                                        Date.now() -
                                        startTime
                                    ) / 1000
                                )
                            );


                        mediaRecorder.onstop =
                            () => {

                                try {

                                    const audioBlob =
                                        new Blob(
                                            audioChunks,
                                            {
                                                type:
                                                    mediaRecorder.mimeType ||
                                                    "audio/webm"
                                            }
                                        );


                                    const reader =
                                        new FileReader();


                                    reader.onloadend =
                                        () => {

                                            if (stream) {

                                                stream
                                                    .getTracks()
                                                    .forEach(
                                                        track => {
                                                            track.stop();
                                                        }
                                                    );

                                            }


                                            resolve({

                                                audioData:
                                                    reader.result,

                                                duration:
                                                    duration,

                                                blob:
                                                    audioBlob

                                            });

                                        };


                                    reader.onerror =
                                        () => {

                                            reject(
                                                new Error(
                                                    "Failed to read recorded audio."
                                                )
                                            );

                                        };


                                    reader.readAsDataURL(
                                        audioBlob
                                    );

                                }
                                catch (error) {

                                    reject(
                                        error
                                    );

                                }

                            };


                        mediaRecorder.stop();

                    }
                );

            },


            // ------------------------------------------------
            // CANCEL RECORDING
            // ------------------------------------------------

            cancel: () => {

                try {

                    if (
                        mediaRecorder &&
                        mediaRecorder.state !==
                        "inactive"
                    ) {

                        mediaRecorder.stop();

                    }

                }
                catch (error) {
                    // Ignore cleanup error
                }


                if (stream) {

                    stream
                        .getTracks()
                        .forEach(
                            track => {
                                track.stop();
                            }
                        );

                }

            }

        };

    },


    // ========================================================
    // REAL BACKEND RADIO CHANNEL MANAGER
    // ========================================================

    createRadioChannelManager:
        (
            channelName,
            onAudioMessage
        ) => {


        let pollingTimer =
            null;


        let closed =
            false;


        const seenMessageIds =
            new Set();


        // ----------------------------------------------------
        // LOAD RADIO MESSAGES
        // ----------------------------------------------------

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
                            ),
                            {
                                method:
                                    "GET",

                                headers: {
                                    "Accept":
                                        "application/json"
                                }
                            }
                        );


                    if (!response.ok) {

                        const errorText =
                            await response.text();


                        throw new Error(
                            errorText ||
                            "Failed to load radio messages."
                        );

                    }


                    const messages =
                        await response.json();


                    if (
                        !Array.isArray(
                            messages
                        )
                    ) {

                        return;

                    }


                    /*
                     * API returns newest first.
                     * Reverse so older messages are
                     * processed before newer messages.
                     */

                    const orderedMessages =
                        [...messages]
                            .reverse();


                    orderedMessages.forEach(
                        (message) => {

                            if (
                                !message ||
                                !message.messageId
                            ) {

                                return;

                            }


                            /*
                             * Prevent duplicate processing.
                             */

                            if (
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

                                messageId:
                                    message.messageId,

                                sender:
                                    message.senderName ||
                                    "Unknown",

                                audioData:
                                    message.audioData ||
                                    null,

                                message:
                                    message.audioData
                                        ? "Voice transmission"
                                        : "Radio message",

                                timestamp:
                                    message.createdAt
                                        ? new Date(
                                            message.createdAt
                                        ).toLocaleTimeString()
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


        // ----------------------------------------------------
        // INITIAL LOAD
        // ----------------------------------------------------

        loadMessages();


        // ----------------------------------------------------
        // POLL EVERY 2 SECONDS
        // ----------------------------------------------------

        pollingTimer =
            setInterval(
                loadMessages,
                2000
            );


        return {


            // ================================================
            // REQUEST MICROPHONE PERMISSION
            // ================================================

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

                        const testStream =
                            await navigator
                                .mediaDevices
                                .getUserMedia({
                                    audio: true
                                });


                        testStream
                            .getTracks()
                            .forEach(
                                track => {
                                    track.stop();
                                }
                            );


                        return true;

                    }
                    catch (error) {

                        return false;

                    }

                },


            // ================================================
            // SEND RADIO AUDIO TO BACKEND
            // ================================================

            transmitAudioMessage:
                async (
                    speakerName,
                    base64Audio
                ) => {

                    if (!channelName) {

                        throw new Error(
                            "Radio channel name is missing."
                        );

                    }


                    if (!speakerName) {

                        speakerName =
                            "Field Unit";

                    }


                    if (!base64Audio) {

                        throw new Error(
                            "Audio data is empty."
                        );

                    }


                    try {

                        const requestBody = {

                            channelName:
                                channelName,

                            senderName:
                                speakerName,

                            audioData:
                                base64Audio

                        };


                        console.log(
                            "Sending radio transmission:",
                            {
                                channelName:
                                    channelName,

                                senderName:
                                    speakerName,

                                audioSize:
                                    base64Audio.length
                            }
                        );


                        const response =
                            await fetch(
                                BACKEND_URL +
                                "/api/radio-messages",
                                {

                                    method:
                                        "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json",

                                        "Accept":
                                            "application/json"

                                    },

                                    body:
                                        JSON.stringify(
                                            requestBody
                                        )

                                }
                            );


                        const responseText =
                            await response.text();


                        console.log(
                            "Radio server response:",
                            {
                                status:
                                    response.status,

                                body:
                                    responseText
                            }
                        );


                        if (!response.ok) {

                            throw new Error(
                                responseText ||
                                `Radio server returned HTTP ${response.status}.`
                            );

                        }


                        let savedMessage;

                        try {

                            savedMessage =
                                JSON.parse(
                                    responseText
                                );

                        }
                        catch (error) {

                            throw new Error(
                                "Server returned an invalid JSON response."
                            );

                        }


                        if (
                            !savedMessage ||
                            !savedMessage.messageId
                        ) {

                            throw new Error(
                                "Radio message was not saved correctly."
                            );

                        }


                        /*
                         * Mark own message as already seen.
                         * This prevents duplicate local processing.
                         */

                        seenMessageIds.add(
                            savedMessage.messageId
                        );


                        return savedMessage;

                    }
                    catch (error) {

                        console.error(
                            "Radio transmission error:",
                            error
                        );


                        throw error;

                    }

                },


            // ================================================
            // CLOSE RADIO CHANNEL
            // ================================================

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