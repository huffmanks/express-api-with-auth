import { NextFunction, Request, Response } from 'express'
import omit from 'lodash.omit'

import { CreateUserInput, UpdateUserInput } from './user.schema'
import { privateUserFields } from './user.model'

import { findUsers, findUserById, createUser, updateUser, deleteUser } from './user.service'

export async function getUsersHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await findUsers()

        res.send(users)
    } catch (err) {
        next(err)
    }
}

export async function getUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id
        const user = await findUserById(id)

        res.send(user)
    } catch (err) {
        next(err)
    }
}

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) {
    try {
        const body = req.body
        const user = await createUser(body)
        const userData = omit(user.toJSON(), privateUserFields)

        res.status(201).send(userData)
    } catch (err: any) {
        if ((err.code = 11000)) {
            return res.status(409).send('User already exists')
        }

        next(err)
    }
}

export async function updateUserHandler(req: Request<{ id: string }, {}, UpdateUserInput>, res: Response, next: NextFunction) {
    try {
        const id = req.params.id

        const updatedUser = await updateUser(id, req.body)
        if (!updatedUser) return res.status(500).send('Could not update user.')

        const userData = omit(updatedUser.toJSON(), privateUserFields)

        res.status(200).send(userData)
    } catch (err) {
        next(err)
    }
}

export async function deleteUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string

        const user = await deleteUser(id)
        if (!user) return res.status(500).send('Could not delete user.')

        const deletedUser = omit(user.toJSON(), privateUserFields)

        res.status(200).send(deletedUser)
    } catch (err) {
        next(err)
    }
}
