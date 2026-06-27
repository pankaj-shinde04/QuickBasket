import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  getAllOrders,
  getOrderByDisplayIdForShopOwner,
  updateOrderStatus,
  getOrdersByStatus,
} from '../services/orderService.js'
import { ROLES } from '../constants/roles.js'

const router = express.Router()

router.use(authenticate)
router.use(authorize(ROLES.ADMIN))

// GET /api/admin/orders/all — get all orders for admin
router.get(
  '/all',
  asyncHandler(async (req, res) => {
    const orders = await getAllOrders()
    res.json({ success: true, data: { orders } })
  }),
)

// GET /api/admin/orders/:displayId — get single order for admin
router.get(
  '/:displayId',
  asyncHandler(async (req, res) => {
    const order = await getOrderByDisplayIdForShopOwner(req.params.displayId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    res.json({ success: true, data: { order } })
  }),
)

// PATCH /api/admin/orders/:displayId/status — update order status
router.patch(
  '/:displayId/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body
    if (!status) return res.status(400).json({ success: false, message: 'Status is required.' })
    const order = await updateOrderStatus(req.params.displayId, status)
    res.json({ success: true, data: { order } })
  }),
)

// GET /api/admin/orders/status/:status — get orders by status
router.get(
  '/status/:status',
  asyncHandler(async (req, res) => {
    const orders = await getOrdersByStatus(req.params.status)
    res.json({ success: true, data: { orders } })
  }),
)

export default router
