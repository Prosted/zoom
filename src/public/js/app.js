const socket = io();

const roomTitle = document.querySelector("#roomName");
const welcome = document.querySelector("#welcome");
const roomName = welcome.querySelector("form");
const message = document.querySelector("#message");

message.hidden = true;

const showRoom = () => {
    welcome.hidden=true;
    message.hidden=false;
    const input = message.querySelector("input");
    const {value} = input;
    console.log(value);
}


const handleSubmit = (event) => {   
    event.preventDefault();
    const input = roomName.querySelector("input");
    const {value} = input;
    roomTitle.innerText = value;
    socket.emit("enter-room", {payload : value}, showRoom);
    input.value="";
}

roomName.addEventListener("submit", handleSubmit);
