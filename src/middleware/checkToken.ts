import { NextFunction, Request, Response } from 'express'
import { verifyJwt } from '../utils/jwt'

const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    const decoded = verifyJwt(token || '', 'accessTokenPublicKey')

    if (!decoded) {
        res.status(403).send('Access token is not valid')
        return
    }

    next()
}

export default checkToken
