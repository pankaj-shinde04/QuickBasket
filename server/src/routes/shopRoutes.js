import { Router } from 'express'
import { getMyShop, registerShop } from '../controllers/shopController.js'
import { authenticate } from '../middleware/auth.js'
import { uploadShopLogo, handleMulterError } from '../middleware/upload.js'
import { ROLES } from '../constants/roles.js'

const router = Router()

router.use(authenticate)

router.get('/me', getMyShop)
router.post('/register', uploadShopLogo, handleMulterError, registerShop)
router.patch('/register', uploadShopLogo, handleMulterError, registerShop)

export default router
