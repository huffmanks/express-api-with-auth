import { Router } from 'express'

import { createTaskSchema, updateTaskSchema } from '../schema/task.schema'
import { getTasksHandler, getTaskHandler, createTaskHandler, updateTaskHandler, deleteTaskHandler } from '../controller/task.controller'

import checkToken from '../middleware/checkToken'
import restrictRole from '../middleware/restrictRole'
import validateResource from '../middleware/validateResource'

const router = Router()

router.get('/', checkToken, getTasksHandler)

router.get('/:id', checkToken, getTaskHandler)

router.post('/create', checkToken, validateResource(createTaskSchema), createTaskHandler)

router.put('/update/:id', checkToken, restrictRole('bull'), validateResource(updateTaskSchema), updateTaskHandler)

router.delete('/:id', checkToken, restrictRole('bull'), deleteTaskHandler)

export default router
