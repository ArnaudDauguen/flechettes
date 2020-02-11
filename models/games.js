
const db = require('sqlite')
const _ = require('lodash')

module.exports = {
    findAll(order = "rowid", limit = 10, offset = 0, desc = "ASC", gameStatus) {
        let where = ""
        if (gameStatus !== undefined && gameStatus !== null)
            where = `WHERE status = '${gameStatus}' `
        return db.all(`SELECT rowid AS id, * FROM game ${where}ORDER BY ${order} ${desc} LIMIT ? OFFSET ?`, [limit, offset])
    },
    findAllGameIds() {
        return db.all("SELECT rowid AS id FROM game")
    },
    findOne(id) {
        return db.get("SELECT rowid AS id, * FROM game WHERE rowid = ?", id)
    },
    async create(params) {
        const data = _.values(params)
        const { lastID } = await db.run("INSERT INTO game VALUES(?, ?, -1, 'draft', date('now'))", data)

        return this.findOne(lastID)
    },
    delete(id) {
        return db.run("DELETE FROM game WHERE rowid = ?", id)
    },
    async updateGame(params) {
        let string = ''

        for (k in params) {
            if (k !== 'id') {
                string += k + ' = ?,'
            }
        }

        //remove last ','
        string = string.slice(0, -1)

        const data = _.values(params)
        const { changes } = await db.run("UPDATE game SET " + string + " WHERE rowid = ?", data)

        return this.findOne(params.id)
    },
    getPlayersByGameId(id){
        return db.all(`SELECT rowid AS id, * FROM player WHERE rowid IN (SELECT playerId FROM gamePlayer WHERE gameId = ${id})`) //je sais pas pk l'id veux pas passer en param comme d'hab...
    },
    getNbPlayersByGameId(id){
        return db.get(`SELECT COUNT(rowid) AS nb FROM player WHERE rowid IN (SELECT playerId FROM gamePlayer WHERE gameId = ${id})`)
    },
    getShotsByGameId(id){
        return db.all(`SELECT rowid AS id, * FROM gameShot WHERE gameId = ${id}`)
    },
}


/* COPYRIGHT © 2020 ARNAUD DAUGUEN - ALL RIGHTS RESERVED */