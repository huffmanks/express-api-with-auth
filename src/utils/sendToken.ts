import { Response } from 'express'

export const sendToken = (res: Response, statusCode: number, accessToken: string, refreshToken: string) => {
    return res
        .cookie('accessToken', accessToken, { httpOnly: true, maxAge: 5 * 60 * 1000 })
        .status(statusCode)
        .json({ accessToken, refreshToken })
}
