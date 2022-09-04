import { Router } from 'express'

import user from '../api/user/user.routes'
import auth from '../api/auth/auth.routes'
import task from '../api/task/task.routes'

const router = Router()

router.use('/auth', auth)
router.use('/users', user)
router.use('/tasks', task)

export default router
