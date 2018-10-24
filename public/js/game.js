var socket = io();
var playerHand = [];

// waktu player konek ke server / masuk room
socket.on('connect', function(){
    console.log('Player Connected to the Server');
    
    var params = jQuery.deparam(window.location.search);
    // ----------------------- EVENT 1. EMIT JOIN ROOM -----------------------
    socket.emit('join', params, function(message){
        if(message === 'Room is Full from Join'){
            alert(message);
            window.location.href = '/';
        }
        // ----------------------- EVENT 2. EMIT GAME START -----------------------
        else if(message === 'Room Ready'){                             
            var params = jQuery.deparam(window.location.search);
            socket.emit('startGame', params, function(player){
                if(player){
                    jQuery('#player-room').empty();
                    player.forEach(function(name){ 
                        jQuery('#player-room').append(jQuery('<div></div>').addClass('w3-card')
                        .append(jQuery('<h3></h3>').text(name)));
                    });
                }
            });
        }
    });
});         
            // ----------------------- EVENT 2. LISTEN TO CARD DEALER -----------------------
            socket.on('initState', function(room){
                socket.emit('requestCard', socket.id,room); 
            });
            
            socket.on('dealCard', function(hand){
                console.log(hand);
                var params = jQuery.deparam(window.location.search);
                jQuery('#player-hand').empty();
                jQuery('#player-hand').append(jQuery('<div></div>').addClass('w3-card')
                .append(jQuery('<h3></h3>').text(hand)));
                playerHand = hand;
                console.log(playerHand);
            });
            
            
// bikin tampilan masing2 player di room
socket.on('updatePlayerList', function(players){
    console.log(players);
    jQuery('#player-room').empty();
    players.forEach(function(player){
        jQuery('#player-room').append(jQuery('<div></div>').addClass('w3-card')
        .append(jQuery('<h3></h3>').text(player.name)))
    });
});

socket.on('disconnect', function(){
});

//-------------- 10/24 --------------
/*$('#changeCard').click(function(){
    var params = jQuery.deparam(window.location.search);
    socket.emit('changeCard',socket.id, params, [0,1,2]);
});*/
//-------------- 10/24 --------------
