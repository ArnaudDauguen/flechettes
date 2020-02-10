const router = require('express')()
const Games = require('./../models/games')
const { NotFoundError, BadRequestError, NotAcceptableError, NotApiAvailableError, PlayerNotDeletableError, ServerError , CantCreateUserError} = require('./../errors/errors.js')


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
    if (["around-the-world", "301", "cricket"].indexOf(input.mode) === -1)
        return next(new BadRequestError())

    const game = await Games.create([input.name, input.mode])

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