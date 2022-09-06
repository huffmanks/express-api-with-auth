import { Request, Response } from 'express'
import crypto from 'crypto'
import { omit } from 'lodash'

import { privateFields } from '../user/user.model'
import { CreateUserInput, LoginUserInput } from '../user/user.schema'

import { signAccessToken, signRefreshToken, getSessionById, forgotPassword, resetPassword, terminateSession } from './auth.service'
import { createUser, getUserByEmail, getUserById, getUserByResetPasswordToken } from '../user/user.service'

import { verifyJwt } from '../../utils/jwt'
import { getCurrentTime } from '../../utils/getCurrentTime'

export async function registerHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    try {
        const body = req.body

        const user = await createUser(body)
        const userData = omit(user.toJSON(), privateFields)

        return res.status(201).send(userData)
    } catch (e: any) {
        if ((e.code = 11000)) {
            return res.status(409).send('User already exists')
        }

        return res.status(500).send(e)
    }
}

export async function loginHandler(req: Request<{}, {}, LoginUserInput>, res: Response) {
    const message = 'Invalid email or password'
    const { email, password } = req.body

    const user = await getUserByEmail(email)
    if (!user) return res.send(message)

    const isValid = await user.validatePassword(password)
    if (!isValid) return res.status(401).send(message)

    const accessToken = signAccessToken(user)
    const refreshToken = await signRefreshToken({ userId: user._id })

    return res.send({ accessToken, refreshToken })
}

export async function forgotPasswordHandler(req: Request, res: Response) {
    const { email } = req.body

    if (!email) return res.status(400).send('Please provide an email.')

    const user = await getUserByEmail(email)
    if (!user) return res.status(404).send('Could not find user')

    const resetPasswordToken = await forgotPassword(user)

    if (!resetPasswordToken) return res.status(500).send('Email could not be sent.')

    res.status(200).send({ resetPasswordToken })
}

export async function resetPasswordHandler(req: Request, res: Response) {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetPasswordToken).digest('hex')

    const user = await getUserByResetPasswordToken(resetPasswordToken)
    if (!user) return res.status(500).send('Password reset failed.')

    const updatedUser = await resetPassword(user, req.body.password)

    const currentTime = getCurrentTime()

    const isExpired = new Date(updatedUser.resetPasswordExpire) < new Date(currentTime)

    updatedUser.resetPasswordExpire = ''
    updatedUser.save()

    if (isExpired) return res.status(401).send('Reset password token has expired!')

    const accessToken = signAccessToken(updatedUser)
    const refreshToken = await signRefreshToken({ userId: updatedUser._id })

    return res.status(200).send({ accessToken, refreshToken })
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
    const token = req.headers['x-refresh'] as string

    const decoded = verifyJwt<{ session: string }>(token || '', 'refreshTokenPublicKey')
    if (!decoded) return res.status(401).send('Could not refresh access token')

    const session = await getSessionById(decoded.session)
    if (!session || !session.valid) return res.status(401).send('Could not refresh access token')

    const user = await getUserById(String(session.user))
    if (!user) return res.status(401).send('Could not refresh access token')

    const accessToken = signAccessToken(user)

    res.status(200).send({ accessToken })
}

export async function logoutHandler(req: Request, res: Response) {
    const user = req.body.user

    const session = await terminateSession({ userId: user._id })
    if (!session) return res.status(500).send('Logout failed.')

    return res.status(204)
}
