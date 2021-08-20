const socket = io();

const roomName = document.querySelector("#roomName");
const welcome = document.querySelector("#welcome");
const welcomeForm = welcome.querySelector("form");
const message = document.querySelector("#message");
const messageForm = message.querySelector("form");
const messageList = document.querySelector("#messageList");

message.hidden = true;

const showRoom = () => {
    welcome.hidden=true;
    message.hidden=false;
    messageForm.addEventListener("submit", handleMessageSubmit);
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

socket.on("welcome", ()=>{
    addMessage("Someone joined");
});

socket.on("bye", ()=>{
    addMessage("someong left ㅠㅠ");
})

socket.on("new_message", (msg)=>{
    console.log("app.js:"+msg);
    addMessage(msg);
});

welcomeForm.addEventListener("submit", handleSubmit);
