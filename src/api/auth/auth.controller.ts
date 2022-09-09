import { Request, Response } from 'express'
import crypto from 'crypto'
import { omit } from 'lodash'

import { privateFields } from '../user/user.model'
import { CreateUserInput, LoginUserInput } from '../user/user.schema'

import { signAccessToken, signRefreshToken, forgotPassword, resetPassword, terminateSession } from './auth.service'
import { createUser, findUserByQuery } from '../user/user.service'

import { sendToken } from '../../utils/sendToken'

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
    const { email, password } = req.body

    const user = await findUserByQuery({ email })
    if (!user) return res.status(401).send('Invalid email or password.')

    const isValid = await user.validatePassword(password)
    if (!isValid) return res.status(401).send('Invalid email or password.')

    const accessToken = signAccessToken(user)
    const refreshToken = await signRefreshToken(user._id)

    return sendToken(res, 201, accessToken, refreshToken)
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
    const refreshToken = await signRefreshToken(updatedUser._id)

    return sendToken(res, 201, accessToken, refreshToken)
}

export async function logoutHandler(req: Request, res: Response) {
    const userId = res.locals.user._id

    const session = await terminateSession(userId)
    if (!session) return res.status(500).send('Logout failed.')

    return res.status(204)
}
