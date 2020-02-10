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
  
class ServerError extends HttpError {
    constructor(message = 'Server Error', type = 'SERVER_ERROR') {
        super(message)
        this.status = 500
        this.type = type
    }
}

module.exports = { HttpError, NotFoundError, BadRequestError, NotAcceptableError, NotApiAvailableError, ServerError }