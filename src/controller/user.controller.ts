import { Request, Response } from 'express'
import { omit } from 'lodash'

import { CreateUserInput } from '../schema/user.schema'
import { privateFields } from '../model/user.model'

import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../service/user.service'

import { verifyJwt } from '../utils/jwt'

export async function getUsersHandler(req: Request, res: Response) {
    const users = await getUsers()

    res.send(users)
}

export async function getUserHandler(req: Request, res: Response) {
    const id = req.query.id as string
    const user = await getUserById(id)

    res.send(user)
}

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
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

export async function updateUserHandler(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        const profileData = req.body

        const decoded = verifyJwt(token || '', 'accessTokenPublicKey')
        if (!decoded) return res.status(403).send('Access token is not valid')

        const updated = await updateUser(profileData)
        if (!updated) return res.status(500).send('Could not update profile')

        const userData = omit(updated.toJSON(), privateFields)

        return res.send(userData)
    } catch (e: any) {}
}

export async function deleteUserHandler(req: Request, res: Response) {
    const id = req.params.id as string
    const response = await deleteUser(id)

    res.send(response)
}
