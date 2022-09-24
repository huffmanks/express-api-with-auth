import { Request, Response } from 'express'
import crypto from 'crypto'
import omit from 'lodash.omit'

import { ILeanUser, privateUserFields } from '../user/user.model'
import { LoginUserInput } from './auth.schema'
import { CreateUserInput } from '../user/user.schema'

import { signAccessToken, signRefreshToken, forgotPassword, resetPassword, terminateSession, findSessionById } from './auth.service'
import { createUser, findUserById, findUserByQuery } from '../user/user.service'

import { sendToken } from '../../utils/sendToken'
import { verifyJwt } from '../../utils/jwt'

export async function registerHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    try {
        const body = req.body

        const user = await createUser(body)
        const userData = omit(user.toJSON(), privateUserFields)

        return res.status(201).send(userData)
    } catch (e: any) {
        if ((e.code = 11000)) {
            return res.status(409).send('User already exists')
        }

        return res.status(500).send(e)
    }
}

export async function loginHandler(req: Request<{}, {}, LoginUserInput>, res: Response) {
    const { email, password } = req.body

    const user = await findUserByQuery({ email })
    if (!user) return res.status(401).send('Invalid email or password.')

    const isValid = await user.validatePassword(password)
    if (!isValid) return res.status(401).send('Invalid email or password.')

    const accessToken = signAccessToken(user)
    const refreshToken = await signRefreshToken(user._id, req.get('user-agent') || '')

    const userData = omit(user.toJSON(), privateUserFields) as ILeanUser

    return sendToken(res, 200, userData, accessToken, refreshToken)
}

export async function forgotPasswordHandler(req: Request, res: Response) {
    const { email } = req.body
    if (!email) return res.status(400).send('Please provide an email.')

    const user = await findUserByQuery({ email })
    if (!user) return res.status(401).send('Invalid email.')

    const resetPasswordToken = await forgotPassword(user)
    if (!resetPasswordToken) return res.status(500).send('Email could not be sent.')

    res.status(200).send({ resetPasswordToken })
}

export async function resetPasswordHandler(req: Request, res: Response) {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetPasswordToken).digest('hex')

    const user = await findUserByQuery({ resetPasswordToken })
    if (!user) return res.status(500).send('Password reset failed.')

    const updatedUser = await resetPassword(user, req.body.password)
    if (!updatedUser) return res.status(401).send('Reset password token has expired!')

    const accessToken = signAccessToken(updatedUser)
    const refreshToken = await signRefreshToken(updatedUser._id, req.get('user-agent') || '')

    const userData = omit(user.toJSON(), privateUserFields) as ILeanUser

    return sendToken(res, 200, userData, accessToken, refreshToken)
}

export async function reissueAccessToken({ refreshToken }: { refreshToken: string }) {
    const { decoded } = verifyJwt(refreshToken || '', 'refreshTokenPublicKey')
    if (!decoded) return false

    const session = await findSessionById(decoded.session)
    if (!session || !session.valid) return false

    const user = await findUserByQuery({ _id: session.user })
    if (!user) return false

    return signAccessToken(user)
}

export async function logoutHandler(req: Request, res: Response) {
    const userId = res.locals.user._id

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    const user = await findUserById(userId)
    if (!user) return res.status(401).send('User is not logged in.')

    const session = await terminateSession(user)
    if (!session) return res.status(500).send('Logout failed.')

    return res.status(200).send({ userId: user._id, ...session })
}
