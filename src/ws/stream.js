const stream = ( socket ) => {

    const rooms = [];
    socket.on( 'subscribe', ( data ) => {
        rooms.push(data.room);
        //subscribe/join a room
        socket.join( data.room );
        socket.join( data.socketId );

        if(rooms.length > 0) {
            const isRoom = rooms.find(x => x === data.room);
            if(!isRoom) {
                socket.to( data.room ).emit( 'invalid room', { room: data.room, message: 'room does not exist' } );
            }
        }
        

        //Inform other members in the room of new user's arrival
        if ( socket.adapter.rooms[data.room].length > 1 ) {
            socket.to( data.room ).emit( 'new user', { socketId: data.socketId } );
        }
    } );


    socket.on( 'newUserStart', ( data ) => {
        socket.to( data.to ).emit( 'newUserStart', { sender: data.sender } );
    } );


    socket.on( 'sdp', ( data ) => {
        socket.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
    } );


    socket.on( 'ice candidates', ( data ) => {
        socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    } );


    socket.on( 'chat', ( data ) => {
        socket.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg } );
    } );
};

module.exports = stream;