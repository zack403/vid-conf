import helpers from './helpers.js';

window.addEventListener( 'load', () => {
    //When the chat icon is clicked
    document.querySelector( '#toggle-chat-pane' ).addEventListener( 'click', ( e ) => {
        // document.querySelector('.main').classList.remove( 'col-md-12');
        // document.querySelector('.main').classList.add( 'col-md-7');
        let chatElem = document.querySelector( '#chat-pane');
        let mainSecElem = document.querySelector( '#main-section');
        

        if ( chatElem.classList.contains( 'chat-opened' ) ) {
            chatElem.setAttribute( 'hidden', true );
            mainSecElem.classList.remove( 'col-md-9');
            mainSecElem.classList.add( 'col-md-12' );

            mainSecElem.classList.remove( 'col-md-9');
            mainSecElem.classList.add( 'col-md-12' );
            chatElem.classList.remove( 'chat-opened' );
        }

        else {
            chatElem.attributes.removeNamedItem( 'hidden' );
            mainSecElem.classList.remove( 'col-md-12' );
            mainSecElem.classList.add( 'col-md-9' );
            chatElem.classList.add( 'chat-opened' );
        }

        //remove the 'New' badge on chat icon (if any) once chat is opened.
        setTimeout( () => {
            if ( document.querySelector( '#chat-pane' ).classList.contains( 'chat-opened' ) ) {
                helpers.toggleChatNotificationBadge();
            }
        }, 300 );
    } );

     //When the chat icon is clicked
     document.querySelector( '#toggle-part-pane' ).addEventListener( 'click', ( e ) => {
        // document.querySelector('.main').classList.remove( 'col-md-12');
        // document.querySelector('.main').classList.add( 'col-md-7');
        let chatElem = document.querySelector( '#part-pane');
        let mainSecElem = document.querySelector( '#main-section');
        

        if ( chatElem.classList.contains( 'chat-opened' ) ) {
            chatElem.setAttribute( 'hidden', true );
            mainSecElem.classList.remove( 'col-md-9');
            mainSecElem.classList.add( 'col-md-12' );

            mainSecElem.classList.remove( 'col-md-9');
            mainSecElem.classList.add( 'col-md-12' );
            chatElem.classList.remove( 'chat-opened' );
        }

        else {
            chatElem.attributes.removeNamedItem( 'hidden' );
            mainSecElem.classList.remove( 'col-md-12' );
            mainSecElem.classList.add( 'col-md-9' );
            chatElem.classList.add( 'chat-opened' );
        }

        
    } );


    document.getElementById('hide').addEventListener('click', () => {

        let chatElem = document.querySelector( '#chat-pane');
        let mainSecElem = document.querySelector( '#main-section');

        chatElem.setAttribute( 'hidden', true );
        mainSecElem.classList.remove( 'col-md-9');
        mainSecElem.classList.add( 'col-md-12' );

        mainSecElem.classList.remove( 'col-md-9');
        mainSecElem.classList.add( 'col-md-12' );
        chatElem.classList.remove( 'chat-opened' );
    })
    

    document.getElementById('hidepart').addEventListener('click', () => {

        let chatElem = document.querySelector( '#part-pane');
        let mainSecElem = document.querySelector( '#main-section');

        chatElem.setAttribute( 'hidden', true );
        mainSecElem.classList.remove( 'col-md-9');
        mainSecElem.classList.add( 'col-md-12' );

        mainSecElem.classList.remove( 'col-md-9');
        mainSecElem.classList.add( 'col-md-12' );
        chatElem.classList.remove( 'chat-opened' );
    })

    //When the video frame is clicked. This will enable picture-in-picture
    document.getElementById( 'local' ).addEventListener( 'click', () => {
        if ( !document.pictureInPictureElement ) {
            document.getElementById( 'local' ).requestPictureInPicture()
                .catch( error => {
                    // Video failed to enter Picture-in-Picture mode.
                    console.error( error );
                } );
        }

        else {
            document.exitPictureInPicture()
                .catch( error => {
                    // Video failed to leave Picture-in-Picture mode.
                    console.error( error );
                } );
        }
    } );

    

    //When the 'Create room" is button is clicked
    document.getElementById( 'create-room' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();

        let roomName = document.querySelector( '#room-name' ).value;
        let yourName = document.querySelector( '#your-name' ).value;
        
        if(!roomName.match(/^[a-zA-Z0-9]*$/))
        {
            return document.querySelector( '#err-msg' ).innerHTML = "Room name cannot contain special characters.";
        }

        sessionStorage.setItem( 'isNew', JSON.stringify(true) );


        if ( roomName && yourName ) {
            //remove error message, if any
            document.querySelector( '#err-msg' ).innerHTML = "";

            //save the user's name in sessionStorage
            sessionStorage.setItem( 'username', yourName );

            //create room link
            let roomLink = `${ location.origin }?id=${ roomName.trim().replace( ' ', '_' ) }_${ helpers.generateRandomString() }`;

            //show message with link to room
            // document.querySelector( '#room-created' ).innerHTML = `Room successfully created. Waiting for someone to join this room: <a href='${ roomLink }'>here</a> to enter room. 
            //     Share the room link with your partners.`;

            window.location.href = roomLink;

            //empty the values
            document.querySelector( '#room-name' ).value = '';
            document.querySelector( '#your-name' ).value = '';
        }

        else {
            document.querySelector( '#err-msg' ).innerHTML = "All fields are required";
        }
    } );



    //When the 'Enter room' button is clicked.
    document.getElementById( 'enter-room' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();

        sessionStorage.setItem( 'isNew', JSON.stringify(false));


        let isMeetingLinkExist = document.querySelector('#meeting-link').getAttribute('hidden');
        let name = document.querySelector( '#username' ).value;

        if ( name && !isMeetingLinkExist) {
            let meetingLink = document.querySelector('#meeting-link').value.split('=')[1];
            if(meetingLink) {
                sessionStorage.setItem( 'meetinglink', meetingLink );
            }else {
                document.querySelector( '#err-msg-username' ).innerHTML = "Please enter the correct meeting link";
                return;
            }
            //remove error message, if any
            document.querySelector( '#err-msg-username' ).innerHTML = "";

            //save the user's name in sessionStorage
            sessionStorage.setItem( 'username', name );

            //reload room
            location.reload();
        }
        else {
            if(!name && isMeetingLinkExist != null) {
                document.querySelector( '#err-msg-username' ).innerHTML = "Please enter your name";
            } else {
                document.querySelector( '#err-msg-username' ).innerHTML = "All fields are required";
            }
        }
    } );


    document.addEventListener( 'click', ( e ) => {
        if ( e.target && e.target.classList.contains( 'expand-remote-video' ) ) {
            helpers.maximiseStream( e );
        }

        else if ( e.target && e.target.classList.contains( 'mute-remote-mic' ) ) {
            helpers.singleStreamToggleMute( e );
        }
    } );


    document.getElementById( 'closeModal' ).addEventListener( 'click', () => {
        helpers.toggleModal( 'recording-options-modal', false );
    } );


    document.getElementById( 'join-meeting' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();

        document.querySelector( '.cont' ).hidden = true;
        document.querySelector( '#room-create' ).hidden = true;
        document.querySelector( '#username-set' ).attributes.removeNamedItem( 'hidden' );

        
    } );

    document.getElementById( 'get-started' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();

        document.querySelector( '.cont' ).hidden = true;
        document.querySelector( '#room-create' ).attributes.removeNamedItem( 'hidden' );

        
    } );

    
    document.getElementById( 'with-video-on' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();
        
        sessionStorage.setItem("mode", "on");
        document.querySelector( '.cont' ).hidden = true;
        document.querySelector( '#username-set' ).hidden = true;

        const isHidden =  document.querySelector( '#room-create' ).attributes.getNamedItem( 'hidden' );
        if(isHidden) {
            document.querySelector( '#room-create' ).attributes.removeNamedItem( 'hidden' );

        }

        
    } );

    
    document.getElementById( 'with-video-off' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();
        sessionStorage.setItem("mode", "off");
        document.querySelector( '.cont' ).hidden = true;
        document.querySelector( '#username-set' ).hidden = true;

        const isHidden =  document.querySelector( '#room-create' ).attributes.getNamedItem( 'hidden' );
        if(isHidden) {
            document.querySelector( '#room-create' ).attributes.removeNamedItem( 'hidden' );

        }

        
    } );

    
    document.getElementById( 'screen-share-only' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();
        sessionStorage.setItem("mode", "share");
        document.querySelector( '.cont' ).hidden = true;
        document.querySelector( '#username-set' ).hidden = true;

        const isHidden =  document.querySelector( '#room-create' ).attributes.getNamedItem( 'hidden' );
        if(isHidden) {
            document.querySelector( '#room-create' ).attributes.removeNamedItem( 'hidden' );

        }
        
    } );

} );