import { DocumentType } from '@typegoose/typegoose'
import { omit } from 'lodash'

import config from '../../config'

import SessionModel from './auth.model'
import { privateFields, User } from '../user/user.model'

import { signJwt } from '../../utils/jwt'

export function signAccessToken(user: DocumentType<User>) {
    const payload = omit(user.toJSON(), privateFields)

    const accessToken = signJwt(payload, 'accessTokenPrivateKey', { expiresIn: config.accessTokenExpires })

    return accessToken
}

export async function signRefreshToken({ userId }: { userId: string }) {
    const session = await createSession({ userId })

    const refreshToken = signJwt(
        {
            session: session._id,
        },
        'refreshTokenPrivateKey',
        { expiresIn: config.refreshTokenExpires }
    )

    return refreshToken
}

export function getSessionById(id: string) {
    return SessionModel.findById(id)
}

export function createSession({ userId }: { userId: string }) {
    return SessionModel.create({ user: userId })
}

export function terminateSession({ userId }: { userId: string }) {
    return SessionModel.findOneAndUpdate({ user: userId }, { valid: false }, { new: true })
}

export async function forgotPassword(user: DocumentType<User>) {
    const resetPasswordToken = user.getResetPasswordToken()

    if (!resetPasswordToken) {
        user.resetPasswordToken = ''
    }
    await user.save()

    return resetPasswordToken
}

export async function resetPassword(user: DocumentType<User>, password: string) {
    user.resetPasswordToken = ''
    user.password = password
    await user.save()

    return user
}
