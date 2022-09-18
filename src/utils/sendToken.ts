import { Response } from 'express'

import { ILeanUser } from '../api/user/user.model'

export const sendToken = (res: Response, statusCode: number, user: ILeanUser, accessToken: string, refreshToken: string) => {
    return res
        .cookie('accessToken', accessToken, { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 })
        .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 })
        .status(statusCode)
        .json(user)
}
