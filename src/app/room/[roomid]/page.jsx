"use client";
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000");

const Room = ({ params }) => {
    const { roomId } = params;
    const localAudioRef = useRef(null);
    const remoteAudioRefs = useRef({});
    const peerConnectionsRef = useRef({});
    const [isMuted, setIsMuted] = useState(false); // State for mute toggle

    useEffect(() => {
        const initAudioCall = async () => {
            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localAudioRef.current.srcObject = localStream;

            socket.emit('joinRoom', roomId);

            socket.on('user-joined', (userId) => {
                createPeerConnection(userId, localStream, true);
            });

            socket.on('webrtc_offer', async (offer, senderId) => {
                const peerConnection = createPeerConnection(senderId, localStream, false);
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit('webrtc_answer', roomId, answer, socket.id);
            });

            socket.on('webrtc_answer', async (answer, senderId) => {
                await peerConnectionsRef.current[senderId]?.setRemoteDescription(
                    new RTCSessionDescription(answer)
                );
            });

            socket.on('webrtc_ice_candidate', async (candidate, senderId) => {
                await peerConnectionsRef.current[senderId]?.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            });
        };

        initAudioCall();

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    const createPeerConnection = (userId, localStream, isInitiator) => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        peerConnectionsRef.current[userId] = peerConnection;

        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('webrtc_ice_candidate', roomId, event.candidate, socket.id);
            }
        };

        peerConnection.ontrack = (event) => {
            if (!remoteAudioRefs.current[userId]) {
                const remoteAudio = document.createElement('audio');
                remoteAudio.srcObject = event.streams[0];
                remoteAudio.autoplay = true;
                document.body.appendChild(remoteAudio);
                remoteAudioRefs.current[userId] = remoteAudio;
            }
        };

        if (isInitiator) {
            peerConnection.createOffer().then((offer) => {
                peerConnection.setLocalDescription(offer);
                socket.emit('webrtc_offer', roomId, offer, socket.id);
            });
        }

        return peerConnection;
    };

    const toggleMute = () => {
        const localStream = localAudioRef.current.srcObject;
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    return (
        <div>
            <h1>Room: {roomId}</h1>
            <div>
                <h2>Local Audio</h2>
                <audio ref={localAudioRef} autoPlay muted />
            </div>
            <button onClick={toggleMute} className="bg-blue-500 text-white p-2 rounded">
                {isMuted ? 'Unmute' : 'Mute'}
            </button>
        </div>
    );
};

export default Room;
