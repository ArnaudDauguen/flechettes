class HttpError extends Error {
    toJSON() {
        const stack = process.env.NODE_ENV === 'development' ? this.stack : undefined
        return {
            type: this.type || 'SERVER_ERROR',
            message: this.message || 'Server Error',
            stack
        }
    }
}

class NotFoundError extends HttpError {
    constructor(message = 'Not found', type = 'NOT_FOUND') {
        super(message)
        this.status = 404
        this.type = type
    }
}
  
class BadRequestError extends HttpError {
    constructor(message = 'Bad request', type = 'BAD_REQUEST') {
        super(message)
        this.status = 400
        this.type = type
    }
}
  
class CantCreateUserError extends HttpError {
    constructor(message = 'cant create user, Email already in use', type = 'CANT_CREATE_USER') {
        super(message)
        this.status = 409
        this.type = type
    }
}
  
class NotAcceptableError extends HttpError {
    constructor(message = 'Not Acceptable', type = 'NOT_ACCEPTABLE') {
        super(message)
        this.status = 406
        this.type = type
    }
}
  
class NotApiAvailableError extends HttpError {
    constructor(message = 'Not Api Available', type = 'NOT_API_AVAILABLE') {
        super(message)
        this.status = 406
        this.type = type
    }
}
  
class PlayerNotDeletableError extends HttpError {
    constructor(message = 'Player Not Deletable', type = 'PLAYER_NOT_DELETABLE') {
        super(message)
        this.status = 410
        this.type = type
    }
}
  
class GameNotEditableError extends HttpError {
    constructor(message = 'Cant edit, game already started or finished', type = 'GAME_NOT_EDITABLE') {
        super(message)
        this.status = 410
        this.type = type
    }
}
  
class GameNotStartableError extends HttpError {
    constructor(message = 'Cant start, game already started or finished', type = 'GAME_NOT_STARTABLE') {
        super(message)
        this.status = 422
        this.type = type
    }
}
  
class GamePlayerMissingError extends HttpError {
    constructor(message = 'Cant start, no players in game', type = 'GAME_PLAYER_MISSING') {
        super(message)
        this.status = 422
        this.type = type
    }
}

class PlayersNotAddableError extends HttpError {
    constructor(message = 'Cant add players, game already started or ended', type = 'PLAYERS_NOT_ADDABLE_GAME_STARTED') {
        super(message)
        this.status = 422
        this.type = type
    }
}

class PlayersNotDeletableError extends HttpError {
    constructor(message = 'Cant remove players, game already started or ended', type = 'PLAYERS_NOT_DELETABLE_GAME_STARTED') {
        super(message)
        this.status = 422
        this.type = type
    }
}

class ServerError extends HttpError {
    constructor(message = 'Server Error', type = 'SERVER_ERROR') {
        super(message)
        this.status = 500
        this.type = type
    }
}

module.exports = { HttpError, 
    NotFoundError, 
    BadRequestError, 
    NotAcceptableError, 
    NotApiAvailableError, 
    PlayerNotDeletableError, 
    ServerError, 
    CantCreateUserError, 
    GameNotEditableError, 
    GameNotStartableError, 
    GamePlayerMissingError,
    PlayersNotAddableError,
    PlayerNotDeletableError
}