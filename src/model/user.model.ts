import argon2 from 'argon2'
import { DocumentType, getModelForClass, modelOptions, prop, pre } from '@typegoose/typegoose'

export const privateFields = ['password', '__v']

enum ERole {
    ADMIN = 'bull',
    MEMBER = 'mako',
    GUEST = 'tiger',
}

@pre<User>('save', async function () {
    if (this.isModified('email')) {
        this.userName = this.email.substring(0, this.email.indexOf('@'))
    }

    if (this.isModified('password')) {
        const hash = await argon2.hash(this.password)
        this.password = hash
    }

    return
})
@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class User {
    @prop({
        default: '',
    })
    firstName: string

    @prop({
        default: '',
    })
    lastName: string

    @prop({
        lowercase: true,
        required: true,
        unique: true,
    })
    email: string

    @prop({
        default: '',
    })
    userName: string

    @prop({
        required: true,
    })
    password: string

    @prop({
        enum: ERole,
        default: 'tiger',
    })
    role?: ERole

    async validatePassword(this: DocumentType<User>, candidate: string) {
        try {
            return await argon2.verify(this.password, candidate)
        } catch (e: any) {
            return false
        }
    }
}

const UserModel = getModelForClass(User)

export default UserModel
