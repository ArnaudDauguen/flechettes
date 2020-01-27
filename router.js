const env = process.env
const PORT = env.PORT || 3000

const express = require('express');
const router = express();
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const api = express()
api.set('view engine', 'hbs')
api.set('views', __dirname + '/views')


//body parsing
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: false }))
api.use(methodOverride('_method'))


api.use('/players', require('./routers/players.js'))
api.use('/games', require('./routers/games.js'))

//TODO return static files
// api.get('*', (req, res, next) => {
//     res.redirect(301, '/games')
// })

api.all('/', (req, res, next) => {
    res.format({
        html: function(){
            res.redirect(301, '/games')
        },
        json: function(){
            res.status(406).send('NOT_API_AVAILABLE')
        },
    })
})

// Error Middleware
//TODO
router.use((err, req, res, next) => {
    res.format({
      html: () => {
        console.log("error : " + err)
        res.render("error", {
          error: err
        })
      },
      json: () => {
        console.log("error : " + err)
        res.status(500).send(err)
      }
    })
  })



  
api.listen(PORT)

console.log(`http://localhost:${PORT}/`)

module.exports = router




/* COPYRIGHT © 2020 ARNAUD DAUGUEN - ALL RIGHTS RESERVED */