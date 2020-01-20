const Gamemode = require('../gamemode.js')

class Game301 extends Gamemode{
    constructor(){
        super("301")
        
    }

    handleShot(shot){
        const player = super.getPlayerTurn().playing
        const shotScore = shot.secteur * shot.multiply
        if(shotScore <= player.getScore()){
            player.addOrSubScore(- shotScore)
            return player.getScore() == 0 ? super.endGame() : super.nextTurn()
        }
        return super.nextTurn()
    }


    
}

module.exports = Game301