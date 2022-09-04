import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from '../user/user.model'

export class Task {
    @prop({
        ref: () => User,
    })
    users: Ref<User>[]

    @prop({
        required: true,
    })
    title: String

    @prop({})
    description: String
}

const TaskModel = getModelForClass(Task)

export default TaskModel
