import SessionModel from '../auth/auth.model'
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

export function updateUser(id: string, input: UpdateUserInput) {
    return UserModel.findByIdAndUpdate({ _id: id }, input, { new: true })
}

export async function deleteUser(id: string) {
    const user = UserModel.findByIdAndDelete(id)
    await SessionModel.deleteMany({ user: id })

    return user
}
