const Gamemode = require('../gamemode.js')

class AroundTheWorld extends Gamemode{
    constructor(){
        super("Tour du monde")
        this.targetVictory = 5
    }

    handleShot(secteur, multiply){
        const player = super.getPlayerTurn().playing
        const playerTarget = player.getTarget()
        if(secteur == playerTarget){
            if(playerTarget == this.targetVictory)
                return super.endGame(/*`Partie terminée ! Victoire pour ${player.getName()}`*/)
            player.setTarget(playerTarget +1)
            return super.nextTurn(`objectif atteint, suivant : ${playerTarget +1}`)
        }
        return super.nextTurn()
    }


}

module.exports = AroundTheWorld