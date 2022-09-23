import { object, optional, string, TypeOf } from 'zod'

// import { TeamModel } from '../../models'
// import { documentExists } from '../../utils/documentExists'

export const createProjectSchema = object({
    body: object({
        title: string({
            required_error: 'Title is required.',
        }),
        // team: string().refine((data) => documentExists(TeamModel, data), {
        //     message: 'Team does not exist.',
        // }),
    }),
})

export const updateProjectSchema = object({
    body: object({
        title: optional(string().min(1, 'Title is required.')),
        description: optional(string()),
        // team: optional(string().refine((data) => documentExists(TeamModel, data), {
        //     message: 'Team does not exist.',
        // })),
    }),
})

export type CreateProjectInput = TypeOf<typeof createProjectSchema>['body']
export type UpdateProjectInput = TypeOf<typeof updateProjectSchema>['body']
