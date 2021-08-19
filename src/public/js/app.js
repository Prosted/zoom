const form = document.querySelector("form");
const ul = document.querySelector("ul");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", ()=>{
    console.log("Connected to Browser");
});

socket.addEventListener("message", (message) => {
    console.log(message.data);
})

socket.addEventListener("close", ()=>{
    console.log("Disconnected to Browser");
});

const handleSubmit = (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const {value} = input;
    socket.send(value);
    input.value="";
}

form.addEventListener("submit", handleSubmit);