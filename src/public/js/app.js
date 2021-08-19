const messageform = document.querySelector("#messageForm");
const nicknameForm = document.querySelector("#nicknameForm");
const messages = document.querySelector("#messages");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", ()=>{
    console.log("Connected to Browser");
});

socket.addEventListener("close", ()=>{
    console.log("Disconnected to Browser");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messages.appendChild(li);
})

const makeMessage = (type, payload) => {
    const msg = {
        type,
        payload
    };
    return JSON.stringify(msg);
}

const sendNickname = (event) => {
    event.preventDefault();
    const input = nicknameForm.querySelector("input");
    const {value} = input;
    socket.send(makeMessage("nickname", value));
    input.value="";
}

const sendMessage = (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    const {value} = input;
    socket.send(makeMessage("new_message", value));
    input.value="";
}

messageForm.addEventListener("submit", sendMessage);
nicknameForm.addEventListener("submit", sendNickname);