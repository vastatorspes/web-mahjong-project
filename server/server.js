//testing 
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Players} = require('./utils/player');
const {Rooms} = require('./utils/room');
const card = require('./utils/card');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3500;
var app = express();

var server = http.createServer(app);
var io = socketIO(server);
var players = new Players();
var rooms = new Rooms();

var getPlayerHand = (id,room)=>{
    var roomState = rooms.getRoom(room);
    var name = players.getPlayerName(id);
    var playerHand = roomState.playerHand.find((player)=>player.name === name).hand;
    return playerHand;
}


app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    // join room ----------------------------------------------------------------------------------
    // region
    // validasi room penuh ga waktu mau mau login
    socket.on('playerLogin',(room, callback)=>{
        var roomPlayer = players.getPlayerList(room).length;
        if(roomPlayer >= 4){
            callback('Room is Full')
        }
        callback();
    });
    
    
    // ----------------------- EVENT 1. LISTEN JOIN ROOM -----------------------
    //region
    var id;
    socket.on('join', (params,callback)=>{
        username = params.Username;
        room = params.Room;
        existName = players.getPlayerName(username);
        if(existName){
            return callback("Username already taken")
        }
        var roomPlayer = players.getPlayerList(room).length;
        if(roomPlayer >= 4){ //validasi room pentuh waktu maksa masukin url
            return callback('Room is Full');
        }
        
        console.log('New Player Join');
        socket.join(room); // join room
        
        id = username;
        players.addPlayer(id, username, room); // setiap player yang join ditambahin ke arr player
        var playerList = rooms.getPlayerNames(players, room);
        io.to(room).emit('updatePlayerList', playerList); // update div nya player
        roomPlayer = players.getPlayerList(room).length; // ngambil ulang jumlah player
        
        console.log(JSON.stringify(players,undefined,2))
        console.log(roomPlayer)
        console.log(playerList)
        //----------------------- EVENT 2. RETURN CALLBACK GAME START -----------------------
        if(roomPlayer === 4){
            return callback('Room Ready');  
        }
        callback(); //gak ngasih apa-apa karna ga error
    });
    //endregion 
    // end join room ------------------------------------------------------------------------------
    
    
    ////----------------------- EVENT 2. LISTEN GAME START -----------------------
    //region
    socket.on('startGame', (params, callback)=>{
        // ngambil nama player pada room tersebut
        var names = rooms.getPlayerNames(players, params.Room); // players = seluruh player yang ada
        if (names.length === 4){
            rooms.addRoom(params.Room, names);
            //console.log(JSON.stringify(rooms, undefined, 2));
            
            var room = rooms.getRoom(params.Room); // ambil room
            
            // ----------------------- EVENT 2. EMIT CARD DEALER -----------------------
            
            io.to(params.Room).emit('initState', room.roomname);
            return callback(room.players); //player names 
        }
        callback();
    });
    
    socket.on('requestCard', (id,room) =>{
        playerHand = getPlayerHand(id,room);
        socket.emit('dealCard', playerHand); // kasih kartu
        players.updatePlayerHand(id, playerHand); // update player hand
        console.log(JSON.stringify(rooms, undefined, 2));
        console.log("requested")
    });
    //endregion
    // end making room ----------------------------------------------------
    
    ////----------------------- EVENT 3. LISTEN CHANGE CARD -----------------------
    socket.on('changeCard', (id, params, cards, callback)=>{
        var room = rooms.getRoom(params.Room); // ambil room
        var roomState = rooms.returnCards(params.Room, id, cards);
        //console.log(JSON.stringify(roomState, undefined, 2));
        // console.log('card returned')
        // console.log(cards);
        room.changeCard++;
        console.log(JSON.stringify(room, undefined, 2));
        var playerHand = getPlayerHand(id,params.Room);
        socket.emit('dealCard', playerHand); // kasih kartu
        players.updatePlayerHand(id, playerHand); // update player hand
        //callback("you change "+cards+" to "+playerHand.slice(playerHand.length-3,playerHand.length));
        callback("you change "+cards);
        if(room.changeCard === 4){
            //----------------------- EVENT 4. EMIT AFTER CHANGE -----------------------
            io.to(params.Room).emit('afterChange', room.currentTurn);
            var returnedCard = rooms.returnChangeCard(params.Room);
            // console.log(JSON.stringify(returnedCard, undefined,2));
            room.changeCard = 0;
            console.log("changecard")
            callback();
        }
        //console.log(JSON.stringify(rooms, undefined, 2));
    })

    ////----------------------- EVENT 5. LISTEN CHOOSE LACK -----------------------
    socket.on('chooseLack', (id, roomname, lackColor, callback)=>{
        var room = rooms.getRoom(roomname);
        players.updatePlayerLack(id, lackColor);
        callback("you choose lack "+lackColor);
        room.chooseLack++;
        if(room.chooseLack === 4){
            //----------------------- EVENT 6. EMIT AFTER LACK -----------------------
            io.to(roomname).emit('afterAction', room.currentTurn);
            // console.log(room.currentTurn);
            // console.log(players);
            room.chooseLack = 0;
            callback();
        }
        console.log(JSON.stringify(rooms, undefined, 2));
    })
    
    ////----------------------- EVENT 7. LISTEN DRAW CARD -----------------------
    socket.on('drawCard', (id, room, callback)=>{
        var name = players.getPlayerName(id);
        var playerHand = rooms.drawCard(name, room);
        socket.emit('dealCard', playerHand); // tampilin kartu di frontend
        players.updatePlayerHand(id, playerHand); // update kartu ke player data
        // console.log(players.getPlayer(id))
        // console.log(JSON.stringify(rooms, undefined, 2));
        if (callback) {
            callback("you drew "+playerHand[playerHand.length-1]);
        }
        callback();
    })
    
    ////----------------------- EVENT 8. LISTEN THROW CARD -----------------------
    socket.on('throwCard', (id, room, card)=>{
        var name = players.getPlayerName(id);
        var playerHand = rooms.throwCard(name, room, card);
        socket.emit('dealCard', playerHand); // tampilin kartu di frontend
        players.updatePlayerHand(id, playerHand); // update kartu ke player data
        rooms.changeTurn(name, room); //change turn
        
        var room = rooms.getRoom(room); // ambil room
        console.log(room.currentTurn);
        io.to(room.roomname).emit('afterAction', room.currentTurn);
        //----------------------- EVENT 11. EMIT OTHERS THROW -----------------------
        io.to(room.roomname).emit('othersThrow', name, card);
    });
    
    
    // not tested events---------------------------------------------------------
    // region
    
    ////----------------------- EVENT 9. LISTEN COMMAND -----------------------
    socket.on('getCommand', (id, cmd, card)=>{
        var obj = {command:cmd, card:card}
        players.updatePlayerCommand(id, obj);
        //socket.emit('showCommand', obj); //kasih ke front end
    })
    
    ////----------------------- EVENT 10. LISTEN SUCCESS COMMAND -----------------------
    socket.on('onSuccess', (id, cmd, card, score)=>{
        var name = players.getPlayerName(id);
        var room = players.getPlayerRoom(id);
        var fromName = rooms.getRoom(room).roomField[0].name;
        
        players.updatePlayerScore(id, score);
        rooms.changeTurn(name, room); //change turn
        
        //----------------------- EVENT 12. EMIT OTHERS COMMAND -----------------------
        io.to(room).emit('othersCommand',name, fromName, cmd, card, score);
    })
    
    ////----------------------- EVENT 13. LISTEN END GAME -----------------------
    socket.on('endGame', (room, result)=>{
        var player = players.getPlayerList(room);
        var result = [];
        player.forEach((p)=>{
            var obj = {};
            obj['name'] = p.name;
            obj['score'] = p.score;
            result.push(obj);
        });
    })
    // endregion
    
    // on disconnect
    // region
    socket.on('disconnect', ()=>{
        var playerRoom = players.getPlayerRoom(id);
        var player = players.removePlayer(id);
        var playerList = rooms.getPlayerNames(players, playerRoom);
        if(player){
            io.to(player.room).emit('updatePlayerList', playerList);
        }
        console.log('disconnected')
    });
    // endregion
    
});


server.listen(port, ()=>{
    console.log('Server is Running on Port '+port);
});