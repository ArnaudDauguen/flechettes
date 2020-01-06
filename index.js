//TODO 2pts bonus sion arrive a annuler le dernier coup validé (seulemenet une fois le reste fini)

const inquirer = require('inquirer')
const prompt = inquirer.createPromptModule()

const Jeu = require('./jeu.js')
const TourDuMonde = require('./jeux/tourDuMonde.js')
const Game301 = require('./jeux/game301.js')
const Cricket = require('./jeux/cricket.js')
const Player = require('./player.js')



function askNumberOfPlayers(){
    return prompt({
        type: 'list',
        name: 'nbPlayer',
        message: 'How many players',
        choices: [2, 3, 4, '?'],
    }).then(async (answers) => {
        nbPlayer = answers.nbPlayer
        while(isNaN(nbPlayer)){
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
        message: 'How many players',
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



async function initGame(){
    let nbPlayer = await askNumberOfPlayers().then((rep) => {return rep})
    let gameMode = await askGameMode().then((rep) => {return rep})
    const partie = gameMode == 1 ? new TourDuMonde() : (gameMode == 2 ? new Game301() : new Cricket())
    let players = []


    let questionList = []
    for(let nb = 1; nb <= nbPlayer; nb++){
        questionList.push(createPlayerNameQuestion(nb))
    }
    await prompt(questionList)
    .then((answers) => {
        for(let nb = 1; nb <= nbPlayer; nb++){
            players.push(new Player(answers[nb]))
        }
    })


    console.log(players[0].getScore())

    
    

}


initGame()