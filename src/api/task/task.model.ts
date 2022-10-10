import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { User } from '../user/user.model'
import { Project } from '../project/project.model'

export enum EStage {
    TRIAGE = 'triage',
    IN_PROGRESS = 'inProgress',
    BACKLOG = 'backlog',
    COMPLETED = 'completed',
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

    @prop({})
    description: String

    @prop({
        ref: () => Project,
        required: true,
    })
    project: Ref<Project>

    @prop({
        ref: () => User,
    })
    createdBy: Ref<User>

    @prop({
        ref: () => User,
    })
    assignedTo: Ref<User>

    @prop({
        enum: EStage,
        default: EStage.TRIAGE,
    })
    stage?: EStage

    @prop({
        type: String,
        default: [],
    })
    uploads?: string[]

    @prop({
        required: true,
    })
    effort: number
}
