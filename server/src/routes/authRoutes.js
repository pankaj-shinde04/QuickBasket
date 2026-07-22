import { Router } from 'express'
import {
  register,
  login,
  me,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'
import { registerValidator, loginValidator } from '../validators/authValidators.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/register', authLimiter, registerValidator, validate, register)
router.post('/login', authLimiter, loginValidator, validate, login)
router.get('/me', authenticate, me)
router.post('/logout', authenticate, logout)

// Password recovery
router.post('/forgot-password', passwordResetLimiter, asyncHandler(forgotPassword))
router.post('/reset-password', passwordResetLimiter, asyncHandler(resetPassword))

export default router
