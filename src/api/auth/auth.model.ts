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

    @prop({})
    sessionLength?: {
        hours: number
        minutes: number
        seconds: number
    }

    @prop({
        default: true,
    })
    valid: boolean

    createdAt: Date

    updatedAt: Date

    setSessionLength(this: DocumentType<Session>) {
        const start = this.createdAt.getTime()
        const end = this.updatedAt.getTime()

        const seconds = Math.ceil(Math.abs(end - start) / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        this.sessionLength = {
            hours,
            minutes,
            seconds,
        }

        this.save()
        return
    }
}
