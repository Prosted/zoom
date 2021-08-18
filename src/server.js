import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();


app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));   
app.get("/", (req,res)=>{
    return res.render("home");
});
app.get("/*", (req,res)=>{return res.redirect("/")});

const server = http.createServer(app);
const wss=new WebSocket.Server({server});

wss.on("connection", (socket) => {
    console.log("Conneted to Server ✅");
    socket.on("close", ()=>{
        console.log("Disconnect to Server");
    });
    socket.on("message", (message)=>{
        console.log(`I got this on server : ${message}`);
    });
    socket.send("Hello World!!!");
});

const handleListen = () => console.log(`Listening on http://localhost:4000`);

server.listen(4000, handleListen);