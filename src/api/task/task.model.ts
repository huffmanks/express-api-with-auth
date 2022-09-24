import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { User } from '../user/user.model'
import { Project } from '../project/project.model'

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
        immutable: true,
    })
    createdBy: Ref<User>

    @prop({
        ref: () => User,
    })
    assignedTo: Ref<User>

    @prop({
        required: true,
    })
    effort: number
}
