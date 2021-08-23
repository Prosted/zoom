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
        if(!deviceId){
            await getCameras();
        }
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

const handleSelect = (event) => {
    console.log(cameraSelect.value);
    getStream(cameraSelect.value);
}

muteBtn.addEventListener("click", handleMute);
cameraBtn.addEventListener("click", handleCamera);
cameraSelect.addEventListener("input", handleSelect);

getStream();
