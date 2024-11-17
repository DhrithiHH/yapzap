import { RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc";

export default class WebRTCClient {
    constructor(socketUrl, onLocalStream, onRemoteStream) {
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.socket = io(socketUrl);
        this.onLocalStream = onLocalStream;
        this.onRemoteStream = onRemoteStream;

        this.socket.on("receive-call", this.handleIncomingCall.bind(this));
        this.socket.on("call-answered", this.handleCallAnswered.bind(this));
        this.socket.on("ice-candidate", this.handleIceCandidate.bind(this));
    }

    async startLocalStream(constraints) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.localStream = stream;
        this.onLocalStream(stream);
    }

    async register(userId) {
        this.socket.emit("register", userId);
    }

    async callUser(remoteUserId) {
        this.peerConnection = this.createPeerConnection();
        this.localStream.getTracks().forEach((track) =>
            this.peerConnection.addTrack(track, this.localStream)
        );

        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

        this.socket.emit("call-user", {
            to: remoteUserId,
            offer: this.peerConnection.localDescription,
        });
    }

    createPeerConnection() {
        const pc = new RTCPeerConnection();
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket.emit("ice-candidate", {
                    to: this.remoteUserId,
                    candidate: event.candidate,
                });
            }
        };
        pc.ontrack = (event) => {
            this.remoteStream = event.streams[0];
            this.onRemoteStream(this.remoteStream);
        };
        return pc;
    }

    async handleIncomingCall({ from, offer }) {
        this.peerConnection = this.createPeerConnection();
        await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
        );

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));

        this.socket.emit("answer-call", {
            to: from,
            answer: this.peerConnection.localDescription,
        });
    }

    async handleCallAnswered({ answer }) {
        await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
        );
    }

    async handleIceCandidate(candidate) {
        await this.peerConnection.addIceCandidate(candidate);
    }
}
