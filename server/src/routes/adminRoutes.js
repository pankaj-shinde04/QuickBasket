import { Router } from 'express'
import {
  createAdmin,
  listAdmins,
  listUsers,
  getUserStats,
  updateUserStatus,
  listVendors,
  getVendorStats,
  approveVendor,
  rejectVendor,
} from '../controllers/adminController.js'
import {
  createAdminValidator,
  listUsersValidator,
  updateUserStatusValidator,
  listVendorsValidator,
  vendorIdValidator,
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

router.get('/vendors/stats', getVendorStats)
router.get('/vendors', listVendorsValidator, validate, listVendors)
router.patch('/vendors/:id/approve', vendorIdValidator, validate, approveVendor)
router.patch('/vendors/:id/reject', vendorIdValidator, validate, rejectVendor)

export default router
