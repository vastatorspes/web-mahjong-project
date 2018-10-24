var card = require('./card.js');

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
        var roomState = {roomname, players, currentDeck, playerHand}
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
    
    //-------------- 10/24 --------------
    /*returnCards(room, name, card){
        var room = this.rooms.find((r) => r.roomname === room);
        var playerHand = room.playerHand.find(x => x.name === name).hand;
        
        // balikin kartu ke deck
        for (var i=0; i < card.length; i++){
            room.currentDeck.push(playerHand[card[i]-i]);
            playerHand.splice(card[i]-i, 1);
            playerHand.push(room.currentDeck[0]) // ngasih kartu dari deck
            room.currentDeck.splice(0,1)
        }
        return room;
    }*/
    //-------------- 10/24 --------------
}

module.exports = {Rooms};