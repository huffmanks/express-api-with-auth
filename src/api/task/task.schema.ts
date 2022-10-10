import { array, nativeEnum, number, object, optional, string, TypeOf } from 'zod'

import { documentExists } from '../../utils/documentExists'

import { ProjectModel, UserModel } from '../../models'
import { EStage } from './task.model'

export const createTaskSchema = object({
    body: object({
        title: string({
            required_error: 'Title is required.',
        }),
        description: optional(string()),
        project: string({
            required_error: 'Project is required.',
        }).refine((data) => documentExists(ProjectModel, data), {
            message: 'Project does not exist.',
        }),
        assignedTo: optional(
            string().refine((data) => documentExists(UserModel, data), {
                message: 'User does not exist.',
            })
        ),
        stage: optional(nativeEnum(EStage)),
        uploads: optional(
            array(
                string().url({
                    message: 'One or more uploads are not valid.',
                })
            )
        ),
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
        assignedTo: optional(
            string().refine((data) => documentExists(UserModel, data), {
                message: 'User does not exist.',
            })
        ),
        stage: optional(nativeEnum(EStage)),
        uploads: optional(
            array(
                string().url({
                    message: 'One or more uploads are not valid.',
                })
            )
        ),
        effort: optional(number().min(1, 'Effort is required.')),
    }),
})

export type CreateTaskInput = TypeOf<typeof createTaskSchema>['body']
export type UpdateTaskInput = TypeOf<typeof updateTaskSchema>['body']
