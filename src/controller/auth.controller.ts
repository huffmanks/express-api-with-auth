import { Request, Response } from 'express'
import argon2 from 'argon2'
import { omit } from 'lodash'

import { privateFields } from '../model/user.model'

import { signAccessToken, signRefreshToken, getSessionById, getQuestion, restorePassword } from '../service/auth.service'
import { getUserByEmail, getUserById } from '../service/user.service'

import { verifyJwt } from '../utils/jwt'

export async function createLoginHandler(req: Request, res: Response) {
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

export async function getQuestionHandler(req: Request, res: Response) {
    const user = await getQuestion(req.query)

    if (!user) return res.status(404).send('Could not find user')

    res.send(user[0].question)
}

export async function restorePasswordHandler(req: Request, res: Response) {
    const { email, answer, password } = req.body

    const user = await getUserByEmail(email)
    if (!user) return res.status(500).send('Something happend while restoring password')

    if (answer.toLowerCase() !== user?.answer.toLowerCase()) return res.status(403).send('Wrong password')

    const hash = await argon2.hash(password)

    await restorePassword(hash, String(user?._id))

    res.send('Password has been updated')
}
