import { FilterQuery } from 'mongoose'

import { UserModel, SessionModel } from '../../models'

import { User } from './user.model'
import { CreateUserInput, UpdateUserInput } from './user.schema'

export function findUsers() {
    return UserModel.find({})
}

export function findUserById(id: string) {
    return UserModel.findById(id)
}

export function findUserByQuery(query: FilterQuery<User>) {
    return UserModel.findOne(query)
}

export function createUser(input: CreateUserInput) {
    return UserModel.create(input)
}

export function updateUser(id: string, input: UpdateUserInput) {
    return UserModel.findByIdAndUpdate({ _id: id }, input, { new: true })
}

export async function deleteUser(id: string) {
    const user = UserModel.findByIdAndDelete(id, { new: true })
    await SessionModel.deleteMany({ user: id })

    return user
}
