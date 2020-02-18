const env = process.env

const db = require('sqlite')
const express = require('express')


db.open('api.db').then(() => {
  Promise.all([
    db.run("CREATE TABLE IF NOT EXISTS game (mode, name, currentPlayerId, status, createdAt)"),
    db.run("CREATE TABLE IF NOT EXISTS player (name, email, gameWin, gameLost, createdAt)"),
    db.run("CREATE TABLE IF NOT EXISTS gameShot (gameId, playerId, sector, multiplicator, createdAt)"),
    db.run("CREATE TABLE IF NOT EXISTS gamePlayer (gameId, playerId)"),
  ]).then(() => {
    console.log('Databases are ready')
  }).catch((err) => {
    console.log('Something broke :', err)
  })
})



require('./router.js')
