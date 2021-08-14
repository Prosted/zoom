import express from "express";

const app = express();

console.log("Hey it works!!");

app.listen(3000, ()=>{console.log("server is open!")});