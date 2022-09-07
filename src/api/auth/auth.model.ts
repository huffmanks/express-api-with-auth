import { modelOptions, prop, Ref } from '@typegoose/typegoose'
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

    @prop({
        default: true,
    })
    valid: boolean
}
