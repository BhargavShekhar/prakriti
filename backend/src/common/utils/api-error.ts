class ApiError extends Error {
    public statusCode: number

    constructor(statusCode: number, message="") {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        
        Error.captureStackTrace(this, this.constructor); // tells which line the error is
    }

    static badRequest(message="Bad request") {
        return new ApiError(400, message);
    }

    static unauthorized(message="Unauthorize") {
        return new ApiError(401, message);
    }

    static conflict(message="Conflict - data already exists") {
        return new ApiError(409, message);
    }

    static forbidden(message="forbidden") {
        return new ApiError(403, message);
    }

    static notfound(message="notfound") {
        return new ApiError(404, message);
    }

    static tooLarge(message="payload too large") {
        return new ApiError(413, message);
    }
}

export default ApiError;