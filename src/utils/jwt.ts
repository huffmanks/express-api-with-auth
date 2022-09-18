import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'

import config from '../config'
import { getTimestamp } from './getDateTime'

interface IVerify {
    decoded: JwtPayload | null
    expired: boolean
    valid: boolean
}

const invalidToken = {
    decoded: null,
    expired: true,
    valid: false,
}

export function signJwt(payload: Object, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', options?: jwt.SignOptions | undefined) {
    const signingKey = Buffer.from(config[keyName], 'base64').toString('ascii')

    return jwt.sign(payload, signingKey, {
        ...(options && options),
        algorithm: 'RS256',
    })
}

export function verifyJwt(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey') {
    const publicKey = Buffer.from(config[keyName], 'base64').toString('ascii')

    try {
        const decoded = jwt.verify(token, publicKey) as IVerify['decoded']
        if (!decoded) return invalidToken

        // @ts-ignore
        const expired = getTimestamp() >= decoded?.exp
        if (expired) return invalidToken

        return {
            decoded,
            expired: false,
            valid: true,
        } as IVerify
    } catch (e: any) {
        return invalidToken as IVerify
    }
}
