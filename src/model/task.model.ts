import { getModelForClass, prop } from '@typegoose/typegoose'

export class Task {
    @prop({})
    userId: String

    @prop({})
    name: String

    @prop({})
    date: String

    @prop({})
    type: String

    @prop({})
    plannedStart: Date

    @prop({})
    plannedEnd: Date

    @prop({})
    completed: Boolean

    @prop({})
    started: Boolean

    @prop({})
    startedTime: Date

    @prop({})
    endedTime: Date
}

const TaskModel = getModelForClass(Task)

export default TaskModel
