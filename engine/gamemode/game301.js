const Gamemode = require('../gamemode.js')

class Game301 extends Gamemode{
    constructor(){
        super("301")
        
    }

    handleShot(secteur, multiply){
        const player = super.getPlayerTurn().playing
        const shotScore = secteur * multiply
        if(shotScore < player.getScore() || (shotScore == player.getScore() && multiply == 2)){
            player.addOrSubScore(- shotScore)
            return player.getScore() == 0 ? super.endGame() : super.nextTurn()
        }
        return super.nextTurn()
    }


    
}

module.exports = Game301