import { Request, Response } from 'express'

class AppError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = Error.name
        this.status = status
        Error.captureStackTrace(this)
    }
}

const errorHandler = (error: AppError, req: Request, res: Response) => {
    const status = error.status || 400
    res.status(status).send(error.message)
}

export default errorHandler
