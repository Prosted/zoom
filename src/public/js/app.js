const socket = io();

const stream = document.querySelector("#myStream");
const video = stream.querySelector("#video");
const muteBtn = stream.querySelector("#muteBtn");
const cameraBtn = stream.querySelector("#cameraBtn");
const cameraSelect = stream.querySelector("#cameraSelect");

let myStream;
let muted = false;
let cameraOff= false;


const getCameras = async () => {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device)=>(device.kind === "videoinput"));
        cameras.forEach((camera)=>{
            const option = document.createElement("option");
            option.value=camera.deviceId;
            option.label=camera.label;
            cameraSelect.appendChild(option); 
        })
    }catch(e){
        console.log(e);
    }
}

async function getStream(){
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        })
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

muteBtn.addEventListener("click", handleMute);
cameraBtn.addEventListener("click", handleCamera);

getStream();
