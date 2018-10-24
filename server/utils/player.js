class Players{
    constructor(){
        this.players = [];
    }
    
    addPlayer(id, name, room, hand){
        var hand = [];
        var player = {id, name, room, hand};
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
        var name= player.name;
        return name;
    }
}

module.exports = {Players};