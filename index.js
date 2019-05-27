const express=require('express');
const path=require('path');

var app=express();
app.use(express.static('public'));
// Setup view
app.set('view engine','ejs');
app.set('views','./views');

// Setup socket.io
var server=require('http').Server(app);
var io=require('socket.io')(server);
server.listen(3000,(req,res)=>{
    console.log('Server is running on port 3000');
});

var users=["AAA"];
io.on("connection",(socket)=>{
    // console.log("User is connecting"+socket.id);
    socket.on("Client-send-username",(username)=>{
        console.log(username+' has just registered');
        // Check register
        if (users.indexOf(username)>=0) {
            // Fail
            socket.emit("Server-send-failed-register");
        } else {
            users.push(username);
            socket.Username=username;
            // Success
            socket.emit("Server-send-successful-register",username);
            io.sockets.emit("Server-send-userList-to-Group",users);
        }
    });
    socket.on("disconnect",()=>{
        users.splice(users.indexOf(socket.Username),1);
        socket.broadcast.emit("Update-users",users);
    })
    // Logout
    socket.on("Client-logout",()=>{
        // Remove username from users array
        users.splice(users.indexOf(socket.Username),1);
        // Update the users array to the group except the logout user
        socket.broadcast.emit("Update-users",users);
    });
    // Receive mess from client
    socket.on("Client-send-mess",(mess)=>{
      io.sockets.emit("Server-send-mess",{usn:socket.Username,mess:mess});  
    })
    // Someone is typing
    socket.on("Someone-is-typing",()=>{
        var serverNotif=socket.Username+' is typing ...';
        socket.broadcast.emit("Server-response-to-typing",serverNotif);
    });
    socket.on("Someone-stop-typing",()=>{
        socket.broadcast.emit("Server-response-when-stop");
    });
})
app.get('/',(req,res)=>{
    res.render('home');
})