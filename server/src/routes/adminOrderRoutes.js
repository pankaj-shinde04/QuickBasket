import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../services/orderService.js'

const router = express.Router()

// All admin order routes require authentication and admin/shop-owner role
router.use(authenticate)
router.use(authorize('admin', 'shop-owner'))

// GET /api/admin/orders — get all orders
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const orders = await getAllOrders()
    res.json({ success: true, data: { orders } })
  }),
)

// GET /api/admin/orders/:id — get single order by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const order = await getOrderById(req.params.id)
    res.json({ success: true, data: { order } })
  }),
)

// PATCH /api/admin/orders/:id/status — update order status
router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' })
    }
    const order = await updateOrderStatus(req.params.id, status)
    res.json({ success: true, data: { order } })
  }),
)

export default router
