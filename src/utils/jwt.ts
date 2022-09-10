import jwt from 'jsonwebtoken'

import config from '../config'

interface IVerify {
    decoded: { [key: string]: any } | null
    expired: boolean
    valid: boolean
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
        const decoded = jwt.verify(token, publicKey)

        return {
            decoded,
            expired: false,
            valid: true,
        } as IVerify
    } catch (e: any) {
        return {
            decoded: null,
            expired: true,
            valid: false,
        } as IVerify
    }
}
