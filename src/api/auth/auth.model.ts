import { DocumentType, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { User } from '../user/user.model'

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

    getSessionLength(this: DocumentType<Session>) {
        const updatedAt = new Date()

        let delta = Math.ceil(Math.abs(updatedAt.getTime() - this.createdAt.getTime()) / 1000)

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

        return { updatedAt, sessionLength }
    }
}
