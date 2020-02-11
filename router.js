const env = process.env
const PORT = env.PORT || 3000
const { HttpError, ServerError, NotAcceptableError, NotApiAvailableError } = require('./errors/errors.js')

const express = require('express');
const router = express();
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')


//body parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


app.use('/players', require('./routers/players.js'))
app.use('/games', require('./routers/games.js'))

//TODO return static files
// app.get('*', (req, res, next) => {
//     res.redirect(301, '/games')
// })

// app.all('/', (req, res, next) => {
//     res.format({
//         html: function(){
//             res.redirect(301, '/games')
//         },
//         json: function(){
//             throw new NotAcceptableError()
//         },
//     })
// })

app.get('/', (req, res, next) => {

    res.format({
        html: function () {
            res.redirect(301, "/games")
        },
        json: function () {
            throw new NotApiAvailableError()
        },
    })
})

// Error Middleware
//TODO
app.use((error, req, res, next) => {
    if (!(error instanceof HttpError)) {
        console.error("API ERROR", error)
        error = new ServerError()
    }

    res.format({
        html: () => {
            res.render("error", {
                error: error
            })
        },
        json: () => {
            res.status(error.status || 500).json({ error })
        }
    })
})




app.listen(PORT)

console.log(`http://localhost:${PORT}/`)

module.exports = router




/* COPYRIGHT © 2020 ARNAUD DAUGUEN - ALL RIGHTS RESERVED */