const users = {};
const rooms = {};
const stream = ( socket ) => {
    socket.on( 'subscribe', ( data ) => {

        const isRooMAvail = rooms[data.room.split("_")[0]];
        if(isRooMAvail) {
            return socket.emit( 'roomExist', {message: `The room "${isRooMAvail}" already exist.` } );
        }

        //subscribe/join a room
        socket.join( data.room );
        socket.join( data.socketId );

        users[data.socketId] = `${data.user}*${data.room}`;
        rooms[data.room.split("_")[0]] = data.room.split("_")[0];

        //Inform other members in the room of new user's arrival
        if ( socket.adapter.rooms[data.room].length > 1 ) {
            socket.to( data.room ).emit( 'new user', { socketId: data.socketId } );
        }
    } );

    socket.on( 'join', ( data ) => {

        const isRooMAvail = rooms[data.room.split("_")[0]];
        if(!isRooMAvail) {
            return socket.emit( 'roomDoesNotExist', {  message: 'Invalid meeting link.' } );
        }
        //subscribe/join a room
        socket.join( data.room );
        socket.join( data.socketId );

        users[data.socketId] = `${data.user}*${data.room}`;;

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

    socket.on('disconnect', () => {
        socket.id = socket.id.split('#')[1];
        let userName = users[socket.id];
        delete rooms[socket.id];
        delete users[socket.id];
        console.log(userName);
        if(userName) {
            socket.to(userName.split('*')[1]).emit( 'userLeft', { name: userName.split('*')[0] })
        }
    })
};

module.exports = stream;
