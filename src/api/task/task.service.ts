import { ProjectModel, TaskModel } from '../../models'
import { getProjectById } from '../project/project.service'

import { CreateTaskInput, UpdateTaskInput } from './task.schema'

export function getTasks() {
    return TaskModel.find({})
}

export function getTaskById(id: string) {
    return TaskModel.findById({ userId: id })
}

export async function createTask(input: CreateTaskInput) {
    const task = await TaskModel.create(input)

    const project = await ProjectModel.findByIdAndUpdate(input.project, { $addToSet: { tasks: task._id } }, { new: true })

    await project?.setProjectStats()

    return task
}

export async function updateTask(id: string, input: UpdateTaskInput) {
    const task = TaskModel.findByIdAndUpdate({ _id: id }, input, { new: true })

    const project = await getProjectById(task.project)

    if (input.project) {
        const newProject = await ProjectModel.findByIdAndUpdate(input.project, { $addToSet: { tasks: task._id } }, { new: true })
        await newProject?.setProjectStats()

        await project?.update({ $pull: { tasks: task._id } }, { new: true })
    } else {
        await project?.setProjectStats()
    }

    return task
}

export async function deleteTask(id: string) {
    await ProjectModel.findByIdAndDelete({ tasks: { task: id } })
    return TaskModel.findByIdAndDelete(id)
}
