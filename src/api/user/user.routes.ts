import { Router } from 'express'

import { createUserSchema, updateUserSchema } from './user.schema'
import { getUsersHandler, getUserHandler, createUserHandler, updateUserHandler, deleteUserHandler } from './user.controller'

import checkToken from '../../middleware/checkToken'
import restrictRole from '../../middleware/restrictRole'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.get('/', checkToken, getUsersHandler)

router.get('/:id', checkToken, getUserHandler)

router.post('/create', checkToken, restrictRole('bull', 'mako'), validateResource(createUserSchema), createUserHandler)

router.patch('/update/:id', checkToken, restrictRole('bull', 'mako'), validateResource(updateUserSchema), updateUserHandler)

router.delete('/:id', checkToken, restrictRole('bull'), deleteUserHandler)

export default router
