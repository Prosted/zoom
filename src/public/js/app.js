const socket = io();

const stream = document.querySelector("#myStream");
const video = stream.querySelector("video");
const muteBtn = stream.querySelector("#muteBtn");
const cameraBtn = stream.querySelector("#cameraBtn");
const cameraSelect = stream.querySelector("#cameraSelect");

let myStream;
let muted = false;
let cameraOff= false;
let myPeerConnection;

let roomName;

const getCameras = async () => {
    try{
        cameraSelect.innerHTML="";
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device)=>(device.kind === "videoinput")).reverse();
        const currentCamera = myStream.getVideoTracks()[0]; 
        cameras.forEach((camera)=>{
            const option = document.createElement("option");
            option.value=camera.deviceId;
            option.label=camera.label;
            if(currentCamera.label === camera.label){
                option.selected=true;
            }
            cameraSelect.appendChild(option); 
        })
    }catch(e){
        console.log(e);
    }
}

async function getStream(deviceId){
    const defaultCamera = {
        audio: true,
        video: { facingMode: "user" },
    };
    const selectedCamera = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
    };
    try{
        myStream = await navigator.mediaDevices.getUserMedia(deviceId ? defaultCamera : selectedCamera);
        await getCameras();
        video.srcObject = myStream;
    }catch(e){
        console.log(e);
    }
}

const handleMute = () => {
    myStream.getAudioTracks().forEach((track) => (
        track.enabled = !track.enabled
    ));
    if(!muted){
        muteBtn.innerText="UnMute";
        muted=true;
    }else{
        muteBtn.innerText="Mute";
        muted=false;
    }
}

const handleCamera = () => {
    myStream.getVideoTracks().forEach((track)=>(track.enabled = !track.enabled));
    if(!cameraOff){
        cameraBtn.innerText="Camera ON";
        cameraOff= true;
    }else{
        cameraBtn.innerText="Camera OFF";
        cameraOff= false;
    }
}

const handleSelect = async (event) => {
    await getStream(cameraSelect.value);
    if(myPeerConnection){
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection.getSenders().find((sender)=>sender.track.kind ==="video");
        videoSender.replaceTrack(videoTrack);
    }
}

muteBtn.addEventListener("click", handleMute);
cameraBtn.addEventListener("click", handleCamera);
cameraSelect.addEventListener("input", handleSelect);

getStream();

//socketIo code

const welcome = document.querySelector("#welcome");
const call = document.querySelector("#call");
const welcomeForm = welcome.querySelector("form");

call.hidden=true;

const showCall = async () =>{
    welcome.hidden=true;
    call.hidden=false;
    await getStream();
    makeConnection();
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const input = welcome.querySelector("input");
    roomName = input.value;
    await showCall();
    socket.emit("enter-room", roomName);
    input.value="";
}

socket.on("welcome", async ()=>{
    const offer=await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    socket.emit("offer", offer, roomName);
})

socket.on("offer", async (offer)=>{
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer)=>{
    myPeerConnection.setRemoteDescription(answer);
})

socket.on("ice", (ice)=>{
    myPeerConnection.addIceCandidate(ice);
})

welcomeForm.addEventListener("submit", handleSubmit);

//webRTC code

async function makeConnection(){
    myPeerConnection = await new RTCPeerConnection();
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream.getTracks().forEach((track)=>(myPeerConnection.addTrack(track, myStream))); 
}

function handleIce(data){
    socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data){
    const peerFace = document.querySelector("#peerStream video");
    peerFace.srcObject=data.stream;
}
