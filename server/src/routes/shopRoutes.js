import { Router } from 'express'
import { getMyShop, registerShop } from '../controllers/shopController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { uploadShopLogo, handleMulterError } from '../middleware/upload.js'
import { ROLES } from '../constants/roles.js'

const router = Router()

// All shop routes require authentication AND shop-owner role
router.use(authenticate, authorize(ROLES.SHOP_OWNER))

router.get('/me', getMyShop)
router.post('/register', uploadShopLogo, handleMulterError, registerShop)
router.patch('/register', uploadShopLogo, handleMulterError, registerShop)

export default router
