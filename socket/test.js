var chat = (io) => {
    io.on("connection", (socket) => {
        console.log("a user connected");
        console.log(socket.id);
        //console.log(socket.request.users._id);
    });
} 

module.exports = chat;