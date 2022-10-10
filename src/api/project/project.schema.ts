import { array, date, nativeEnum, number, object, optional, string, TypeOf } from 'zod'

import { documentExists } from '../../utils/documentExists'

// import { TeamModel } from '../../models'
import { TaskModel, UserModel } from '../../models'
import { EStage } from './project.model'

export const createProjectSchema = object({
    body: object({
        title: string({
            required_error: 'Title is required.',
        }),
        description: optional(string()),
        // teams: array(string()).refine((data) => data.every((id) => documentExists(TeamModel, id)), {
        //     message: 'One or more teams do not exist.',
        // }),
        tasks: optional(
            array(string()).refine((data) => data.every((id) => documentExists(TaskModel, id)), {
                message: 'One or more tasks do not exist.',
            })
        ),
        clients: optional(
            array(string()).refine((data) => data.every((id) => documentExists(UserModel, id)), {
                message: 'One or more clients do not exist.',
            })
        ),
        neededBy: date({
            required_error: 'A needed by date is required.',
        }),
        stage: optional(nativeEnum(EStage)),
        reach: number({
            required_error: 'Reach is required.',
        }),
        impact: number({
            required_error: 'Impact is required.',
        }),
        confidence: number({
            required_error: 'Confidence is required.',
        }),
    }),
})

export const updateProjectSchema = object({
    body: object({
        title: optional(string().min(1, 'Title is required.')),
        description: optional(string()),
        // teams: optional(
        //     array(string()).refine((data) => data.every((id) => documentExists(TeamModel, id)), {
        //         message: 'One or more teams do not exist.',
        //     })
        // ),
        tasks: optional(
            array(string()).refine((data) => data.every((id) => documentExists(TaskModel, id)), {
                message: 'One or more tasks do not exist.',
            })
        ),
        clients: optional(
            array(string()).refine((data) => data.every((id) => documentExists(UserModel, id)), {
                message: 'One or more clients do not exist.',
            })
        ),
        neededBy: optional(date().min(new Date(), 'A needed by date is required.')),
        stage: optional(nativeEnum(EStage)),
        reach: optional(number().min(1, 'Reach is required.')),
        impact: optional(number().min(1, 'Impact is required.')),
        confidence: optional(number().min(1, 'Confidence is required.')),
    }),
})

export type CreateProjectInput = TypeOf<typeof createProjectSchema>['body']
export type UpdateProjectInput = TypeOf<typeof updateProjectSchema>['body']
