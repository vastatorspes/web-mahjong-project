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
                $('#button-div').html("<button id='changeCard' onlick= 'changeCard()'>Change Card</button>")
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

// ----------------------- EVENT 3. EMIT CHANGE CARD -----------------------
$('#button-div').on("click", "button#changeCard",function(){
    var params = jQuery.deparam(window.location.search);
    socket.emit('changeCard',socket.id, params, playerHand.slice(0,3));
    $('#changeCard').hide();
});

// ----------------------- EVENT 4. LISTEN AFTER CHANGE -----------------------
socket.on('afterChange', function(currentTurn){
    var params = jQuery.deparam(window.location.search);
    if(params.Username === currentTurn){
        console.log("my turn");
        if($('#drawCard').length >0){
            $('#drawCard').show();
        }else{
            $('#button-div').html("<button id='drawCard'>Draw Card</button>")
        }
    }
})

// ----------------------- EVENT 6. EMIT DRAW CARD -----------------------
$('#button-div').on("click", "button#drawCard",function(){
    var params = jQuery.deparam(window.location.search);
    socket.emit('drawCard',socket.id, params.Room);
    $('#drawCard').hide();
    
    if($('#throwCard').length >0){
        $('#throwCard').show();
    }else{
        $('#button-div').html("<button id='throwCard'>Throw Card</button>")
    }
});

// ----------------------- EVENT 7. EMIT THROW CARD -----------------------
$('#button-div').on("click", "button#throwCard",function(){
    var params = jQuery.deparam(window.location.search);
    socket.emit('throwCard',socket.id, params.Room, playerHand[0]);
    $('#throwCard').hide();
});

