import { DocumentType } from '@typegoose/typegoose'
import { omit } from 'lodash'

import config from '../../config'

import { findUserById, findUserByQuery } from '../user/user.service'
import { SessionModel } from '../../models'
import { privateFields, User } from '../user/user.model'

import { getCurrentTime } from '../../utils/getCurrentTime'
import { signJwt, verifyJwt } from '../../utils/jwt'

export function signAccessToken(user: DocumentType<User>) {
    const payload = omit(user.toJSON(), privateFields)
    const accessToken = signJwt(payload, 'accessTokenPrivateKey', { expiresIn: config.accessTokenExpires })

    return accessToken
}

export async function signRefreshToken(userId: string, userAgent: string) {
    const session = await createSession(userId, userAgent)

    const refreshToken = signJwt({ session: session._id }, 'refreshTokenPrivateKey', { expiresIn: config.refreshTokenExpires })

    return refreshToken
}

export function findSessionById(id: string) {
    return SessionModel.findById(id)
}

export function createSession(userId: string, userAgent: string) {
    return SessionModel.create({ user: userId, userAgent })
}

export async function forgotPassword(user: DocumentType<User>) {
    const resetPasswordToken = user.getResetPasswordToken()

    if (!resetPasswordToken) {
        user.resetPasswordToken = ''
        user.resetPasswordExpire = ''
    }
    await user.save()

    return resetPasswordToken
}

export async function resetPassword(user: DocumentType<User>, password: string) {
    const currentTime = getCurrentTime()

    const isExpired = new Date(user.resetPasswordExpire) < new Date(currentTime)

    if (isExpired) {
        user.resetPasswordToken = ''
        user.resetPasswordExpire = ''

        await user.save()

        return false
    }

    user.resetPasswordToken = ''
    user.resetPasswordExpire = ''
    user.password = password

    await user.save()

    return user
}

export async function reissueAccessToken({ refreshToken }: { refreshToken: string }) {
    const { decoded } = verifyJwt(refreshToken || '', 'refreshTokenPublicKey')
    if (!decoded) return false

    const session = await findSessionById(decoded.session)
    if (!session || !session.valid) return false

    const user = await findUserByQuery({ _id: session.user })
    if (!user) return false

    const accessToken = signAccessToken(user)

    return accessToken
}

export async function terminateSession(userId: string) {
    const user = await findUserById(userId)
    if (!user) return false

    const session = await SessionModel.findOneAndDelete({ user: userId })
    if (!session) return false

    const { updatedAt, sessionLength } = session.getSessionLength()
    const lastLogin = omit(session.toJSON(), ['_id', 'user', 'valid', '__v'])
    user.lastLogin = { ...lastLogin, updatedAt, sessionLength }

    user.save()

    return session
}
