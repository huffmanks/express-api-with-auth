import { DocumentType } from '@typegoose/typegoose'
import { omit } from 'lodash'

import SessionModel from '../model/session.model'
import UserModel, { privateFields, User } from '../model/user.model'

import { signJwt } from '../utils/jwt'

export function signAccessToken(user: DocumentType<User>) {
    const payload = omit(user.toJSON(), privateFields)

    const accessToken = signJwt(payload, 'accessTokenPrivateKey', { expiresIn: '15min' })

    return accessToken
}

export async function signRefreshToken({ userId }: { userId: string }) {
    const session = await createSession({ userId })

    const refreshToken = signJwt(
        {
            session: session._id,
        },
        'refreshTokenPrivateKey',
        { expiresIn: '1d' }
    )

    return refreshToken
}

export function createSession({ userId }: { userId: string }) {
    return SessionModel.create({ user: userId })
}

export function getSessionById(id: string) {
    return SessionModel.findById(id)
}

export function getQuestion(email: any) {
    return UserModel.find(email)
}

export function restorePassword(password: string, id: string) {
    return UserModel.findByIdAndUpdate(id, { password })
}
