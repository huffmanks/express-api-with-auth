import { Router } from 'express'

import { createUserSchema, updateUserSchema } from './user.schema'
import { getUsersHandler, getUserHandler, createUserHandler, updateUserHandler, deleteUserHandler } from './user.controller'

import restrictRoute from '../../middleware/restrictRoute'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.get('/', getUsersHandler)

router.get('/:id', getUserHandler)

router.post('/create', restrictRoute('bull', 'mako'), validateResource(createUserSchema), createUserHandler)

router.patch('/update/:id', restrictRoute('bull', 'mako'), validateResource(updateUserSchema), updateUserHandler)

router.delete('/:id', restrictRoute('bull'), deleteUserHandler)

export default router
