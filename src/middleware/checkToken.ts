import { Request, Response, NextFunction } from 'express'
import { DocumentType } from '@typegoose/typegoose'

import { User } from '../api/user/user.model'
import { getUserById } from '../api/user/user.service'
import { verifyJwt } from '../utils/jwt'

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    const decoded = verifyJwt(token || '', 'accessTokenPublicKey') as DocumentType<User>
    if (!decoded) return res.status(403).send('Access token is not valid')

    const user = await getUserById(decoded._id)
    if (!user) return res.status(404).send('No user found.')

    req.body.user = user

    next()
}

export default checkToken
