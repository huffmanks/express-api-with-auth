import { DocumentType, modelOptions, prop, pre } from '@typegoose/typegoose'
import argon2 from 'argon2'
import crypto from 'crypto'

import { getCurrentTime } from '../../utils/getCurrentTime'

export const privateFields = ['password', 'resetPasswordToken', 'resetPasswordExpire', '__v']

export enum ERole {
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

    @prop({
        default: '',
    })
    avatarUrl?: string

    @prop({})
    lastLogin?: object

    @prop({
        default: '',
    })
    resetPasswordToken: string

    @prop({
        default: '',
    })
    resetPasswordExpire: string

    async validatePassword(password: string): Promise<boolean> {
        return await argon2.verify(this.password, password)
    }

    getResetPasswordToken(this: DocumentType<User>) {
        const resetPasswordToken = crypto.randomBytes(20).toString('hex')

        const expirationTime = getCurrentTime(10)

        this.resetPasswordToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex')
        this.resetPasswordExpire = expirationTime

        return resetPasswordToken
    }
}
