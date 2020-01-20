const Gamemode = require('../gamemode.js')

class AroundTheWorld extends Gamemode{
    constructor(){
        super("Tour du monde")
        this.targetVictory = 20
    }

    handleShot(shot){
        const player = super.getPlayerTurn().playing
        const playerTarget = player.getTarget()
        if(shot.secteur == playerTarget){
            if(playerTarget == this.targetVictory)
                return super.endGame()
                
            player.setTarget(playerTarget +1)
        }
        return super.nextTurn()
    }


}

module.exports = AroundTheWorld