const router = require('express')()
const Games = require('./../models/games')
const Players = require('./../models/players')
const GameShots = require('./../models/shots')
const { NotFoundError, 
    BadRequestError, 
    PlayersNotAddableError, 
    PlayerNotDeletableError, 
    NotApiAvailableError, 
    GameNotEditableError, 
    GameNotStartableError, 
    GamePlayerMissingError, 
    CantCreateUserError,
    GameEndedError,
    GameNotStartedError,
    CantCreateShotError
} = require('./../errors/errors.js')


router.post('/:id/shots'), async (req, res, next) => {
    const id = req.params.id
    const sector = req.body.sector
    const multiplicator = req.body.multiplicator
    if (id % 1 !== 0)
        return next(new BadRequestError())
    if (sector === undefined || sector === null || multiplicator === undefined || multiplicator === null)
        return next(new BadRequestError())
    
    const game = await Games.findOne(id)
    if (game === null || game === undefined)
        return next(new NotFoundError())

    if(game.status !== "draft")
        return next(new GameNotStartedError())
    if(game.status !== "ended")
        return next(new GameEndedError())

    const shot = await GameShots.addShot(id, game.currentPlayerId || -1, sector, multiplicator)
    if(shot === null || shot === undefined)
        return next(new CantCreateShotError())
    

    res.format({
        html: function () {
            res.redirect(301, `/games/${id}`)
        },
        json: function () {
            res.status(204).send()
        },
    })
}


router.delete('/:id/players', async (req, res, next) => {
    const id = req.params.id
    const playerIds = req.query.id
    if (id % 1 !== 0)
        return next(new BadRequestError())
    if (playerIds === undefined || playerIds === null)
        return next(new BadRequestError())
        
    
    const game = await Games.findOne(id)
    if (game === null || game === undefined)
        return next(new NotFoundError())
    
    if(game.status !== "draft")
        return next(new PlayerNotDeletableError())

    
    //foreact qui marche sur id ou [id]
    for(pId of playerIds){
        if(pId % 1 !== 0)
            return next(new BadRequestError())
    }

    await Games.removePlayersForGame(id, playerIds)

    res.format({
        html: function () {
            res.redirect(301, `/games/${id}/players`)
        },
        json: function () {
            res.status(204).send()
        },
    })

})


router.post('/:id/players', async (req, res, next) => {
    const id = req.params.id
    if (id % 1 !== 0)
        return next(new BadRequestError())

    const input = req.body
    if(input.players === undefined || input.players === null)
        return next(new BadRequestError())
        
    const game = await Games.findOne(id)
    if (game === null || game === undefined)
        return next(new NotFoundError())

    if(game.status !== "draft")
        return next(new PlayersNotAddableError())

    // Update userList for traitment (remove users already playing)
    const existingPlayer = await Games.getPlayersByGameId(id)
    const existingPlayerIds = existingPlayer.map((item) => item.id)
    input.players = input.players.filter((item) => existingPlayerIds.indexOf(item) === -1)


    let playerIds = []
    for (let item of input.players){
        // IMPORT PLAYER
        if(item % 1 === 0){
            const player = await Players.findOne(item)
            if(player === undefined || player === null)
                return next(new NotFoundError())
            playerIds.push(item)
        }else{
            // BONUS IN USE
            // CREATE NEW PLAYER
            if (item.name === undefined || item.name === null || item.email === undefined || item.email === null)
                return next(new BadRequestError())

            let nbEmailInUse = await Players.getNumberOfTimeUsingEmail(item.email)
            if(nbEmailInUse.nb !== 0 )
                return next(new CantCreateUserError())

            const player = await Players.create([item.name, item.email])
            playerIds.push(player.id)
        }
    }
    await Games.addPlayersForGameId(id, playerIds)

    res.format({
        html: function () {
            res.redirect(301, `/games/${id}/players`)
        },
        json: function () {
            res.status(204).send()
        },
    })

})


router.get('/:id/players', async (req, res, next) => {
    const id = req.params.id
    if (id % 1 !== 0)
        return next(new BadRequestError())
        
    const game = await Games.findOne(id)
    if (game === null || game === undefined)
        return next(new NotFoundError())

    const players = await Games.getPlayersByGameId(id)

    res.format({
        html: function () {
            //TODO qqchose
        },
        json: function () {
            res.status(201).send(players)
        },
    })

})


router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    if (id % 1 !== 0)
        return next(new BadRequestError())
        
    const game = await Games.findOne(id)
    if (game === null || game === undefined)
        return next(new NotFoundError())

    await Games.delete(id)

    res.format({
        html: function () {
            res.redirect(301, "/games/")
        },
        json: function () {
            res.status(204).send()
        },
    })

})


