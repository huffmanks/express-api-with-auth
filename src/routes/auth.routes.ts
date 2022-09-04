import { Router } from 'express'

import { createUserSchema } from '../schema/user.schema'
import { registerHandler, loginHandler, forgotPasswordHandler, resetPasswordHandler, refreshAccessTokenHandler, logoutHandler } from '../controller/auth.controller'

import validateResource from '../middleware/validateResource'

const router = Router()

router.post('/register', validateResource(createUserSchema), registerHandler)

router.post('/login', loginHandler)

router.post('/forgot-password', forgotPasswordHandler)

router.post('/reset-password/:resetPasswordToken', resetPasswordHandler)

router.post('/refresh', refreshAccessTokenHandler)

router.post('/logout', logoutHandler)

export default router
