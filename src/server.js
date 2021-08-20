import http from "http";
// import WebSocket from "ws";
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
    socket.onAny((event)=>{
        console.log(`server event : ${event}`);
    });
    socket.on("enter-room", (room, done)=>{
        console.log(socket.id);
        console.log(socket.rooms);
        socket.join(room);
        console.log(socket.rooms);
        done();
    })
})


/*
const wss=new WebSocket.Server({httpServer});

const sockets = [];
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
*/

const handleListen = () => console.log(`Listening on http://localhost:4000`);

httpServer.listen(4000, handleListen);