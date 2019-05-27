// Connect server from client
var socket=io("http://localhost:3000");
socket.on("Server-send-failed-register",()=>{
    alert("Username has already registered!");
});

socket.on("Server-send-successful-register",(username)=>{
    $('#chatBox').show(2000);
    $('#loginForm').hide(1000);
    $('#currentUser').html(username);
});

socket.on("Server-send-userList-to-Group",(userArr)=>{
    $("#boxContent").html("");
    userArr.forEach(element => {
        $("#boxContent").append(`
            <div class='currentUser'>${element}</div>
        `); 
    });
});

socket.on("Update-users",(newArr)=>{
    $("#boxContent").html("");
    newArr.forEach(i=>{
        $("#boxContent").append(`
            <div class='currentUser'>${i}</div>
        `);
    });
});

socket.on("Server-send-mess",(data)=>{
    $("#messageBox").append(`
        <div class='msn'><b>${data.usn}:</b> ${data.mess}</div>
    `);
});
socket.on("Server-response-to-typing",(res)=>{
    $("#notif").text(res);
})
socket.on("Server-response-when-stop",()=>{
    $("#notif").text("");
})

$(document).ready(()=>{
   $("#loginForm").show();
   $("#chatBox").hide();
   
   $("#btnRegister").click(()=>{
       socket.emit("Client-send-username",$("#txtUsername").val());

   });

   $("#mess").focusin(()=>{
       socket.emit("Someone-is-typing");
   });
   $("#mess").focusout(()=>{
    //    $("#notif").text("");
        socket.emit("Someone-stop-typing");
   })

   $("#btnLogout").click(()=>{
       socket.emit("Client-logout");
       $("#loginForm").show();
       $("#chatBox").hide();
       $("#txtUsername").val("")
   });
   $("#btnSend").click(()=>{
       socket.emit("Client-send-mess",$("#mess").val());
       $("#mess").val("");
   })
})