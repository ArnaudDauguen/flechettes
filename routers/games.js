const router = require('express')()
const Games = require('./../models/games')
const { NotFoundError, BadRequestError, NotAcceptableError, NotApiAvailableError, ServerError, GameNotEditableError, GameNotStartableError, GamePlayerMissingError} = require('./../errors/errors.js')



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
            //TODO res.render
            res.send(200)
        },
        json: function () {
            res.status(201).send(game)
        },
    })

})


router.get('/new', (req, res, next) => {
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


router.post('/', async (req, res, next) => {
    const input = req.body
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
            //TODO res.render
            res.send(200)
        },
        json: function () {
            res.send(games)
        },
    })
})


module.exports = router


/* COPYRIGHT © 2020 ARNAUD DAUGUEN - ALL RIGHTS RESERVED */