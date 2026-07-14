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

const router = Router()

router.post('/register', registerValidator, validate, register)
router.post('/login', loginValidator, validate, login)
router.get('/me', authenticate, me)
router.post('/logout', authenticate, logout)

// Password recovery
router.post('/forgot-password', asyncHandler(forgotPassword))
router.post('/reset-password', asyncHandler(resetPassword))

export default router
