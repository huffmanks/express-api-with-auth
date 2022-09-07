import { Router } from 'express'

import { createTaskSchema, updateTaskSchema } from './task.schema'
import { getTasksHandler, getTaskHandler, createTaskHandler, updateTaskHandler, deleteTaskHandler } from './task.controller'

import checkToken from '../../middleware/checkToken'
import restrictRole from '../../middleware/restrictRole'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.get('/', checkToken, getTasksHandler)

router.get('/:id', checkToken, getTaskHandler)

router.post('/create', checkToken, validateResource(createTaskSchema), createTaskHandler)

router.patch('/update/:id', checkToken, validateResource(updateTaskSchema), updateTaskHandler)

router.delete('/:id', checkToken, restrictRole('bull', 'mako'), deleteTaskHandler)

export default router
