const db = require("sqlite")
module.exports = {
    async addShot(gameId, playerId, sector, multiplicator){
        const { lastId } = await db.run("INSERT INTO gameShot (gameId, playerId, sector, multiplicator, createdAt) VALUES(?, ?, ?, ?, date('now'))", [gameId, playerId, sector, multiplicator])
        return this.findOne(lastId)
    },
    
}