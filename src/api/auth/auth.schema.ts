import { object, string, TypeOf } from 'zod'

export const loginUserSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required.',
        }).email('Email is not valid.'),
        password: string({
            required_error: 'Password is required.',
        }),
    }),
})

export const resetPasswordSchema = object({
    body: object({
        password: string({
            required_error: 'Password is required.',
        }).min(8, 'Password must be a minimum of 8 characters.'),
        passwordConfirmation: string({
            required_error: 'Password confirmation is required.',
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match.',
        path: ['passwordConfirmation'],
    }),
})

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body']
