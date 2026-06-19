import { Router } from 'express'
import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'

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

export default router
