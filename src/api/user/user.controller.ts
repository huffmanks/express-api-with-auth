import { Request, Response } from 'express'
import { omit } from 'lodash'

import { CreateUserInput, UpdateUserInput } from './user.schema'
import { privateFields } from './user.model'

import { getUsers, getUserById, createUser, updateUser, deleteUser } from './user.service'

export async function getUsersHandler(req: Request, res: Response) {
    const users = await getUsers()

    res.send(users)
}

export async function getUserHandler(req: Request, res: Response) {
    const id = req.params.id
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

export async function updateUserHandler(req: Request<{ id: string }, {}, UpdateUserInput>, res: Response) {
    try {
        const id = req.params.id
        const profileData = req.body

        const updated = await updateUser(id, profileData)
        if (!updated) return res.status(500).send('Could not update profile')

        const userData = omit(updated.toJSON(), privateFields)

        return res.send(userData)
    } catch (e: any) {}
}

export async function deleteUserHandler(req: Request, res: Response) {
    const id = req.params.id as string

    const user = await deleteUser(id)
    if (!user) return res.status(500).send('Could not delete user.')

    const deletedUser = omit(user.toJSON(), privateFields)

    res.status(200).send(deletedUser)
}
