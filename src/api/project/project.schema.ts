import { array, number, object, optional, string, TypeOf } from 'zod'

// import { TeamModel } from '../../models'
import { TaskModel } from '../../models'
import { documentExists } from '../../utils/documentExists'

export const createProjectSchema = object({
    body: object({
        title: string({
            required_error: 'Title is required.',
        }),
        // team: string({
        //     required_error: 'Team is required.',
        // }).refine((data) => documentExists(TeamModel, data), {
        //     message: 'Team does not exist.',
        // }),
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
        // team: optional(
        //     string()
        //         .min(1, 'Team is required.')
        //         .refine((data) => documentExists(TeamModel, data), {
        //             message: 'Team does not exist.',
        //         })
        // ),
        tasks: optional(
            array(string()).refine((data) => data.every((id) => documentExists(TaskModel, id)), {
                message: 'One or more tasks do not exist.',
            })
        ),
        users: optional(
            array(string()).refine((data) => data.every((id) => documentExists(TaskModel, id)), {
                message: 'One or more tasks do not exist.',
            })
        ),
        reach: optional(number().min(1, 'Reach is required.')),
        impact: optional(number().min(1, 'Impact is required.')),
        confidence: optional(number().min(1, 'Confidence is required.')),
    }),
})

export type CreateProjectInput = TypeOf<typeof createProjectSchema>['body']
export type UpdateProjectInput = TypeOf<typeof updateProjectSchema>['body']
