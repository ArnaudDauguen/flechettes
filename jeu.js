class Jeu{
    constructor(){
        this.players = []
    }

    static shuffle(players) {
        for (let i = players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [players[i], players[j]] = [players[j], players[i]];
        }
        return players;
    }
    addPlayer(player){
        this.players.push(player)
    }

    shuflePlayer(){
        this.players = jeux.shuffle(this.players)
    }
}

module.exports = Jeu