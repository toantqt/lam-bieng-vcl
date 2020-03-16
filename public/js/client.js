//socket
var socket = io();

//listen server success
socket.on('server-success', (data) => {
   // $("#msg-frame").show(1000);
});

$(document).ready(function(){
    $("#list-friend").show();
    $("#msg-frame").hide();
    

    //event client send id
    $("#chat").click(function(){
        socket.emit('client-id', 111111);
        $("#list").hide(1500);
        $("#msg-frame").show(1000);
    });
});