import { ProjectModel, TaskModel } from '../../models'

import { CreateTaskInput, UpdateTaskInput } from './task.schema'

export function getTasks() {
    return TaskModel.find({})
}

export function getTaskById(id: string) {
    return TaskModel.findById({ userId: id })
}

export async function createTask(input: CreateTaskInput) {
    const task = await TaskModel.create(input)

    await ProjectModel.findByIdAndUpdate(input.project, { $addToSet: { tasks: task._id } }, { new: true })

    return task
}

export async function updateTask(id: string, input: UpdateTaskInput) {
    const task = TaskModel.findByIdAndUpdate({ _id: id }, input, { new: true })

    if (input.project) await ProjectModel.findByIdAndUpdate(input.project, { $addToSet: { tasks: task._id } }, { new: true })

    return task
}

export async function deleteTask(id: string) {
    const task = TaskModel.findByIdAndDelete(id)
    await ProjectModel.findByIdAndDelete({ tasks: { task: id } })

    return task
}
