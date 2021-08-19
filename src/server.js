import http from "http";
import WebSocket from "ws";
import express from "express";
import { Socket } from "dgram";

const app = express();

const sockets = [];

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
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Conneted to Server ✅");
    socket.on("close", ()=>{
        console.log("Disconnect to Server");
    });
    socket.on("message", (msg) => {
        const parsed = JSON.parse(msg.toString());
        switch (parsed.type){
            case "nickname" :
                socket["nickname"] = parsed.payload;
                break;
            case "new_message":
                sockets.forEach((aMessage) => {aMessage.send(`${socket["nickname"]} : ${parsed.payload}`)});
                break;
        }
    });
});


const handleListen = () => console.log(`Listening on http://localhost:4000`);

server.listen(4000, handleListen);