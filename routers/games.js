const router = require('express')()
const Games = require('./../models/games')
const { NotFoundError, BadRequestError, NotAcceptableError, NotApiAvailableError, PlayerNotDeletableError, ServerError , CantCreateUserError} = require('./../errors/errors.js')

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