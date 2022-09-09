import { Router } from 'express'

import auth from '../api/auth/auth.routes'
import user from '../api/user/user.routes'
// import team from '../api/team/team.routes'
import project from '../api/project/project.routes'
import task from '../api/task/task.routes'
import deserializeUser from '../middleware/deserializeUser'

const router = Router()

router.use('/auth', auth)
router.use('/users', deserializeUser, user)
// router.use('/teams', deserializeUser, team)
router.use('/projects', deserializeUser, project)
router.use('/tasks', deserializeUser, task)

export default router
