const router = require('express')();
const Players = require('./../models/players');
const { NotFoundError, BadRequestError, NotAcceptableError, ServerError } = require('./../errors/errors.js')


router.post('/', async (req, res, next) => {
    const input = req.params
    if(input.name === undefined || input.email === undefined)
        throw new BadRequestError()
    const player = await Players.create([input.name, input.email])
    
    res.format({
        html: function(){
            res.redirect(301, `/players/${player.id}`)
        },
        json: function(){
            res.status(201).send(player)
        },
    })
    
})

router.get('/', async (req, res, next) => {
    let limit = (!isNaN(req.query.limit) && req.query.limit >= 0 && req.query.limit <= 20) ? req.query.limit : 10
    let offset = (!isNaN(req.query.page) && req.query.page >= 1) ? (req.query.page -1) * limit : 0
    let order = ["name", "email", "gameWin", "gameLost"].indexOf(req.query.order) >= 0 ? req.query.order : "rowid"
    let reverse = req.query.reverse !== undefined ? "DESC" : "ASC"

    const players = await Players.findAllPlayers(order, limit, offset, reverse)
    
    res.format({
        html: function(){
            //res.render
        },
        json: function(){
            res.send(players)
        },
    })
})

module.exports = router


/* COPYRIGHT © 2020 ARNAUD DAUGUEN - ALL RIGHTS RESERVED */