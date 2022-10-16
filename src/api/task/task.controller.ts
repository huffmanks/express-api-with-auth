import { NextFunction, Request, Response } from 'express'

import { CreateTaskInput, UpdateTaskInput } from './task.schema'

import { getTasks, getTaskById, createTask, updateTask, deleteTask } from './task.service'

export async function getTasksHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const tasks = await getTasks()

        res.status(200).send(tasks)
    } catch (err) {
        next(err)
    }
}

export async function getTaskHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string
        const task = await getTaskById(id)

        res.status(200).send(task)
    } catch (err) {
        next(err)
    }
}

export async function createTaskHandler(req: Request<{}, {}, CreateTaskInput>, res: Response, next: NextFunction) {
    try {
        const input = { ...req.body, createdBy: res.locals.user._id }
        const task = await createTask(input)

        res.status(201).send(task)
    } catch (err) {
        next(err)
    }
}

export async function updateTaskHandler(req: Request<{ id: string }, {}, UpdateTaskInput>, res: Response, next: NextFunction) {
    try {
        const id = req.params.id
        const updatedTask = await updateTask(id, req.body)

        return res.status(200).send(updatedTask)
    } catch (err) {
        next(err)
    }
}

export async function deleteTaskHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string
        const task = await deleteTask(id)

        res.status(200).send(task)
    } catch (err) {
        next(err)
    }
}
