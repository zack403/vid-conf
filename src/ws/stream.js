const users = {};
let rooms = [];
let roomUsers = [];

const stream = ( socket ) => {
    socket.on( 'subscribe', ( data ) => {

        //check if room is in use
        const isRooMAvail = rooms.find(x => x.room.toLowerCase() === data.room.split("_")[0].toLowerCase());
        if(isRooMAvail) {
            return socket.emit( 'roomExist', {message: `The room "${isRooMAvail.room}" is in use.` } );
        }

        //create a room
        socket.join( data.room );
        socket.join( data.socketId );

        if ( socket.adapter.rooms[data.room].length === 1 ) {
            socket.to( data.room ).emit( 'showMute', {socketId: data.socketId  } );
        }

        users[data.socketId] = `${data.user}*${data.room}`;
        roomUsers.push(data.user);

        let roomObj = {
            room: data.room.split("_")[0],
            id: data.socketId,
            users: roomUsers
        }

        rooms.push(roomObj);

        //Inform other members in the room of new user's arrival
        if ( socket.adapter.rooms[data.room].length > 1 ) {
            socket.to( data.room ).emit( 'new user', { socketId: data.socketId, user: data.user } );
        }
    } );

    socket.on( 'join', ( data ) => {

        //check if room user wants to join exist
        const isRooMAvail = rooms.find(x => x.room.toLowerCase() === data.room.split("_")[0].toLowerCase());
        if(!isRooMAvail) {
            return socket.emit( 'roomDoesNotExist', {  message: 'Meeting has ended or the link is invalid.' } );
        }

        //join a room
        socket.join( data.room );
        socket.join( data.socketId );

        users[data.socketId] = `${data.user}*${data.room}`;

        let userRoomDetailsIndex = rooms.indexOf(isRooMAvail);
        isRooMAvail.users.push(data.user);

        rooms[userRoomDetailsIndex] = isRooMAvail;


        //Inform other members in the room of new user's arrival
        if ( socket.adapter.rooms[data.room].length > 1 ) {
            socket.to( data.room ).emit( 'new user', { socketId: data.socketId, user: data.user } );
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
        delete users[socket.id];
    
        let userRoomDetails = rooms.find(x => x.id === socket.id );
        
        if(userRoomDetails) {
            
            userRoomDetails.users.length = userRoomDetails.users.length - 1;
            
            let userRoomDetailsIndex = rooms.indexOf(userRoomDetails);
            rooms[userRoomDetailsIndex] = userRoomDetails;

            if(userRoomDetails.users.length === 0) {
                rooms = rooms.filter(x => x.id != socket.id);
            }
        }
        
        if(userName) {
            socket.to(userName.split('*')[1]).emit( 'userLeft', { name: userName.split('*')[0] })
        }
        
    })
};

module.exports = stream;
