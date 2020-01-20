class Player{
    constructor(name, score = 0, target = null, maxShot = 1){
        this.name = name
        this.score = score
        this.target = target
        this.maxShot = maxShot
    }


    addOrSubScore(toAdd){
        this.score += toAdd
        return this.score
    }


    getScore(){return this.score}
    getName(){return this.name}
    getTarget(){return this.target}
    getMaxShot(){return this.maxShot}
    setScore(newScore){this.score = newScore}
    setTarget(newTarget){this.target = newTarget}
    setMaxShot(newShotLeft){this.maxShot = newShotLeft}
}

module.exports = Player