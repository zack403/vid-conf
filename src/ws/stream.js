let rooms = [];
let users  = [];

const stream = ( socket ) => {
    socket.on( 'subscribe', ( data ) => {
        

        if(!data.isNew) {
            let r = data.room.split("_")[0];
            let isExist = rooms.find(x => x.room.toLowerCase() === r.toLowerCase());
            if(!isExist) {
                socket.emit( 'roomDoesNotExist', {  message: 'Invalid meeting link.' } );
                return;
            }

            // let userObj = {
            //     id: socket.id,
            //     name : data.user
            // }

            //users.push(userObj);

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
            let isExist = rooms.find(x => x.room.toLowerCase() === r.toLowerCase());
            if(isExist) {
                socket.emit( 'roomExist', {message: `The room "${r}" already exist.` } );    
                return;
            }

            // let userObj = {
            //     id: socket.id,
            //     name : data.user
            // }

            // users.push(userObj);

            let roomObj = {
                room: r,
                id: socket.id
            }

            rooms.push(roomObj);

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

    socket.on('disconnect', () => {
        rooms = rooms.filter(x => x.id != socket.id);
        // const user = users.find(x => x.id === socket.id);
        // users = users.filter (x => x.id != socket.id);
        // socket.broadcast.emit( 'userLeft', {id:socket.id, user: user ? user.name : "" } );
    })
};

module.exports = stream;