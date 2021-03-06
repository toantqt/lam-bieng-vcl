
module.exports= function(io) {
	io.on('connection', (socket) =>{
		 console.log('A user is connected');
		 console.log(socket.id);

		socket.on('friendRequest', (friend, callback)=> {
			// console.log(friend.sender+ " "+ friend.receiver);
			io.to(friend.receiver).emit('newFriendRequest', {
				from: friend.sender,
				to: friend.receiver
			});
			callback();
		});
		
		//listen client send id
		socket.on('client-id', (data) => {
			socket.emit('server-success', (data) => {
				console.log(data);
			})
		})

	});
}