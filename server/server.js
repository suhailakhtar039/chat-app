const path=require("path");
const express=require("express");
const socketIO=require("socket.io");
const http=require("http");

const {generateMessage}=require("./utils/message");
const app=express();
const publicPath=path.join(__dirname,"../public");
const port=process.env.PORT||3000;
app.use(express.static(publicPath));
var server=http.createServer(app);
var io=socketIO(server);

io.on("connection",(socket)=>{
	console.log("New user connected");
	socket.on("disconnect",()=>{
		console.log("client disconnected");
	})
	socket.emit('newMessage',generateMessage('Admin','Welcome to chat app!'));
	
	socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined!'));
	
	socket.on("createMessage",(message,callback)=>{
		console.log("Create message",message); 
		io.emit('newMessage',generateMessage(message.from,message.text));
		callback('This is from the server');
		//===It will emit the events to each and every client excluding this
		// socket.broadcast.emit("newMessage",{
		// 	from:message.from,
		// 	text:message.text,
		// 	createdAt:new Date().getTime()
		// });
	});
})

server.listen(port,()=>{
	console.log("server is running");
});