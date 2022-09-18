import { Router } from 'express'

import { createProjectSchema, updateProjectSchema } from './project.schema'
import { getProjectsHandler, getProjectHandler, createProjectHandler, updateProjectHandler, deleteProjectHandler } from './project.controller'

import authorizeUser from '../../middleware/authorizeUser'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.get('/', getProjectsHandler)

router.get('/:id', getProjectHandler)

router.post('/create', authorizeUser('bull', 'mako'), validateResource(createProjectSchema), createProjectHandler)

router.patch('/update/:id', authorizeUser('bull'), validateResource(updateProjectSchema), updateProjectHandler)

router.delete('/:id', authorizeUser('bull'), deleteProjectHandler)

export default router
