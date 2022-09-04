import { Request, Response, NextFunction } from 'express'

const restrictRole =
    (...allowedRoles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.user.role) return res.status(401).send('You are not authorized to access this route.')

        if (!allowedRoles.includes(req.body.user.role)) return res.status(401).send('You are not authorized to access this route.')

        next()
    }

export default restrictRole
