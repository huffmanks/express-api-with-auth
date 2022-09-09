import { Request, Response, NextFunction } from 'express'

const restrictRoute =
    (...allowedRoles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals.user) return res.status(401).send('You are not authorized to access this route.')

        if (!allowedRoles.includes(res.locals.user.role)) return res.status(401).send('You are not authorized to access this route.')

        return next()
    }

export default restrictRoute
