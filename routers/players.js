const router = require('express')()
const Players = require('./../models/players')
const { NotFoundError, BadRequestError, NotAcceptableError, NotApiAvailableError, PlayerNotDeletableError, ServerError , CantCreateUserError} = require('./../errors/errors.js')


router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    if (id % 1 !== 0)
        return next(new BadRequestError())
        
    const player = await Players.findOne(id)
    if (player === null || player === undefined)
        return next(new NotFoundError())

    let nbCurrentGames = await Players.getNumberOfStartedGameByPlayerId(id)
    nbCurrentGames = nbCurrentGames.nb
    if (nbCurrentGames % 1 !== 0)
        return next(new PlayerNotDeletableError())

    await Players.delete(id)

    res.format({
        html: function () {
            res.redirect(301, "/players/")
        },
        json: function () {
            res.status(204).send()
        },
    })

})


router.patch('/:id', async (req, res, next) => {
    const input = req.body
    const id = req.params.id
    if (id % 1 !== 0)
        return next(new BadRequestError())
    let changes = {}

    if (input.name)
        changes.name = input.name
    if (input.email)
        changes.email = input.email
    // id must be the last param
    changes.id = id

    const player = await Players.updatePlayer(changes)
    if (player === null || player === undefined)
        return next(new NotFoundError())

    res.format({
        html: function () {
            res.redirect(301, "/players")
        },
        json: function () {
            res.status(200).send(player)
        },
    })

})


router.get('/:id/edit', async (req, res, next) => {
    const id = req.params.id
    if (id % 1 !== 0)
        return next(new BadRequestError())

    const player = await Players.findOne(id)
    if (player === null || player === undefined)
        return next(new NotFoundError())

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
    if (id % 1 !== 0)
        return next(new BadRequestError())

    const player = await Players.findOne(id)
    if (player === null || player === undefined)
        return next(new NotFoundError())

    res.format({
        html: function () {
            res.redirect(301, `/players/${player.id}/edit`)
        },
        json: function () {
            res.status(201).send(player)
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
    if (input.name === undefined || input.email === undefined)
        return next(new BadRequestError())

    const nbEmailInUse = Players.getNumberOfTimeUsingEmail(email)
    if(nbEmailInUse.nb % 1 !== 0 )
        return next(new CantCreateUserError())

    const player = await Players.create([input.name, input.email])

    res.format({
        html: function () {
            res.redirect(301, `/players/${player.id}`)
        },
        json: function () {
            res.status(201).send(player)
        },
    })

})

router.get('/', async (req, res, next) => {
    let limit = (!isNaN(req.query.limit) && req.query.limit >= 0 && req.query.limit <= 20) ? req.query.limit : 10
    let offset = (!isNaN(req.query.page) && req.query.page >= 1) ? (req.query.page - 1) * limit : 0
    let order = ["name", "email", "gameWin", "gameLost"].indexOf(req.query.sort) >= 0 ? req.query.sort : "rowid"
    let reverse = req.query.reverse !== undefined ? "DESC" : "ASC"

    const players = await Players.findAllPlayers(order, limit, offset, reverse)

    res.format({
        html: function () {
            //TODO res.render
            res.send(200)
        },
        json: function () {
            res.send(players)
        },
    })
})


module.exports = router


/* COPYRIGHT © 2020 ARNAUD DAUGUEN - ALL RIGHTS RESERVED */