import UserModel from './user.model'
import { CreateUserInput, UpdateUserInput } from './user.schema'

export function getUsers() {
    return UserModel.find({})
}

export function getUserById(id: string) {
    return UserModel.findById(id)
}

export function getUserByEmail(email: string) {
    return UserModel.findOne({ email })
}

export function getUserByResetPasswordToken(resetPasswordToken: string) {
    return UserModel.findOne({ resetPasswordToken })
}

export function createUser(input: CreateUserInput) {
    return UserModel.create(input)
}

export function updateUser(input: UpdateUserInput) {
    return UserModel.findByIdAndUpdate(input._id, input)
}

export function deleteUser(id: string) {
    return UserModel.findByIdAndDelete(id)
}
