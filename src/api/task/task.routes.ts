import { Router } from 'express'

import { createTaskSchema, updateTaskSchema } from './task.schema'
import { getTasksHandler, getTaskHandler, createTaskHandler, updateTaskHandler, deleteTaskHandler } from './task.controller'

import restrictRoute from '../../middleware/restrictRoute'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.get('/', getTasksHandler)

router.get('/:id', getTaskHandler)

router.post('/create', validateResource(createTaskSchema), createTaskHandler)

router.patch('/update/:id', validateResource(updateTaskSchema), updateTaskHandler)

router.delete('/:id', restrictRoute('bull', 'mako'), deleteTaskHandler)

export default router
