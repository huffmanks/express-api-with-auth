import { Router } from 'express'

import { createUserSchema, updateUserSchema } from './user.schema'
import { getUsersHandler, getUserHandler, createUserHandler, updateUserHandler, deleteUserHandler } from './user.controller'

import checkToken from '../../middleware/checkToken'
import restrictRole from '../../middleware/restrictRole'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.get('/', checkToken, restrictRole('bull', 'mako'), getUsersHandler)

router.get('/:id', checkToken, restrictRole('bull', 'mako'), getUserHandler)

router.post('/create', checkToken, restrictRole('bull'), validateResource(createUserSchema), createUserHandler)

router.put('/update/:id', checkToken, restrictRole('bull'), validateResource(updateUserSchema), updateUserHandler)

router.delete('/:id', checkToken, restrictRole('bull'), deleteUserHandler)

export default router
