import * as adminService from '../services/adminService.js'
import * as vendorService from '../services/vendorService.js'
import User from '../models/User.js'
import Shop, { SHOP_STATUS } from '../models/Shop.js'
import Order from '../models/Order.js'
import { USER_STATUS } from '../models/User.js'
import { ROLES } from '../constants/roles.js'

// GET /api/admin/platform-stats
export async function getPlatformStats(_req, res) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const [
    totalUsers,
    activeUsers,
    totalShops,
    activeShops,
    pendingShops,
    orderAgg,
    monthAgg,
    lastMonthAgg,
    // All monthly order aggregation (no date filter — all time)
    monthlyOrders,
    // Monthly user registrations (all time)
    monthlyUsers,
    // Monthly shop registrations (all time)
    monthlyShops,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: ROLES.ADMIN } }),
    User.countDocuments({ role: { $ne: ROLES.ADMIN }, status: USER_STATUS.ACTIVE }),
    Shop.countDocuments(),
    Shop.countDocuments({ status: SHOP_STATUS.ACTIVE }),
    Shop.countDocuments({ status: SHOP_STATUS.PENDING }),
    Order.aggregate([
      { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
    ]),
    // ALL monthly order totals
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    // ALL monthly user registrations
    User.aggregate([
      { $match: { role: { $ne: ROLES.ADMIN } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          users: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    // ALL monthly shop registrations
    Shop.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          shops: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ])

  const totalRevenue = orderAgg[0]?.revenue || 0
  const totalOrders = orderAgg[0]?.count || 0
  const monthRevenue = monthAgg[0]?.revenue || 0
  const lastMonthRevenue = lastMonthAgg[0]?.revenue || 0
  const revenueGrowth = lastMonthRevenue > 0
    ? (((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
    : null

  // Build a unified month-key set spanning all data sources
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const orderMap = {}
  monthlyOrders.forEach((d) => {
    orderMap[`${d._id.year}-${d._id.month}`] = { revenue: d.revenue, orders: d.orders }
  })

  const userMap = {}
  monthlyUsers.forEach((d) => {
    userMap[`${d._id.year}-${d._id.month}`] = d.users
  })

  const shopMap = {}
  monthlyShops.forEach((d) => {
    shopMap[`${d._id.year}-${d._id.month}`] = d.shops
  })

  // Collect ALL unique year-month keys across all three datasets, sorted
  const allKeys = new Set([
    ...monthlyOrders.map((d) => `${d._id.year}-${d._id.month}`),
    ...monthlyUsers.map((d) => `${d._id.year}-${d._id.month}`),
    ...monthlyShops.map((d) => `${d._id.year}-${d._id.month}`),
  ])

  // If no data at all, generate last 6 months as empty baseline
  if (allKeys.size === 0) {
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      allKeys.add(`${d.getFullYear()}-${d.getMonth() + 1}`)
    }
  }

  const sortedKeys = [...allKeys].sort((a, b) => {
    const [ay, am] = a.split('-').map(Number)
    const [by, bm] = b.split('-').map(Number)
    return ay !== by ? ay - by : am - bm
  })

  const growthChart = sortedKeys.map((key) => {
    const [year, month] = key.split('-').map(Number)
    const label = `${MONTH_NAMES[month - 1]} ${year}`
    return {
      key,
      month: label,
      revenue: orderMap[key]?.revenue || 0,
      orders: orderMap[key]?.orders || 0,
      users: userMap[key] || 0,
      shops: shopMap[key] || 0,
    }
  })

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        activeUsers,
        totalShops,
        activeShops,
        pendingShops,
        totalRevenue,
        totalOrders,
        monthRevenue,
        revenueGrowth,
      },
      growthChart,
    },
  })
}


export async function createAdmin(req, res) {
  const admin = await adminService.createAdmin(req.body)

  res.status(201).json({
    success: true,
    message: 'Admin account created successfully.',
    data: { admin },
  })
}

export async function listAdmins(_req, res) {
  const admins = await adminService.listAdmins()

  res.json({
    success: true,
    data: { admins },
  })
}

export async function listUsers(req, res) {
  const result = await adminService.listUsers(req.query)

  res.json({
    success: true,
    data: result,
  })
}

export async function getUserStats(_req, res) {
  const stats = await adminService.getUserStats()

  res.json({
    success: true,
    data: { stats },
  })
}

export async function updateUserStatus(req, res) {
  const user = await adminService.updateUserStatus(req.params.id, req.body.status)

  res.json({
    success: true,
    message: 'User status updated successfully.',
    data: { user },
  })
}

export async function listVendors(req, res) {
  const result = await vendorService.listVendors(req.query)

  res.json({
    success: true,
    data: result,
  })
}

export async function getVendorStats(_req, res) {
  const stats = await vendorService.getVendorStats()

  res.json({
    success: true,
    data: { stats },
  })
}

export async function approveVendor(req, res) {
  const vendor = await vendorService.approveVendor(req.params.id)

  res.json({
    success: true,
    message: 'Vendor approved successfully.',
    data: { vendor },
  })
}

export async function rejectVendor(req, res) {
  const vendor = await vendorService.rejectVendor(req.params.id)

  res.json({
    success: true,
    message: 'Vendor rejected successfully.',
    data: { vendor },
  })
}
