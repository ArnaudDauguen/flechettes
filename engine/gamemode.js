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

    getTurnInfos(){
        let rep = '\n'
        if(this.shotSinceLastPlayerChange == 0)
            rep += `\nC'est au tour de ${this.players[0].getName()}`
        else if(this.shotSinceLastPlayerChange < this.players[0].getMaxShot())
            rep += `\nEncore à ${this.players[0].getName()}`
        if(this.players[0].getTarget() != undefined && this.players[0].getTarget() != null)
            rep += `\nObjectif : ${this.players[0].getTarget()}`
        if(this.players[0].getScore() != undefined && this.players[0].getScore() != null)
            rep += `\nScore : ${this.players[0].getScore()}`
        if(this.shotSinceLastPlayerChange >= this.players[0].getMaxShot() -1)
            rep += `\n${this.players[1].getName()} prépare toi, tu joue après`
        return rep
    }

    getPlayerTurn(){
        return {
            completion: this.isComplete,
            playing: this.players[0],
            nextPlayer: this.players[1]
        }
    }

    nextTurn(message){
        this.shotSinceLastPlayerChange++
        if(this.shotSinceLastPlayerChange >= this.players[0].getMaxShot()){
            this.addPlayer(this.players.shift())
            this.shotSinceLastPlayerChange = 0
        }
        const rep = this.getPlayerTurn()
        if(message != null && message != undefined) rep.message = message
        return rep
    }




    endGame() { 
        this.isComplete = true
        return this.getPlayerTurn()
    }

    getName() { return this.gamemodeName}

    isCompleted() {return this.isComplete}
}

module.exports = Gamemode