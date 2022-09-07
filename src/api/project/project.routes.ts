import { Router } from 'express'

import { createProjectSchema, updateProjectSchema } from './project.schema'
import { getProjectsHandler, getProjectHandler, createProjectHandler, updateProjectHandler, deleteProjectHandler } from './project.controller'

import checkToken from '../../middleware/checkToken'
import restrictRole from '../../middleware/restrictRole'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.get('/', checkToken, getProjectsHandler)

router.get('/:id', checkToken, getProjectHandler)

router.post('/create', checkToken, restrictRole('bull', 'mako'), validateResource(createProjectSchema), createProjectHandler)

router.patch('/update/:id', checkToken, restrictRole('bull', 'mako'), validateResource(updateProjectSchema), updateProjectHandler)

router.delete('/:id', checkToken, restrictRole('bull', 'mako'), deleteProjectHandler)

export default router
