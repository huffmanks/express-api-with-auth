import { Router } from 'express'

import { createTaskSchema, updateTaskSchema } from './task.schema'
import { getTasksHandler, getTaskHandler, createTaskHandler, updateTaskHandler, deleteTaskHandler } from './task.controller'

import authorizeUser from '../../middleware/authorizeUser'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.get('/', getTasksHandler)

router.get('/:id', getTaskHandler)

router.post('/create', authorizeUser('bull', 'mako'), validateResource(createTaskSchema), createTaskHandler)

router.patch('/update/:id', authorizeUser('bull'), validateResource(updateTaskSchema), updateTaskHandler)

router.delete('/:id', authorizeUser('bull'), deleteTaskHandler)

export default router
