import { object, string, TypeOf } from 'zod'

export const createTaskSchema = object({
    body: object({}),
})

export type CreateTaskInput = TypeOf<typeof createTaskSchema>['body']
