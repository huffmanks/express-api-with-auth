import { Router } from 'express'

import auth from '../api/auth/auth.routes'
import user from '../api/user/user.routes'
// import team from '../api/team/team.routes'
import project from '../api/project/project.routes'
import task from '../api/task/task.routes'

const router = Router()

router.use('/auth', auth)
router.use('/users', user)
// router.use('/teams', team)
router.use('/projects', project)
router.use('/tasks', task)

export default router
