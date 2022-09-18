import { Request, Response, NextFunction } from 'express'

import { reissueAccessToken } from '../api/auth/auth.controller'
import { verifyJwt } from '../utils/jwt'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.status(401).send('You are not authorized to access this route.')

    const { decoded, expired } = verifyJwt(accessToken, 'accessTokenPublicKey')

    if (decoded) {
        res.locals.user = decoded
        return next()
    }
    const refreshToken = req.cookies.refreshToken

    if (refreshToken && expired) {
        const newAccessToken = await reissueAccessToken({ refreshToken })

        if (newAccessToken) {
            res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 })
        }

        const result = verifyJwt(newAccessToken as string, 'accessTokenPublicKey')

        res.locals.user = result

        return next()
    }
    return next()
}

export default deserializeUser
