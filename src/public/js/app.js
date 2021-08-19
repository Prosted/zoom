const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");


const handleSubmit = (event) => {   
    event.preventDefault();
    const input = form.querySelector("input");
    const {value} = input;
    socket.emit("enter-room", {payload : value}, ()=>{console.log("Done")});
    input.value="";
}

form.addEventListener("submit", handleSubmit);
