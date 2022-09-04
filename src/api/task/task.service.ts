import { DocumentType } from '@typegoose/typegoose'

import TaskModel, { Task } from './task.model'
import { CreateTaskInput } from './task.schema'

export function getTasks() {
    return TaskModel.find({})
}

export function getTaskById(id: string) {
    return TaskModel.findById({ userId: id })
}

export function createTask(input: CreateTaskInput) {
    return TaskModel.create(input)
}

export function updateTask(task: DocumentType<Task>) {
    return TaskModel.findByIdAndUpdate(task._id, task, { new: true })
}

export function deleteTask(id: string) {
    return TaskModel.findByIdAndDelete(id)
}
