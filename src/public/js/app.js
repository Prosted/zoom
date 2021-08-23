const socket = io();

const stream = document.querySelector("#myStream");
const video = stream.querySelector("#video");
const muteBtn = stream.querySelector("#muteBtn");
const cameraBtn = stream.querySelector("#cameraBtn");

let myStream;
let muted = false;
let cameraOff= false;

async function getStream(){
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        })
        video.srcObject = myStream;
    }catch(e){
        console.log(e);
    }

}

getStream();

const handleMute = () => {
    if(!muted){
        muteBtn.innerText="UnMute";
        muted=true;
    }else{
        muteBtn.innerText="Mute";
        muted=false;
    }
}

const handleCamera = () => {
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

