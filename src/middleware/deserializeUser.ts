import { Request, Response, NextFunction } from 'express'

import { reissueAccessToken } from '../api/auth/auth.service'
import { verifyJwt } from '../utils/jwt'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return next()

    const { decoded, expired } = verifyJwt(accessToken, 'accessTokenPublicKey')

    if (decoded) {
        res.locals.user = decoded
        return next()
    }
    const refreshToken = req.cookies.refreshToken

    if (refreshToken && expired) {
        const newAccessToken = await reissueAccessToken({ refreshToken })

        if (newAccessToken) {
            res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 5 * 60 * 1000 })
        }

        const result = verifyJwt(newAccessToken as string, 'accessTokenPublicKey')

        res.locals.user = result

        return next()
    }
    return next()
}

export default deserializeUser
