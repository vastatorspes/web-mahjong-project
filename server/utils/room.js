var card = require('./card.js');
var {cardChanger} = require('./logic.js');

class Rooms{
    constructor(){
        this.rooms = [];
    }
    
    addRoom(roomname, players){
        // generate random deck
        for (var a=[],i=0;i<27;++i) a[i]=i;
        
        var j = 0;
        var deckString = ['c1', 'c2', 'c3','c4', 'c5', 'c6','c7', 'c8', 'c9',
                          'd1', 'd2', 'd3','d4', 'd5', 'd6','d7', 'd8', 'd9',
                          'b1', 'b2', 'b3','b4', 'b5', 'b6','b7', 'b8', 'b9',]
        while (j < 27) {a[j] = deckString[j]; j++;}
        
        a = a.concat(a).concat(a).concat(a);  
        var deck = card.shuffle(a);
        
        
        var roomState= this.generateState(roomname, players, deck, 13);
        this.rooms.push(roomState);
        return roomState;
    }
    
    generateState(roomname, players, deck, cards){
        var currentDeck = deck;
        var playerHand = [];
        players.forEach((player)=>{
            var key = player;
            var draw = currentDeck.slice(0,cards);
            var obj = {};
            obj['name'] = key;
            obj['hand'] = draw;
            playerHand.push(obj);
            currentDeck = currentDeck.slice(cards, currentDeck.length);
        });
        var playerTurn = [players[0],players[1],players[2],players[3]]
        var currentTurn = players[0];
        var changeCard = 0;
        var chooseLack = 0;
        var roomField = [];
        var roomChangeCard = [];
        var roomState = {roomname, players, currentDeck, playerHand, currentTurn, changeCard, chooseLack, roomField, roomChangeCard, playerTurn}
        return roomState;
    }
    
    getPlayerNames({players}, room){
        var players = players.filter((player)=>player.room === room);
        var namesArray = players.map((player) => player.name);
        return namesArray;
    }
    
    getRoom(room){
        var getroom = this.rooms.find((r) => r.roomname === room);
        return getroom;
    }
    
    returnCards(room, name, card){
        var room = this.rooms.find((r) => r.roomname === room);
        var playerHand = room.playerHand.find(x => x.name === name).hand;
        
        for (var i=0; i < card.length; i++){
            var returnedCard = playerHand.find( c => c === card[i]);
            playerHand.splice(playerHand.indexOf(returnedCard),1);
        }
        room.roomChangeCard.push({name,card})
        return room;
    }

    returnChangeCard(room){
        var room = this.rooms.find((r) => r.roomname === room);
        var players = room.players;
        var changeCard = room.roomChangeCard;
        var playerTurn = room.playerTurn;
        var returnedCard = cardChanger(changeCard, playerTurn);
        players.forEach((player)=>{
            var playerHand = room.playerHand.find(x => x.name === player).hand;
            var addPlayerHand = returnedCard.find(x => x.name === player).card;
            addPlayerHand.forEach((card)=>{
                playerHand.push(card);                
            })
        });
        return room
    }

    getTopCard(roomname){
        var room = this.getRoom(roomname);
        var top = room.currentDeck[0];
        return top
    }

    drawCard(name, roomname){
        var room = this.getRoom(roomname);
        if(room.currentDeck.length == 0){
            return "gameEnd"
        }
        var top = room.currentDeck[0];
        room.currentDeck.splice(0,1); // buang kartu paling atas di deck
        var playerHand = room.playerHand.find(x => x.name === name).hand;
        playerHand.push(top); // kasih kartu ke player
        return playerHand;
    }
    
    throwCard(name, room, card){
        var room = this.getRoom(room);
        var playerHand = room.playerHand.find(x => x.name === name).hand;
        var returnedCard = playerHand.find( c => c === card);
        playerHand.splice(playerHand.indexOf(returnedCard),1);
        this.updateRoomField(room.roomname, {name, card})
        return playerHand;
    }
    changeTurn(name, room){
        var room = this.getRoom(room);
        var names = room.players;
        var nameIndex = names.indexOf(name);
        if(nameIndex === 3){
            room.currentTurn = room.players[0];
        }else{
            room.currentTurn = room.players[nameIndex+1];
        }
        return room;
    }
    
    updateRoomField(roomname, field){
        var room = this.getRoom(roomname).roomField;
        return room.unshift(field);
    }
}

module.exports = {Rooms};