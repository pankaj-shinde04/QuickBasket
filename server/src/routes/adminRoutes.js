import { Router } from 'express'
import {
  createAdmin,
  listAdmins,
  listUsers,
  getUserStats,
  updateUserStatus,
} from '../controllers/adminController.js'
import {
  createAdminValidator,
  listUsersValidator,
  updateUserStatusValidator,
} from '../validators/adminValidators.js'
import { validate } from '../middleware/validate.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { ROLES } from '../constants/roles.js'

const router = Router()

router.use(authenticate, authorize(ROLES.ADMIN))

router.post('/admins', createAdminValidator, validate, createAdmin)
router.get('/admins', listAdmins)
router.get('/users/stats', getUserStats)
router.get('/users', listUsersValidator, validate, listUsers)
router.patch('/users/:id/status', updateUserStatusValidator, validate, updateUserStatus)

export default router
