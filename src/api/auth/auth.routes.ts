import { Router } from 'express'

import { createUserSchema, resetPasswordSchema } from '../user/user.schema'
import { registerHandler, loginHandler, forgotPasswordHandler, resetPasswordHandler, logoutHandler } from './auth.controller'

import deserializeUser from '../../middleware/deserializeUser'
import validateResource from '../../middleware/validateResource'

const router = Router()

router.post('/register', validateResource(createUserSchema), registerHandler)

router.post('/login', loginHandler)

router.post('/forgot-password', forgotPasswordHandler)

router.post('/reset-password/:resetPasswordToken', validateResource(resetPasswordSchema), resetPasswordHandler)

router.post('/logout', deserializeUser, logoutHandler)

export default router
