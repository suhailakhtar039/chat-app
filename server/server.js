const path=require("path");
const express=require("express");
const socketIO=require("socket.io");
const http=require("http");

const {generateMessage,generateLocationMessage}=require("./utils/message");
const {isRealString}=require("./utils/validation");
const {Users}=require("./utils/users");
const app=express();
const publicPath=path.join(__dirname,"../public");
const port=process.env.PORT||3000;
app.use(express.static(publicPath));
var server=http.createServer(app);
var io=socketIO(server);
var users=new Users();
//io.emit==It emits to each and every client
//socket.broadcast.emit==It emits to each and every client except the owner one
//socket.emit==It emits to owner.


io.on("connection",(socket)=>{
	console.log("New user connected");
	socket.on("join",(params,callback)=>{
		if(!isRealString(params.name) || !isRealString(params.room)){
			return callback("Name and room name are required.");
		}
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id,params.name,params.room);

		io.to(params.room).emit("updateUserList",users.getUserList(params.room));
		socket.emit('newMessage',generateMessage('Admin','Welcome to chat app!'));
		socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));
		
		callback();
	});

	socket.on("createMessage",(message,callback)=>{
		var user=users.getUser(socket.id);
		if(user && isRealString(message.text)){
			io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
		}
		callback();
		//===It will emit the events to each and every client excluding this
		// socket.broadcast.emit("newMessage",{
		// 	from:message.from,
		// 	text:message.text,
		// 	createdAt:new Date().getTime()
		// });
	});
	socket.on("createLocationMessage",(coords)=>{
		var user=users.getUser(socket.id);
		if(user){
			io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude, coords.longitude));
		}
	})
	socket.on("disconnect",()=>{
		var user=users.removeUser(socket.id);
		if(user){
			io.to(user.room).emit("updateUserList",users.getUserList(user.room));
			io.to(user.room).emit("newMessage",generateMessage('Admin',`${user.name} has left`));
		}
	})
})

server.listen(port,()=>{
	console.log("server is running");
});