import { number, object, optional, string, TypeOf } from 'zod'
import { ProjectModel, UserModel } from '../../models'
import { documentExists } from '../../utils/documentExists'

export const createTaskSchema = object({
    body: object({
        title: string({
            required_error: 'Title is required.',
        }),
        project: string({
            required_error: 'Project is required.',
        }).refine((data) => documentExists(ProjectModel, data), {
            message: 'Project does not exist.',
        }),
        creator: string({
            required_error: 'Creator is required.',
        }).refine((data) => documentExists(UserModel, data), {
            message: 'User does not exist.',
        }),
        effort: number({
            required_error: 'Effort is required.',
        }),
    }),
})

export const updateTaskSchema = object({
    body: object({
        title: optional(string().min(1, 'Title is required.')),
        description: optional(string()),
        project: optional(
            string()
                .min(1, 'Project is required.')
                .refine((data) => documentExists(ProjectModel, data), {
                    message: 'Project does not exist.',
                })
        ),
        creator: optional(
            string()
                .min(1, 'Creator is required.')
                .refine((data) => documentExists(UserModel, data), {
                    message: 'User does not exist.',
                })
        ),
        assignee: optional(
            string().refine((data) => documentExists(UserModel, data), {
                message: 'User does not exist.',
            })
        ),
        effort: optional(number().min(1, 'Effort is required.')),
    }),
})

export type CreateTaskInput = TypeOf<typeof createTaskSchema>['body']
export type UpdateTaskInput = TypeOf<typeof updateTaskSchema>['body']
