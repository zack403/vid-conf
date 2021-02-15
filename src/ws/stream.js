const rooms = [];

const stream = ( socket ) => {
    socket.on( 'subscribe', ( data ) => {

        if(!data.isNew) {
            let r = data.room.split("_")[0];
            let isExist = rooms.find(x => x.toLowerCase() === r.toLowerCase());
            if(!isExist) {
                socket.emit( 'roomDoesNotExist', {  message: 'Invalid meeting link.' } );
                
            }

            //subscribe/join a room
            socket.join( data.room );
            socket.join( data.socketId );


            //Inform other members in the room of new user's arrival
            if ( socket.adapter.rooms[data.room].length > 1 ) {
                socket.to( data.room ).emit( 'new user', { socketId: data.socketId } );
            }
        } 
        else {
            let r = data.room.split("_")[0];
            let isExist = rooms.find(x => x.toLowerCase() === r.toLowerCase());
            if(isExist) {
                socket.emit( 'roomExist', {message: `The room "${r}" already exist.` } );
                
            }
            rooms.push(r);
                //subscribe/join a room
            socket.join( data.room );
            socket.join( data.socketId );

            //Inform other members in the room of new user's arrival
            if ( socket.adapter.rooms[data.room].length > 1 ) {
                socket.to( data.room ).emit( 'new user', { socketId: data.socketId } );
            }
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