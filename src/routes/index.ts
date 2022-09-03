import { Router } from 'express'

import user from './user.routes'
import auth from './auth.routes'
import task from './task.routes'

const router = Router()

router.use('/auth', auth)
router.use('/users', user)
router.use('/tasks', task)

export default router
