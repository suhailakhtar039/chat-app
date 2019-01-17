const path=require("path");
const express=require("express");
const socketIO=require("socket.io");
const http=require("http");

const app=express();
const publicPath=path.join(__dirname,"../public");
const port=process.env.PORT||3000;
app.use(express.static(publicPath));
var server=http.createServer(app);
var io=socketIO(server);

io.on("connection",(socket)=>{
	console.log("New user connected");
	socket.emit('newEmail',{
		from:"suhail@example.com",
		text:"Hey, whats up?",
		createdAt:23
	});
	socket.emit("newMessage",{
		from:"suhailAkhtar",
		text:"Hey, I want to do something big in my life",
		createdAt:"Nihal Vihar"
	});
	socket.on("disconnect",()=>{
		console.log("client disconnected");
	})
	socket.on("createEmail",(newEmail)=>{
		console.log("createEmail",newEmail);
	})
	socket.on("createMessage",(newMessage)=>{
		console.log("Create message",newMessage); 
	});
})

server.listen(port,()=>{
	console.log("server is running");
});