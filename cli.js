//TODO 2pts bonus sion arrive a annuler le dernier coup validé (seulemenet une fois le reste fini)

const inquirer = require('inquirer')
const prompt = inquirer.createPromptModule()

const Gamemode = require('./engine/gamemode.js')
const AroundTheWorld = require('./engine/gamemode/aroundTheWorld.js')
const Game301 = require('./engine/gamemode/game301.js')
const Cricket = require('./engine/gamemode/cricket.js')
const Player = require('./engine/player.js')



function askNumberOfPlayers(){
    return prompt({
        type: 'list',
        name: 'nbPlayer',
        message: 'How many players',
        choices: [2, 3, 4, '?'],
    }).then(async (answers) => {
        nbPlayer = answers.nbPlayer
        while(isNaN(nbPlayer) || nbPlayer < 2){
            nbPlayer = await prompt({
                type: 'number',
                name: 'nbPlayer',
                message: 'How many players',
            }).then((answers) => {
                return answers.nbPlayer
            })
        }
        return nbPlayer
    })

}

function askGameMode(){
    return prompt({
        type: 'list',
        name: 'gameMode',
        message: 'Which gamemode',
        choices: ['1. Le tour du monde', '2. le 301', '3. Le cricket'],
    }).then((answers) => {
        return answers.gameMode.slice(0,1)
    })

}

function createPlayerNameQuestion(playerNumber){
    return question = {
        type: 'input',
        name: playerNumber,
        message: `Name of player ${playerNumber}`,
        default: `Player ${playerNumber}`
    }

}

function createPlayers(nbPlayer, gameMode, game){
    let questionList = []
    for(let nb = 1; nb <= nbPlayer; nb++){
        questionList.push(createPlayerNameQuestion(nb))
    }
    return prompt(questionList)
    .then((answers) => {
        for(let nb = 1; nb <= nbPlayer; nb++){
            const player = new Player(answers[nb])
            //AroundTheWorld
            if(gameMode == 1)player.setTarget(1)
            //301
            if(gameMode == 2)player.setScore(301)
            //Cricket
            if(gameMode == 3){/*Gamemode does not exist for now*/}
            game.addPlayer(player)
        }
    })

}

function askForShot(){
    return prompt([
        {
            type: 'number',
            name: 'sector',
            message: 'Sector touched (0 to 20, 25)',
        },
        {
            type: 'multiplicator',
            name: 'multiplicator',
            message: 'multiplicator touched (1 to 3)',
        },
    ]).then((answers) => {
        if(answers.sector < 0) answers.sector = 0
        else if(answers.sector > 25) answers.sector = 0
        else if(answers.sector > 20 && answers.sector < 25) answers.sector = 0
        if(answers.multiplicator < 1) answers.multiplicator = 1
        else if(answers.multiplicator > 3) answers.multiplicator = 1
        if(answers.sector == 25 && answers.multiplicator == 3) answers.multiplicator = 2

        return answers
    })

}



async function play(){
    try {
    //init
        let gameMode = await askGameMode()
        const game = gameMode == 1 ? new AroundTheWorld() : (gameMode == 2 ? new Game301() : new Cricket())
        let nbPlayer = await askNumberOfPlayers()
        await createPlayers(nbPlayer, gameMode, game)
        game.shuflePlayers()


        //play
        let gameResponse
        do{
            console.log(game.getTurnInfos())
            
            let shot = await askForShot()
            gameResponse = game.handleShot(shot.sector, shot.multiplicator)
            if(gameResponse.message)
                console.log(`\n${gameResponse.message}`)
        } while(gameResponse.completion == false)

        console.log(`\nPartie terminée ! Victoire pour ${gameResponse.playing.getName()}`)
    
        
    } catch (error) {
        console.log(error)
    }
    
}


play()