import { Router } from 'express'

import { createUserSchema, updateUserSchema } from './user.schema'
import { getUsersHandler, getUserHandler, createUserHandler, updateUserHandler, deleteUserHandler } from './user.controller'

import authorizeUser from '../../middleware/authorizeUser'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.get('/', getUsersHandler)

router.get('/:id', getUserHandler)

router.post('/create', authorizeUser('bull'), validateResource(createUserSchema), createUserHandler)

router.patch('/update/:id', authorizeUser('bull'), validateResource(updateUserSchema), updateUserHandler)

router.delete('/:id', authorizeUser('bull'), deleteUserHandler)

export default router
