import { Router } from 'express'
import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'
import shopRoutes from './shopRoutes.js'
import productRoutes from './productRoutes.js'
import settingsRoutes from './settingsRoutes.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'QuickBasket API is running',
    timestamp: new Date().toISOString(),
  })
})

router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/shops', shopRoutes)
router.use('/products', productRoutes)
router.use('/settings', settingsRoutes)

export default router
