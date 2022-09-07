import { object, optional, string, TypeOf } from 'zod'
import { ProjectModel } from '../../models'
import { documentExists } from '../../utils/documentExists'

export const createTaskSchema = object({
    body: object({
        title: string({
            required_error: 'Title is required.',
        }),
        project: string().refine((data) => documentExists(ProjectModel, data), {
            message: 'Project does not exist.',
        }),
    }),
})

export const updateTaskSchema = object({
    body: object({
        title: optional(string().min(1, 'Title is required.')),
        project: optional(
            string().refine((data) => documentExists(ProjectModel, data), {
                message: 'Project does not exist.',
            })
        ),
    }),
})

export type CreateTaskInput = TypeOf<typeof createTaskSchema>['body']
export type UpdateTaskInput = TypeOf<typeof updateTaskSchema>['body']
