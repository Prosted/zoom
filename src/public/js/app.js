const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", ()=>{
    console.log("Connected to Browser");
});

socket.addEventListener("message", (message) => {
    console.log(`I got this from server : ${message.data}`);
})

socket.addEventListener("close", ()=>{
    console.log("Disconnected to Browser");
});

setTimeout(()=>{
    socket.send("야임마 나 조병옥이야!");
}, 5000);