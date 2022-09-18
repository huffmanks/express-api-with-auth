import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { User } from '../user/user.model'
import { Project } from '../project/project.model'

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

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Task {
    @prop({
        required: true,
    })
    title: String

    @prop({
        default: '',
    })
    description: String

    @prop({
        ref: () => Project,
        required: true,
    })
    project: Ref<Project>

    @prop({
        ref: () => User,
    })
    author: Ref<User>

    @prop({
        ref: () => User,
    })
    assignee: Ref<User>

    // @prop({
    //     enum: EImpact
    // })
    // impact: EImpact

    // @prop({
    //     enum: EConfidence,
    // })
    // confidence: EConfidence
}
