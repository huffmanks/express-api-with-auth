import { Router } from 'express'

import { createProjectSchema, updateProjectSchema } from './project.schema'
import { getProjectsHandler, getProjectHandler, createProjectHandler, updateProjectHandler, deleteProjectHandler } from './project.controller'

import restrictRoute from '../../middleware/restrictRoute'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.get('/', getProjectsHandler)

router.get('/:id', getProjectHandler)

router.post('/create', restrictRoute('bull', 'mako'), validateResource(createProjectSchema), createProjectHandler)

router.patch('/update/:id', restrictRoute('bull', 'mako'), validateResource(updateProjectSchema), updateProjectHandler)

router.delete('/:id', restrictRoute('bull', 'mako'), deleteProjectHandler)

export default router
