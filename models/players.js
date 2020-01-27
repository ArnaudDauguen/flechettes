const db = require('sqlite')
const _ = require('lodash')

module.exports = {
  findAllPlayers() {
    return db.all("SELECT rowid AS id, * FROM player")
  },
  findAllPlayerIds() {
    return db.all("SELECT rowid AS id FROM player")
  },
  findOne(id) {
    return db.get("SELECT rowid AS id, * FROM player WHERE rowid = ?", id)
  },
  async createPlayer(params) {
    const data = _.values(params)
    const { lastID } = await db.run("INSERT INTO player VALUES(?, ?, 0, 0, ?, date('now'))", data)

    return this.findOne(lastID)
  },
  deletePlayer(id) {
    return db.run("DELETE FROM player WHERE rowid = ?", id)
  },
  async updatePlayer(params) {
    let string = ''

    for (k in params) {
      if (k !== 'id') {
        string += k + ' = ?,'
      }
    }
    
    const data = _.values(params)
    const { changes } = await db.run("UPDATE player SET " + string + " WHERE rowid = ?", data)
    
    return this.findOne(params.id)
  },
}


/* COPYRIGHT © 2020 ARNAUD DAUGUEN - ALL RIGHTS RESERVED */