import { nativeEnum, object, optional, string, TypeOf } from 'zod'
import { mongoose } from '@typegoose/typegoose'

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

export const updateUserSchema = object({
    body: object({
        _id: optional(string().transform(() => mongoose.Types.ObjectId)),

        firstName: optional(string()),

        lastName: optional(string()),

        email: optional(
            string({
                required_error: 'Email is required.',
            }).email('Email is not valid.')
        ),

        password: optional(
            string({
                required_error: 'Password is required.',
            }).min(8, 'Password must be a minimum of 8 characters.')
        ),

        passwordConfirmation: optional(
            string({
                required_error: 'Password confirmation is required.',
            })
        ),

        role: optional(nativeEnum(ERole)),

        avatarUrl: optional(string().url()),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match.',
        path: ['passwordConfirmation'],
    }),
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body']
export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body']
