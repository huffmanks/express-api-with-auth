import { DocumentType } from '@typegoose/typegoose'

import UserModel, { User } from '../model/user.model'
import { CreateUserInput } from '../schema/user.schema'

export function getUsers() {
    return UserModel.find({})
}

export function getUserById(id: string) {
    return UserModel.findById(id)
}

export function getUserByEmail(email: string) {
    return UserModel.findOne({ email })
}

export function createUser(input: CreateUserInput) {
    return UserModel.create(input)
}

export function updateUser(data: DocumentType<User>) {
    return UserModel.findByIdAndUpdate(data._id, data)
}

export function deleteUser(id: string) {
    return UserModel.findByIdAndDelete(id)
}
