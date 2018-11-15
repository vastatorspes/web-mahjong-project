class Players{
    constructor(){
        this.players = [];
    }
    
    addPlayer(id, name, room, hand, command,score){
        var hand = [];
        var lack = Number;
        var door = [];
        var command = [];
        var score = 0;
        var player = {id, name, room, hand, lack, command, door, score};
        this.players.push(player);
        return player;
    }
    
    getPlayer(id){
        return this.players.find((player)=> player.id === id); // ambil dari array users yang id nya sama
    }
    
    updatePlayerHand(id, hand){
        var player = this.getPlayer(id);
        player.hand = hand;
    }
    
    updatePlayerLack(id, lack){
        var player = this.getPlayer(id);
        player.lack = lack;
    }
    
    updatePlayerCommand(id, command){
        var player = this.getPlayer(id);
        player.command = command;
    }
    updatePlayerScore(id, score){
        var player = this.getPlayer(id);
        player.score = score;
    }
    removePlayer(id){
        var player = this.getPlayer(id);
        if (player){
            this.players = this.players.filter((player)=> player.id != id);
        }
        return player;
    }
    
    getPlayerList(room){
        var player = this.players.filter((player) => player.room === room);
        return player;
    }
    
    getPlayerName(id){
        var player = this.players.find((player)=>player.id === id);
        if(player){
            var name= player.name;
            return name;
        }
    }
    getPlayerRoom(id){
        var player = this.players.find((player)=>player.id === id);
        if(player){
            var room= player.room;
            return room;            
        }
    }

    getPlayerHand(id){
        var player = this.players.find((player)=>player.id === id);
        if(player){
            var hand = player.hand;
            return hand;
        }
    }
}

module.exports = {Players};