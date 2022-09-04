import { Request, Response } from 'express'

import { CreateTaskInput } from './task.schema'

import { getTasks, getTaskById, createTask, updateTask, deleteTask } from './task.service'

export async function getTasksHandler(req: Request, res: Response) {
    const tasks = await getTasks()

    res.send(tasks)
}

export async function getTaskHandler(req: Request, res: Response) {
    const id = req.query.id as string
    const task = await getTaskById(id)

    res.send(task)
}

export async function createTaskHandler(req: Request<{}, {}, CreateTaskInput>, res: Response) {
    const response = await createTask(req.body)

    res.send(response)
}

export async function updateTaskHandler(req: Request, res: Response) {
    const response = await updateTask(req.body)

    res.send(response)
}

export async function deleteTaskHandler(req: Request, res: Response) {
    const id = req.params.id as string
    const response = await deleteTask(id)

    res.send(response)
}
