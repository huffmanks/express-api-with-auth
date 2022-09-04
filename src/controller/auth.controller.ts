import { Request, Response } from 'express'
import argon2 from 'argon2'
import crypto from 'crypto'
import { omit } from 'lodash'

import { privateFields } from '../model/user.model'
import { CreateUserInput, LoginUserInput } from '../schema/user.schema'

import { signAccessToken, signRefreshToken, getSessionById, forgotPassword, resetPassword } from '../service/auth.service'
import { createUser, getUserByEmail, getUserById, getUserByResetPasswordToken } from '../service/user.service'

import { verifyJwt } from '../utils/jwt'

export async function registerHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    try {
        const body = req.body

        const user = await createUser(body)
        const userData = omit(user.toJSON(), privateFields)

        return res.send(userData)
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

    const userData = omit(user.toJSON(), privateFields)

    return res.send({
        ...userData,
        accessToken,
        refreshToken,
    })
}

export async function forgotPasswordHandler(req: Request, res: Response) {
    const { email } = req.body

    if (!email) return res.status(400).send('Please provide an email.')

    const user = await getUserByEmail(email)
    if (!user) return res.status(404).send('Could not find user')

    const resetPasswordToken = forgotPassword(user)

    if (!resetPasswordToken) return res.status(500).send('Email could not be sent.')

    res.status(200).send(resetPasswordToken)
}

export async function resetPasswordHandler(req: Request, res: Response) {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetPasswordToken).digest('hex')

    const { password } = req.body

    const user = await getUserByResetPasswordToken(resetPasswordToken)
    if (!user) return res.status(500).send('Something happend while reseting password')

    const date = new Date()
    const currentTime = new Date(date.getTime())

    if (user.resetPasswordExpire < currentTime) {
        user.resetPasswordToken = ''

        await user.save()

        return res.status(401).send('Reset password token has expired!')
    }

    const hash = await argon2.hash(password)
    resetPassword(hash, String(user?._id))

    const accessToken = signAccessToken(user)
    const refreshToken = await signRefreshToken({ userId: user._id })

    const userData = omit(user.toJSON(), privateFields)

    return res.send({
        ...userData,
        accessToken,
        refreshToken,
    })
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

    res.send({ accessToken })
}

export async function logoutHandler(req: Request, res: Response) {
    const token = req.headers['x-refresh'] as string

    const decoded = verifyJwt<{ session: string }>(token || '', 'refreshTokenPublicKey')
    if (!decoded) return res.sendStatus(204)

    const session = await getSessionById(decoded.session)
    if (!session || !session.valid) {
        res.clearCookie('accessToken', { httpOnly: true, maxAge: 0 })
        return res.sendStatus(204)
    }

    const user = await getUserById(String(session.user))
    if (!user) {
        res.clearCookie('accessToken', { httpOnly: true, maxAge: 0 })
        return res.sendStatus(204)
    }

    session.valid = false
    await session.save()

    res.clearCookie('accessToken', { httpOnly: true, maxAge: 0 })
    res.sendStatus(204)
}
