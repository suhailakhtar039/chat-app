var socket=io();
socket.on("connect",function(){
	console.log("connected to server");
	socket.emit("createEmail",{
		to:"jen@example.com",
		text:"Hey. This is jen."
	});
	socket.emit("createMessage",{
		from:"School",
		text:"Come school everyone"
	});
})
socket.on("disconnect",function(){
	console.log("disconnected from server");
})
socket.on("newEmail",function(email){
	console.log("New email:",email);
})
socket.on("newMessage",function(message){
	console.log("Got a new message",message);
})