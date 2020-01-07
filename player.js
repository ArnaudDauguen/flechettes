class Player{
    constructor(name, score = 0){
        this.name = name
        this.score = score
    }


    getScore(){return this.score}

    // get score() {
    //     return this.score
    // }

    // set score(score) {
    //     this.score = score
    // }
}

module.exports = Player