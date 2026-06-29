const voiceSocket = io("https://elayblox-server.onrender.com");

let voicePartyId = localStorage.getItem("elaybloxPartyId") || null;
let localStream = null;
let peers = {};
let muted = false;

async function startVoice() {
  if (!voicePartyId) {
    alert("Join or create a party first.");
    return;
  }

  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  });

  document.getElementById("voiceStatus").textContent = "Voice connected";

  voiceSocket.emit("joinVoice", {
    partyId: voicePartyId
  });
}

function toggleMute() {
  if (!localStream) return;

  muted = !muted;

  localStream.getAudioTracks().forEach(track => {
    track.enabled = !muted;
  });

  document.getElementById("voiceStatus").textContent =
    muted ? "Muted" : "Voice connected";
}

function createPeer(socketId, isCaller) {
  const peer = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  });

  peers[socketId] = peer;

  localStream.getTracks().forEach(track => {
    peer.addTrack(track, localStream);
  });

  peer.onicecandidate = e => {
    if (e.candidate) {
      voiceSocket.emit("voiceSignal", {
        partyId: voicePartyId,
        to: socketId,
        signal: {
          type: "ice",
          candidate: e.candidate
        }
      });
    }
  };

  peer.ontrack = e => {
    let audio = document.getElementById("audio_" + socketId);

    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "audio_" + socketId;
      audio.autoplay = true;
      document.body.appendChild(audio);
    }

    audio.srcObject = e.streams[0];
  };

  if (isCaller) {
    peer.createOffer().then(offer => {
      return peer.setLocalDescription(offer);
    }).then(() => {
      voiceSocket.emit("voiceSignal", {
        partyId: voicePartyId,
        to: socketId,
        signal: peer.localDescription
      });
    });
  }

  return peer;
}

voiceSocket.on("voiceUserJoined", socketId => {
  if (!localStream) return;
  createPeer(socketId, true);
});

voiceSocket.on("voiceSignal", async data => {
  if (!localStream) return;

  let peer = peers[data.from];

  if (!peer) {
    peer = createPeer(data.from, false);
  }

  if (data.signal.type === "offer") {
    await peer.setRemoteDescription(data.signal);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    voiceSocket.emit("voiceSignal", {
      partyId: voicePartyId,
      to: data.from,
      signal: peer.localDescription
    });
  }

  if (data.signal.type === "answer") {
    await peer.setRemoteDescription(data.signal);
  }

  if (data.signal.type === "ice") {
    await peer.addIceCandidate(data.signal.candidate);
  }
});

voiceSocket.on("voiceUserLeft", socketId => {
  if (peers[socketId]) {
    peers[socketId].close();
    delete peers[socketId];
  }

  const audio = document.getElementById("audio_" + socketId);
  if (audio) audio.remove();
});
