import { modelOptions, prop, Ref } from '@typegoose/typegoose'
// import { Team } from '../team/team.model'
import { Task } from '../task/task.model'
import { User } from '../user/user.model'

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Project {
    @prop({
        required: true,
    })
    title: String

    @prop({
        default: '',
    })
    description: String

    // @prop({
    //     ref: () => Team,
    //     required: true,
    // })
    // team: Ref<Team>

    @prop({
        ref: () => Task,
    })
    tasks: Ref<Task>[]

    @prop({
        ref: () => User,
    })
    users: Ref<User>[]
}
