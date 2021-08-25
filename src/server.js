import http from "http";
// import WebSocket from "ws";
import { instrument } from "@socket.io/admin-ui";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));   
app.get("/", (req,res)=>{
    return res.render("home");
});
app.get("/*", (req,res)=>{return res.redirect("/")});


const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

io.on("connect", (socket)=>{
    socket.on("enter-room", (roomName)=>{
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName)=>{
        socket.to(roomName).emit("offer", offer);
    })
    socket.on("answer", (answer, roomName)=>{
        socket.to(roomName).emit("answer", answer);
    })
    socket.on("ice", (ice, roomName)=>{
        socket.to(roomName).emit("ice", ice);
    })
})

const handleListen = () => console.log(`Listening on http://localhost:4000`);

httpServer.listen(4000, handleListen);