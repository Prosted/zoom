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

const handleConnection = (socket) => {
    console.log(socket);
}

wss.on("connection", handleConnection);

server.listen(3000, ()=>{console.log("server is open!")});