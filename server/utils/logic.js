var cardChanger = (cards, turn) =>{
    var changedCard = []
    var turn1 = turn[0];
    var turn2 = turn[1];
    var turn3 = turn[2];
    var turn4 = turn[3];

    var p1Card = cards.find(c => c.name === turn1).card;
    var p2Card = cards.find(c => c.name === turn2).card;
    var p3Card = cards.find(c => c.name === turn3).card;
    var p4Card = cards.find(c => c.name === turn4).card;
    
    var rand = Math.floor(Math.random() * 3);
    if(rand === 0){
        var changedCard = [
            {"name": turn1, "card": p4Card},
            {"name": turn2, "card": p1Card},
            {"name": turn3, "card": p2Card},
            {"name": turn4, "card": p3Card}
        ]
    }
    else if(rand === 1){
        var changedCard = [
            {"name": turn1, "card": p2Card},
            {"name": turn2, "card": p3Card},
            {"name": turn3, "card": p4Card},
            {"name": turn4, "card": p1Card}
        ]
    }
    else if(rand === 2){
        var changedCard = [
            {"name": turn1, "card": p3Card},
            {"name": turn2, "card": p4Card},
            {"name": turn3, "card": p1Card},
            {"name": turn4, "card": p2Card}
        ]
    }
    return changedCard
}

module.exports.cardChanger = cardChanger;