import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Shop from '../models/Shop.js'
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

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: All named/static routes MUST be registered before wildcard routes
// like /:displayId — otherwise Express matches the wildcard first and the named
// routes become unreachable.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Customer: POST /api/orders ───────────────────────────────────────────────
router.post(
  '/',
  authenticate,
  authorize(ROLES.CUSTOMER),
  placeOrderValidation,
  validateOrder,
  asyncHandler(async (req, res) => {
    const order = await placeOrder(req.user._id, req.body)
    res.status(201).json({ success: true, data: { order } })
  }),
)

// ─── Customer: GET /api/orders ────────────────────────────────────────────────
router.get(
  '/',
  authenticate,
  authorize(ROLES.CUSTOMER),
  asyncHandler(async (req, res) => {
    const orders = await getCustomerOrders(req.user._id)
    res.json({ success: true, data: { orders } })
  }),
)

// ─── Shop Owner: GET /api/orders/shop-owner/analytics ─────────────────────────
// !! Must be BEFORE /:displayId wildcard !!
router.get(
  '/shop-owner/analytics',
  authenticate,
  authorize(ROLES.SHOP_OWNER),
  asyncHandler(async (req, res) => {
    const shop = await Shop.findOne({ owner: req.user._id })
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' })

    const shopId = shop._id
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)

    const [
      allOrders,
      todayOrders,
      thisMonthOrders,
      lastMonthOrders,
      statusBreakdown,
      dailyRevenue,
      topProducts,
      inventoryAlerts,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { shop: shopId } },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { shop: shopId, createdAt: { $gte: startOfToday }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { shop: shopId, createdAt: { $gte: startOfThisMonth }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        {
          $match: {
            shop: shopId,
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
            status: { $ne: 'Cancelled' },
          },
        },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { shop: shopId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { shop: shopId, createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'Cancelled' } } },
        {
          $group: {
            _id: {
              y: { $year: '$createdAt' },
              m: { $month: '$createdAt' },
              d: { $dayOfMonth: '$createdAt' },
            },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
      ]),
      Order.aggregate([
        { $match: { shop: shopId, status: { $ne: 'Cancelled' } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            name: { $first: '$items.name' },
            image: { $first: '$items.image' },
            category: { $first: '$items.category' },
            totalQty: { $sum: '$items.qty' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
          },
        },
        { $sort: { totalQty: -1 } },
        { $limit: 5 },
      ]),
      Product.find({
        shop: shopId,
        $or: [{ stock: 0 }, { $expr: { $lte: ['$stock', '$lowStockThreshold'] } }],
        isActive: true,
      })
        .select('name stock lowStockThreshold image category')
        .limit(10)
        .lean(),
    ])

    const totalRevenue = allOrders[0]?.revenue || 0
    const totalOrders = allOrders[0]?.count || 0
    const todayRevenue = todayOrders[0]?.revenue || 0
    const todayOrderCount = todayOrders[0]?.count || 0
    const monthRevenue = thisMonthOrders[0]?.revenue || 0
    const monthOrders = thisMonthOrders[0]?.count || 0
    const lastMonthRevenue = lastMonthOrders[0]?.revenue || 0
    const lastMonthOrderCount = lastMonthOrders[0]?.count || 0

    const revenueGrowth =
      lastMonthRevenue > 0
        ? (((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
        : null
    const ordersGrowth =
      lastMonthOrderCount > 0
        ? (((monthOrders - lastMonthOrderCount) / lastMonthOrderCount) * 100).toFixed(1)
        : null

    const statusMap = {}
    statusBreakdown.forEach((s) => { statusMap[s._id] = s.count })

    const dailyMap = {}
    dailyRevenue.forEach((d) => {
      const key = `${d._id.y}-${String(d._id.m).padStart(2, '0')}-${String(d._id.d).padStart(2, '0')}`
      dailyMap[key] = { revenue: d.revenue, orders: d.orders }
    })

    const dailyChart = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      dailyChart.push({
        date: key,
        label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        revenue: dailyMap[key]?.revenue || 0,
        orders: dailyMap[key]?.orders || 0,
      })
    }

    res.json({
      success: true,
      data: {
        kpis: {
          totalRevenue,
          totalOrders,
          todayRevenue,
          todayOrderCount,
          monthRevenue,
          monthOrders,
          revenueGrowth,
          ordersGrowth,
          avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00',
        },
        statusBreakdown: statusMap,
        dailyChart,
        topProducts,
        inventoryAlerts: inventoryAlerts.map((p) => ({
          id: p._id.toString(),
          name: p.name,
          stock: p.stock,
          lowStockThreshold: p.lowStockThreshold,
          image: p.image,
          category: p.category,
          alertType: p.stock === 0 ? 'Out of Stock' : 'Low Stock',
        })),
      },
    })
  }),
)

// ─── Shop Owner: GET /api/orders/shop-owner/all ───────────────────────────────
router.get(
  '/shop-owner/all',
  authenticate,
  authorize(ROLES.SHOP_OWNER),
  asyncHandler(async (req, res) => {
    const shop = await Shop.findOne({ owner: req.user._id })
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' })
    const orders = await getAllOrders(shop._id)
    res.json({ success: true, data: { orders } })
  }),
)

// ─── Shop Owner: GET /api/orders/shop-owner/status/:status ────────────────────
router.get(
  '/shop-owner/status/:status',
  authenticate,
  authorize(ROLES.SHOP_OWNER),
  asyncHandler(async (req, res) => {
    const shop = await Shop.findOne({ owner: req.user._id })
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' })
    const orders = await getOrdersByStatus(req.params.status, shop._id)
    res.json({ success: true, data: { orders } })
  }),
)

// ─── Shop Owner: GET /api/orders/shop-owner/:displayId ────────────────────────
router.get(
  '/shop-owner/:displayId',
  authenticate,
  authorize(ROLES.SHOP_OWNER),
  asyncHandler(async (req, res) => {
    const shop = await Shop.findOne({ owner: req.user._id })
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' })
    const order = await getOrderByDisplayIdForShopOwner(req.params.displayId, shop._id)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    res.json({ success: true, data: { order } })
  }),
)

// ─── Shop Owner: PATCH /api/orders/shop-owner/:displayId/status ───────────────
router.patch(
  '/shop-owner/:displayId/status',
  authenticate,
  authorize(ROLES.SHOP_OWNER),
  asyncHandler(async (req, res) => {
    const { status } = req.body
    if (!status) return res.status(400).json({ success: false, message: 'Status is required.' })
    const shop = await Shop.findOne({ owner: req.user._id })
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' })
    const order = await updateOrderStatus(req.params.displayId, status, shop._id)
    res.json({ success: true, data: { order } })
  }),
)

// ─── Customer: GET /api/orders/:displayId ─────────────────────────────────────
// !! MUST be last — wildcard /:displayId matches anything !!
router.get(
  '/:displayId',
  authenticate,
  authorize(ROLES.CUSTOMER),
  asyncHandler(async (req, res) => {
    const order = await getOrderByDisplayId(req.user._id, req.params.displayId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    res.json({ success: true, data: { order } })
  }),
)

// ─── Customer: PATCH /api/orders/:displayId/cancel ────────────────────────────
router.patch(
  '/:displayId/cancel',
  authenticate,
  authorize(ROLES.CUSTOMER),
  asyncHandler(async (req, res) => {
    const order = await cancelOrder(req.user._id, req.params.displayId)
    res.json({ success: true, data: { order } })
  }),
)

export default router
