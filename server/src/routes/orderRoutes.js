import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  placeOrder,
  getCustomerOrders,
  getOrderByDisplayId,
  cancelOrder,
} from '../services/orderService.js'
import { placeOrderValidation, validateOrder } from '../validators/orderValidator.js'

const router = express.Router()

// All order routes require authentication as customer
router.use(authenticate)
router.use(authorize('customer'))

// POST /api/orders — place a new order
router.post(
  '/',
  placeOrderValidation,
  validateOrder,
  asyncHandler(async (req, res) => {
    console.log('Order request body:', JSON.stringify(req.body, null, 2))
    const order = await placeOrder(req.user._id, req.body)
    res.status(201).json({ success: true, data: { order } })
  }),
)

// GET /api/orders — get all orders for logged-in customer
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const orders = await getCustomerOrders(req.user._id)
    res.json({ success: true, data: { orders } })
  }),
)

// GET /api/orders/:displayId — get single order
router.get(
  '/:displayId',
  asyncHandler(async (req, res) => {
    const order = await getOrderByDisplayId(req.user._id, req.params.displayId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    res.json({ success: true, data: { order } })
  }),
)

// PATCH /api/orders/:displayId/cancel — cancel an order
router.patch(
  '/:displayId/cancel',
  asyncHandler(async (req, res) => {
    const order = await cancelOrder(req.user._id, req.params.displayId)
    res.json({ success: true, data: { order } })
  }),
)

export default router
