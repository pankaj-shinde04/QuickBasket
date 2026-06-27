import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  placeOrder,
  getCustomerOrders,
  getOrderByDisplayId,
  cancelOrder,
  getAllOrders,
  getOrderByDisplayIdForShopOwner,
  updateOrderStatus,
  getOrdersByStatus,
} from '../services/orderService.js'
import { placeOrderValidation, validateOrder } from '../validators/orderValidator.js'
import { ROLES } from '../constants/roles.js'

const router = express.Router()

// Customer routes
const customerRouter = express.Router()
customerRouter.use(authenticate)
customerRouter.use(authorize(ROLES.CUSTOMER))

// POST /api/orders — place a new order
customerRouter.post(
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
customerRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const orders = await getCustomerOrders(req.user._id)
    res.json({ success: true, data: { orders } })
  }),
)

// GET /api/orders/:displayId — get single order
customerRouter.get(
  '/:displayId',
  asyncHandler(async (req, res) => {
    const order = await getOrderByDisplayId(req.user._id, req.params.displayId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    res.json({ success: true, data: { order } })
  }),
)

// PATCH /api/orders/:displayId/cancel — cancel an order
customerRouter.patch(
  '/:displayId/cancel',
  asyncHandler(async (req, res) => {
    const order = await cancelOrder(req.user._id, req.params.displayId)
    res.json({ success: true, data: { order } })
  }),
)

// Shop Owner routes
const shopOwnerRouter = express.Router()
shopOwnerRouter.use(authenticate)
shopOwnerRouter.use(authorize(ROLES.SHOP_OWNER))

// GET /api/orders/shop-owner/all — get all orders for shop owner
shopOwnerRouter.get(
  '/shop-owner/all',
  asyncHandler(async (req, res) => {
    const orders = await getAllOrders()
    res.json({ success: true, data: { orders } })
  }),
)

// GET /api/orders/shop-owner/:displayId — get single order for shop owner
shopOwnerRouter.get(
  '/shop-owner/:displayId',
  asyncHandler(async (req, res) => {
    const order = await getOrderByDisplayIdForShopOwner(req.params.displayId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    res.json({ success: true, data: { order } })
  }),
)

// PATCH /api/orders/shop-owner/:displayId/status — update order status
shopOwnerRouter.patch(
  '/shop-owner/:displayId/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body
    if (!status) return res.status(400).json({ success: false, message: 'Status is required.' })
    const order = await updateOrderStatus(req.params.displayId, status)
    res.json({ success: true, data: { order } })
  }),
)

// GET /api/orders/shop-owner/status/:status — get orders by status
shopOwnerRouter.get(
  '/shop-owner/status/:status',
  asyncHandler(async (req, res) => {
    const orders = await getOrdersByStatus(req.params.status)
    res.json({ success: true, data: { orders } })
  }),
)

// Mount shop owner routes first (more specific paths)
router.use('/', shopOwnerRouter)
// Mount customer routes (less specific paths)
router.use('/', customerRouter)

export default router
