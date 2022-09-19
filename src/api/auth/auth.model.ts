import { DocumentType, modelOptions, prop, Ref } from '@typegoose/typegoose'
import omit from 'lodash.omit'

import { User } from '../user/user.model'
import { getDuration } from '../../utils/getDuration'

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
        const startTime = this.createdAt.getTime()
        const endedAt = new Date()
        const endTime = endedAt.getTime()

        const sessionLength = getDuration(startTime, endTime)

        const lastLogin = omit(this.toJSON(), privateSessionFields)
        user.lastLogin = { ...lastLogin, startedAt: this.createdAt, endedAt, sessionLength }

        await user.save()

        return
    }
}
