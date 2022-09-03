import { Router } from 'express'

import { createLoginHandler, refreshAccessTokenHandler, getQuestionHandler, restorePasswordHandler } from '../controller/auth.controller'

const router = Router()

router.post('/login', createLoginHandler)

router.post('/refresh', refreshAccessTokenHandler)

router.get('/restore', getQuestionHandler)

router.post('/restore', restorePasswordHandler)

export default router
