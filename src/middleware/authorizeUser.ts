import { Request, Response, NextFunction } from 'express'

const authorizeUser =
    (...allowedRoles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals.user) return res.status(401).send('You are not authorized to access this route.')

        // TODO: allow current user to modify their own profile, tasks, comments, etc.
        if (req.params.id === res.locals.user._id) return next()

        if (!allowedRoles.includes(res.locals.user.role)) return res.status(401).send('You are not authorized to access this route.')

        return next()
    }

export default authorizeUser
