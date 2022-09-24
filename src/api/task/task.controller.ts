import { Request, Response } from 'express'

import { CreateTaskInput, UpdateTaskInput } from './task.schema'

import { getTasks, getTaskById, createTask, updateTask, deleteTask } from './task.service'

export async function getTasksHandler(req: Request, res: Response) {
    const tasks = await getTasks()

    res.status(200).send(tasks)
}

export async function getTaskHandler(req: Request, res: Response) {
    const id = req.params.id as string
    const task = await getTaskById(id)

    res.status(200).send(task)
}

export async function createTaskHandler(req: Request<{}, {}, CreateTaskInput>, res: Response) {
    const input = { ...req.body, createdBy: res.locals.user._id }
    const task = await createTask(input)

    res.status(201).send(task)
}

export async function updateTaskHandler(req: Request<{ id: string }, {}, UpdateTaskInput>, res: Response) {
    try {
        const id = req.params.id

        const updatedTask = await updateTask(id, req.body)
        if (!updatedTask) return res.status(500).send('Could not update task.')

        return res.status(200).send(updatedTask)
    } catch (e: any) {}
}

export async function deleteTaskHandler(req: Request, res: Response) {
    const id = req.params.id as string

    const task = await deleteTask(id)
    if (!task) return res.status(500).send('Could not delete task.')

    res.status(200).send(task)
}