router.patch('/:id', async (req, res, next) => {
    const input = req.body

    if(input.name === undefined && input.mode === undefined && input.status === undefined)
        return next(new BadRequestError())

    const id = req.params.id
    if (id % 1 !== 0)
        return next(new BadRequestError())

    let game = await Games.findOne(id)
    if (game === null || game === undefined)
        return next(new NotFoundError())

    if(game.status === "ended")
        return next(new GameNotEditableError())

    if(game.status === "started" && input.status === "started")
        return next(new GameNotStartableError())

    if(game.status === "started" && input.status !== "ended")
        return next(new GameNotEditableError())

    let nbGamePlayers = await Games.getNbPlayersByGameId(id)
    nbGamePlayers = nbGamePlayers.nb
    if(nbGamePlayers === 0 && input.status === "started")
        return next(new GamePlayerMissingError())
    

    let changes = {}
    if (input.name && game.status != "started")
        changes.name = input.name
    if (input.mode && game.status != "started")
        changes.mode = input.mode
    if (input.status)
        changes.status = input.status
    // id must be the last param
    changes.id = id

    game = await Games.updateGame(changes)
    res.format({
        html: function () {
            res.redirect(301, `/games/${id}`)
        },
        json: function () {
            res.status(200).send(game)
        },
    })

})


router.get('/:id/edit', async (req, res, next) => {
    const id = req.params.id
    if (id % 1 !== 0)
        return next(new BadRequestError())

    const game = await Games.findOne(id)
    if (game === null || game === undefined)
        return next(new NotFoundError())
    
    game.players = await Games.getPlayersByGameId(id)
    game.shots = await Games.getShotsByGameId(id, 5)

    res.format({
        html: function () {
            //TODO res.render
            res.send(200)
        },
        json: function () {
            throw new NotApiAvailableError()
        },
    })

})


router.get('/new', (req, res, next) => {
    res.format({
        html: function () {
            res.render("form_game", {})
        },
        json: function () {
            throw new NotApiAvailableError()
        },
    })

})


router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const include = req.query.include == "gamePlayers"
    if (id % 1 !== 0)
        return next(new BadRequestError())

    const game = await Games.findOne(id)
    if (game === null || game === undefined)
        return next(new NotFoundError())

    if(include)
        game.players = await Games.getPlayersByGameId(id)
    game.shots = await Games.getShotsByGameId(id, 5)

    res.format({
        html: function () {
            let content = ""
            
            res.render("show", {
                title: `Game ${id} infos`,
                h1Title: `Game ${id}`,
                content: content,
            })
        },
        json: function () {
            res.status(201).send(game)
        },
    })

})


router.post('/', async (req, res, next) => {
    if (input.name === undefined || input.mode === null || input.mode === undefined || input.mode === null)
        return next(new BadRequestError())
    if (["around-the-world", "301", "cricket"].indexOf(input.mode) === -1)
        return next(new BadRequestError())

    const game = await Games.create([input.mode, input.name])

    res.format({
        html: function () {
            res.redirect(301, `/games/${game.id}`)
        },
        json: function () {
            res.status(201).send(game)
        },
    })

})

router.get('/', async (req, res, next) => {
    let limit = (!isNaN(req.query.limit) && req.query.limit >= 0 && req.query.limit <= 20) ? req.query.limit : 10
    let offset = (!isNaN(req.query.page) && req.query.page >= 1) ? (req.query.page - 1) * limit : 0
    let order = ["name", "status"].indexOf(req.query.sort) >= 0 ? req.query.sort : "rowid"
    let gameStatus = ["draft", "started", "ended"].indexOf(req.query['f.status']) >= 0 ? req.query['f.status'] : "draft"
    let reverse = req.query.reverse !== undefined ? "DESC" : "ASC"

    const games = await Games.findAll(order, limit, offset, reverse, gameStatus)

    res.format({
        html: function () {
            let content = '<table class="table"><tr><th>game id</th><th>gamemode</th><th>name</th><th>current player</th><th>game status</th><th>creation date</th></tr>'
            //TODO convert plaerId to playerName
            games.forEach((game => {
                content = `${content}<tr><td>${game.id}</td><td>${game.mode}</td><td>${game.name}</td><td>${game.currentPlayerId}</td><td>${game.status}</td><td>${game.createdAt}</td>`
                content = `${content}<td><form action="/games/${game.id}/?_method=GET", method="GET"> <button type="submit" class="btn btn-success"><i class="fa fa-pencil fa-lg mr-2"></i>See</button> </form> </td>`
                content = `${content}<td><form action="/games/${game.id}/?_method=DELETE", method="POST"> <button type="submit" class="btn btn-danger"><i class="fa fa-pencil fa-lg mr-2"></i>Delete</button> </form> </td>`
                content = `${content}</tr>`
            }))
            content = `${content}</table>`
            content = `${content}<form action="/players/?_method=GET", method="GET"> <button type="submit" class="btn btn-succes"><i class="fa fa-pencil fa-lg mr-2"></i>ManagePlayers</button> </form> </td>`
            content = `${content}<form action="/games/new?_method=GET", method="GET"> <button type="submit" class="btn btn-succes"><i class="fa fa-pencil fa-lg mr-2"></i>New game</button> </form> </td>`
            
            res.render("show", {
                title: "game list",
                h1Title: "Game list",
                content: content,
            })
        },
        json: function () {
            res.status(201).send(games)
        },
    })
})


module.exports = router


/* COPYRIGHT © 2020 ARNAUD DAUGUEN - ALL RIGHTS RESERVED */