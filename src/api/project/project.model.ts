import { modelOptions, pre, prop, Ref } from '@typegoose/typegoose'
// import { Team } from '../team/team.model'
import { Task } from '../task/task.model'
import { User } from '../user/user.model'

export enum EImpact {
    MASSIVE = 3,
    HIGH = 2,
    MEDIUM = 1,
    LOW = 0.5,
    MINIMAL = 0.25,
}

export enum EConfidence {
    HIGH = 1,
    MEDIUM = 0.8,
    LOW = 0.5,
}

@pre<Project>('save', function () {
    this.rice = (this.reach * this.impact * this.confidence) / this.effort
})
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

    @prop({})
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

    @prop({})
    rice: number

    @prop({
        required: true,
    })
    reach: number

    @prop({
        required: true,
        enum: EImpact,
    })
    impact: EImpact

    @prop({
        required: true,
        enum: EConfidence,
    })
    confidence: EConfidence

    @prop({
        required: true,
    })
    effort: number
}
