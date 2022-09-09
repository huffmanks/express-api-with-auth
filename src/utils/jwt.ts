import jwt from 'jsonwebtoken'

import config from '../config'

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
        const decoded = jwt.verify(token, publicKey)

        return {
            decoded,
            expired: false,
            valid: true,
        }
    } catch (e: any) {
        return {
            decoded: null,
            expired: true,
            valid: false,
        }
    }
}
