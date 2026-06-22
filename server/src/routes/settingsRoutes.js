import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { uploadShopLogo, handleMulterError } from '../middleware/upload.js'
import { updateProfile, changePassword, updateShop } from '../controllers/settingsController.js'

const router = Router()

router.use(authenticate)

// Update user name + avatar
router.patch('/profile', uploadShopLogo, handleMulterError, updateProfile)

// Change password
router.patch('/password', changePassword)

// Update shop details (name, address, contactNumber, logo, hours)
router.patch('/shop', uploadShopLogo, handleMulterError, updateShop)

export default router
