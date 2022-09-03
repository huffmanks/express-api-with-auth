import { Router } from 'express'

import { createUserSchema } from '../schema/user.schema'
import { getUsersHandler, getUserHandler, createUserHandler, updateUserHandler, deleteUserHandler } from '../controller/user.controller'

import validateResource from '../middleware/validateResource'

const router = Router()

router.get('/', getUsersHandler)

router.get('/:id', getUserHandler)

router.post('/create', validateResource(createUserSchema), createUserHandler)

router.put('/update/:id', updateUserHandler)

router.delete('/:id', deleteUserHandler)

export default router
