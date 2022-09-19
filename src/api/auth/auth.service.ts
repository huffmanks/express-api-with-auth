import { DocumentType } from '@typegoose/typegoose'
import omit from 'lodash.omit'

import config from '../../config'

import { SessionModel } from '../../models'
import { privateUserFields, User } from '../user/user.model'

import { signJwt } from '../../utils/jwt'

export function signAccessToken(user: DocumentType<User>) {
    const payload = omit(user.toJSON(), privateUserFields)
    return signJwt(payload, 'accessTokenPrivateKey', { expiresIn: config.accessTokenExpires })
}

export async function signRefreshToken(userId: string, userAgent: string) {
    const session = await createSession(userId, userAgent)
    return signJwt({ session: session._id }, 'refreshTokenPrivateKey', { expiresIn: config.refreshTokenExpires })
}

export function findSessionById(id: string) {
    return SessionModel.findById(id)
}

export function createSession(userId: string, userAgent: string) {
    return SessionModel.create({ user: userId, userAgent })
}

export async function forgotPassword(user: DocumentType<User>) {
    return user.getResetPasswordToken()
}

export async function resetPassword(user: DocumentType<User>, password: string) {
    return user.setResetPassword(password)
}

export async function terminateSession(user: DocumentType<User>) {
    const session = await SessionModel.findOne({ user: user._id })
    if (!session) return

    await session.setLastLogin(user)
    session.delete()

    return user.lastLogin
}
