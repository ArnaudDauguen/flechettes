class Gamemode{
    constructor(gamemodeName){
        if (this.constructor === Gamemode) {
            throw new TypeError('Abstract class "Gamemode" cannot be instantiated directly');
        }
        this.players = []
        this.gamemodeName = gamemodeName
        this.isComplete = false
        this.shotSinceLastPlayerChange = 0
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
    getPlayers(){
        return this.players
    }

    shuflePlayers(){
        this.players = Gamemode.shuffle(this.players)
    }

    getPlayerTurn(){
        return {
            completion: this.isComplete,
            playing: this.players[0],
            nextPlayer: this.players[1]
        }
    }

    nextTurn(){
        this.shotSinceLastPlayerChange++
        if(this.shotSinceLastPlayerChange >= this.players[0].getMaxShot()){
            this.addPlayer(this.players.shift())
            this.shotSinceLastPlayerChange = 0
        }
        return this.getPlayerTurn()
    }




    endGame() { 
        this.isComplete = true
        return this.getPlayerTurn()
    }

    getName() { return this.gamemodeName}

    isCompleted() {return this.isComplete}
}

module.exports = Gamemode