import { DocumentType, modelOptions, prop, pre } from '@typegoose/typegoose'
import argon2 from 'argon2'
import crypto from 'crypto'

import { getDate } from '../../utils/getDateTime'

export const privateUserFields = ['password', 'resetPasswordToken', 'resetPasswordExpire', '__v']

export interface ILeanUser {
    _id: string
    firstName?: string
    lastName?: string
    email: string
    userName: string
    role?: ERole
    profileImage?: string
    lastLogin?: object
    createdAt: Date
    updatedAt: Date
}

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
    @prop({})
    firstName?: string

    @prop({})
    lastName?: string

    @prop({
        lowercase: true,
        required: true,
        unique: true,
    })
    email: string

    userName?: string

    @prop({
        required: true,
    })
    password: string

    @prop({
        enum: ERole,
        default: ERole.GUEST,
    })
    role?: ERole

    @prop({})
    profileImage?: string

    @prop({})
    lastLogin?: object

    @prop({})
    resetPasswordToken?: string

    @prop({})
    resetPasswordExpire?: Date

    async validatePassword(password: string): Promise<boolean> {
        return await argon2.verify(this.password, password)
    }

    async getResetPasswordToken(this: DocumentType<User>) {
        const resetPasswordToken = crypto.randomBytes(20).toString('hex')

        const expirationTime = getDate(10)

        this.resetPasswordToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex')
        this.resetPasswordExpire = expirationTime

        await this.save()

        return resetPasswordToken
    }

    async setResetPassword(this: DocumentType<User>, password: string) {
        const currentTime = getDate()

        const isExpired = this.resetPasswordExpire ? this.resetPasswordExpire < currentTime : false

        this.resetPasswordToken = undefined
        this.resetPasswordExpire = undefined

        if (!isExpired) {
            this.password = password
        }

        await this.save()

        return this
    }
}
