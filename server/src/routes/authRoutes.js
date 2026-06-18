import { Router } from 'express'
import { register, login, me, logout } from '../controllers/authController.js'
import { registerValidator, loginValidator } from '../validators/authValidators.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/register', registerValidator, validate, register)
router.post('/login', loginValidator, validate, login)
router.get('/me', authenticate, me)
router.post('/logout', authenticate, logout)

export default router
