import jwt from 'jsonwebtoken'

import config from '../config'

export function signJwt(payload: Object, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', options?: jwt.SignOptions | undefined) {
    const signingKey = Buffer.from(config[keyName]!, 'base64').toString('ascii')

    return jwt.sign(payload, signingKey, {
        ...(options && options),
        // algorithm: 'RS256',
    })
}

export function verifyJwt<T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): T | null {
    const publicKey = Buffer.from(config[keyName]!, 'base64').toString('ascii')

    try {
        const decoded = jwt.verify(token, publicKey) as T
        return decoded
    } catch (e) {
        return null
    }
}
