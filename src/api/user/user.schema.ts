import { literal, nativeEnum, object, optional, string, TypeOf } from 'zod'

import { ERole } from './user.model'

export const createUserSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required.',
        }).email('Email is not valid.'),

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

export const updateUserSchema = object({
    body: object({
        firstName: optional(string()),
        lastName: optional(string()),
        email: optional(string().email('Email is not valid.').min(1, 'Email is required.')),
        password: optional(string().min(8, 'Password must be a minimum of 8 characters.')),
        passwordConfirmation: optional(string().min(8, 'Password must be a minimum of 8 characters.')),
        role: optional(nativeEnum(ERole)),
        profileImage: optional(string().url()),
        // profileImage: string().url().optional().or(literal('')),
    }).refine((data) => data?.password === data?.passwordConfirmation, {
        message: 'Passwords do not match.',
        path: ['passwordConfirmation'],
    }),
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']
export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body']
