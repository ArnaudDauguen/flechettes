//TODO 2pts bonus sion arrive a annuler le dernier coup validé (seulemenet une fois le reste fini)

const inquirer = require('inquirer')
const prompt = inquirer.createPromptModule()



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


async function initGame(){
    let nbPlayer = await askNumberOfPlayers().then((rep) => {return rep})
    let gameMode = await askGameMode().then((rep) => {return rep})
    
}


initGame()