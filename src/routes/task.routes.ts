import { Router } from 'express'

import { createTaskSchema } from '../schema/task.schema'
import { getTasksHandler, getTaskHandler, createTaskHandler, updateTaskHandler, deleteTaskHandler } from '../controller/task.controller'
import { refreshAccessTokenHandler } from '../controller/auth.controller'

import checkToken from '../middleware/checkToken'
import validateResource from '../middleware/validateResource'

const router = Router()

router.get('/', getTasksHandler)

router.get('/:id', getTaskHandler)

router.post('/create', checkToken, validateResource(createTaskSchema), createTaskHandler)

router.put('/update/:id', checkToken, updateTaskHandler)

router.delete('/:id', checkToken, deleteTaskHandler)

router.get('/refresh', refreshAccessTokenHandler)

export default router
