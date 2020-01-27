
const db = require('sqlite')
const _ = require('lodash')

module.exports = {
  findAllGames() {
    return db.all("SELECT rowid AS id, * FROM game")
  },
  findAllGameIds() {
    return db.all("SELECT rowid AS id FROM game")
  },
  findOne(id) {
    return db.get("SELECT rowid AS id, * FROM game WHERE rowid = ?", id)
  },
  async createGame(params) {
    const data = _.values(params)
    const { lastID } = await db.run("INSERT INTO game VALUES(?, ?, 0, 0, ?, date('now'))", data)

    return this.findOne(lastID)
  },
  deleteGame(id) {
    return db.run("DELETE FROM game WHERE rowid = ?", id)
  },
  async updateGame(params) {
    let string = ''

    for (k in params) {
      if (k !== 'id') {
        string += k + ' = ?,'
      }
    }
    
    const data = _.values(params)
    const { changes } = await db.run("UPDATE game SET " + string + " WHERE rowid = ?", data)
    
    return this.findOne(params.id)
  },
}


/* COPYRIGHT © 2020 ARNAUD DAUGUEN - ALL RIGHTS RESERVED */