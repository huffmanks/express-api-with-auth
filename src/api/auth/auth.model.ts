import { DocumentType, modelOptions, prop, Ref } from '@typegoose/typegoose'
import omit from 'lodash.omit'

import { User } from '../user/user.model'

export const privateSessionFields = ['_id', 'user', 'valid', 'createdAt', 'updatedAt', '__v']

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Session {
    @prop({
        ref: () => User,
    })
    user: Ref<User>

    @prop({})
    userAgent: string

    @prop({
        default: true,
    })
    valid: boolean

    createdAt: Date

    async setLastLogin(this: DocumentType<Session>, user: DocumentType<User>) {
        const endedAt = new Date()

        let delta = Math.ceil(Math.abs(endedAt.getTime() - this.createdAt.getTime()) / 1000)

        const hours = Math.floor(delta / 3600) % 8
        delta -= hours * 3600

        const minutes = Math.floor(delta / 60) % 60
        delta -= minutes * 60

        const seconds = Math.floor(delta % 60)

        const sessionLength = {
            hours,
            minutes,
            seconds,
        }

        const lastLogin = omit(this.toJSON(), privateSessionFields)
        user.lastLogin = { ...lastLogin, startedAt: this.createdAt, endedAt, sessionLength }

        await user.save()

        return
    }
}
