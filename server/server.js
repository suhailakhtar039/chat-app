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
	socket.on("disconnect",()=>{
		console.log("client disconnected");
	})
	socket.emit('newMessage',{
		from:'Admin',
		text:'Welcome to the chat app',
		createdAt:new Date().getTime()
	});
	socket.broadcast.emit('newMessage',{
		from:'Admin',
		text:'New user joined',
		createdAt:new Date().getTime()
	});
	socket.on("createMessage",(message)=>{
		console.log("Create message",message); 
		// io.emit('newMessage',{  //It will emit the events to each and every client including
		// 	from:message.from,	   // this
		// 	text:message.text,
		// 	createdAt:new Date().getTime()
		// });
		//===It will emit the events to each and every client excluding this
		socket.broadcast.emit("newMessage",{
			from:message.from,
			text:message.text,
			createdAt:new Date().getTime()
		});
	});
})

server.listen(port,()=>{
	console.log("server is running");
});