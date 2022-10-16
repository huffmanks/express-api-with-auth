import { DocumentType, modelOptions, prop, Ref } from '@typegoose/typegoose'

import { TaskModel } from '../../models'
// import { Team } from '../team/team.model'
import { Task } from '../task/task.model'
import { User } from '../user/user.model'
// import { Message } from '../message/message.model'

export enum EStage {
    TRIAGE = 'triage',
    IN_PROGRESS = 'inProgress',
    BACKLOG = 'backlog',
    COMPLETED = 'completed',
}

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
    // teams: Ref<Team>[]

    @prop({
        ref: () => Task,
    })
    tasks: Ref<Task>[]

    @prop({
        ref: () => User,
    })
    createdBy: Ref<User>

    @prop({
        ref: () => User,
    })
    clients: Ref<User>[]

    @prop({
        required: true,
    })
    neededBy: Date

    @prop({
        enum: EStage,
        default: EStage.TRIAGE,
    })
    stage?: EStage

    @prop({})
    progress: number

    @prop({
        default: 0,
    })
    completedTasks: number

    @prop({
        default: false,
    })
    willMeetDeadline: boolean

    // @prop({
    //     ref: () => Message,
    // })
    // messages: Ref<Message>[]

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

    async setProjectStats(this: DocumentType<Project>) {
        const projectTasks = await TaskModel.find({ project: this._id })

        if (projectTasks.length > 0) {
            const completedTasks = projectTasks.filter((task: DocumentType<Task>) => task.stage === EStage.COMPLETED)
            this.completedTasks = completedTasks.length
            this.progress = completedTasks.length / projectTasks.length

            const effort = projectTasks.map((task: DocumentType<Task>) => task.effort).reduce((prev: number, curr: number) => prev + curr)
            this.rice = Math.round((this.reach * this.impact * this.confidence) / effort)

            const willMeetDeadline = this.neededBy > new Date(Date.now() + effort * 30 * 86400000)
            this.willMeetDeadline = willMeetDeadline

            await this.save()
        }
        return this
    }
}
