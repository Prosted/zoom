const socket = io();

const roomName = document.querySelector("#roomName");
const welcome = document.querySelector("#welcome");
const welcomeForm = welcome.querySelector("form");
const roomList = welcome.querySelector("#roomList");
const message = document.querySelector("#message");
const messageForm = message.querySelector("#messageForm");
const nicknameForm = message.querySelector("#nickname");
const messageList = document.querySelector("#messageList");

message.hidden = true;

const showRoom = () => {
    welcome.hidden=true;
    message.hidden=false;
    messageForm.addEventListener("submit", handleMessageSubmit);
    nicknameForm.addEventListener("submit", handleNicknameSubmit);
}

const handleNicknameSubmit = (event) => {
    event.preventDefault();
    const input = nicknameForm.querySelector("input");
    const value = input.value;
    socket.emit("nickname", value);
    input.value="";

}

const handleMessageSubmit = (event) =>{
    event.preventDefault();
    const input = messageForm.querySelector("input");
    const value = input.value;
    socket.emit("new_message", value, roomName.innerText, ()=>{
        addMessage(`You : ${value}`);
    })
    input.value="";
}   

const handleSubmit = (event) => {   
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    const {value} = input;
    roomName.innerText = value;
    socket.emit("enter-room", value, showRoom);
    input.value="";
}

const addMessage = (msg) => {
    const li = document.createElement("li");
    li.innerText = msg;
    messageList.appendChild(li);
}

socket.on("welcome", (user)=>{
    addMessage(`${user} joined`);
});

socket.on("bye", (user)=>{
    addMessage(`${user} left ㅠㅠ`);
})

socket.on("new_message", (msg)=>{
    addMessage(msg);
});

socket.on("room-change", (rooms)=>{
    roomList.innerHTML="";
    if (rooms.length ===0 ){
        return;
    }
    rooms.forEach(room => {
        const li= document.createElement("li");
        li.innerText=room;
        roomList.appendChild(li);
    });
})

welcomeForm.addEventListener("submit", handleSubmit);
