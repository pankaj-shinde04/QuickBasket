import { Router } from 'express'
import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'
import shopRoutes from './shopRoutes.js'
import productRoutes from './productRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import settingsRoutes from './settingsRoutes.js'
import publicRoutes from './publicRoutes.js'
import orderRoutes from './orderRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import adminOrderRoutes from './adminOrderRoutes.js'

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
router.use('/categories', categoryRoutes)
router.use('/settings', settingsRoutes)
router.use('/public', publicRoutes)
router.use('/orders', orderRoutes)
router.use('/payments', paymentRoutes)
router.use('/admin/orders', adminOrderRoutes)

export default router
