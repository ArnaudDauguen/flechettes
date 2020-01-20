class Gamemode{
    constructor(name){
        this.players = []
        this.name = name
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





    getName() { return this.name }
}

module.exports = Gamemode