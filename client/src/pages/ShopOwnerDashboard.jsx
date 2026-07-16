import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineBanknotes,
  HiOutlineShoppingBag,
  HiOutlineCalendarDays,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineCube,
  HiOutlineExclamationTriangle,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineXCircle,
  HiOutlineArchiveBox,
} from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { apiRequest, getAuthToken } from '../services/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtCurrency(n) {
  const v = Number(n || 0)
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`
  return `₹${v.toFixed(0)}`
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop'

const STATUS_STYLES = {
  Pending:    'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped:    'bg-indigo-100 text-indigo-800',
  Delivered:  'bg-green-100 text-green-800',
  Cancelled:  'bg-red-100 text-red-800',
}

const STATUS_ICONS = {
  Pending:    HiOutlineClock,
  Processing: HiOutlineArrowPath,
  Shipped:    HiOutlineTruck,
  Delivered:  HiOutlineCheckCircle,
  Cancelled:  HiOutlineXCircle,
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, growth, icon: Icon, accent, highlight }) {
  const isPositive = growth !== null && growth !== undefined && Number(growth) >= 0
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${
        highlight
          ? 'border-primary bg-gradient-to-br from-primary to-primary-dark text-white'
          : 'border-neutral-border bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold uppercase tracking-wider ${highlight ? 'text-white/70' : 'text-text-muted'}`}>
            {label}
          </p>
          <p className={`mt-2 text-2xl font-extrabold sm:text-3xl ${highlight ? 'text-white' : 'text-text-dark'}`}>
            {value}
          </p>
          {sub && (
            <p className={`mt-1 text-xs ${highlight ? 'text-white/60' : 'text-text-muted'}`}>{sub}</p>
          )}
          {growth !== null && growth !== undefined && (
            <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
              highlight
                ? 'bg-white/20 text-white'
                : isPositive
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
            }`}>
              {isPositive
                ? <HiOutlineArrowTrendingUp className="h-3 w-3" />
                : <HiOutlineArrowTrendingDown className="h-3 w-3" />}
              {Math.abs(Number(growth))}% vs last month
            </div>
          )}
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          highlight ? 'bg-white/20' : accent || 'bg-primary-light'
        }`}>
          <Icon className={`h-5 w-5 ${highlight ? 'text-white' : 'text-primary'}`} />
        </span>
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-lg bg-neutral ${className}`} />
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function ShopOwnerDashboard() {
  const { user } = useAuth()

  const [analytics, setAnalytics] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState(null)

  const token = getAuthToken()

  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true)
    try {
      const res = await apiRequest('/orders/shop-owner/analytics', { method: 'GET', token })
      setAnalytics(res.data)
    } catch (err) {
      setError(err.message || 'Failed to load analytics.')
    } finally {
      setLoadingAnalytics(false)
    }
  }, [token])

  const fetchRecentOrders = useCallback(async () => {
    setLoadingOrders(true)
    try {
      const res = await apiRequest('/orders/shop-owner/all', { method: 'GET', token })
      // Show only the 5 most recent
      setRecentOrders((res.data.orders || []).slice(0, 5))
    } catch {
      setRecentOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }, [token])

  useEffect(() => {
    fetchAnalytics()
    fetchRecentOrders()
  }, [fetchAnalytics, fetchRecentOrders])

  const kpis = analytics?.kpis || {}
  const inventoryAlerts = analytics?.inventoryAlerts || []

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      {/* Pending approval banner */}
      {user?.status === 'pending' && (
        <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          Your shop profile is complete. Your account is still <strong>pending admin approval</strong>.
          You will receive an email once an admin reviews your application.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-dark sm:text-3xl">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-text-muted">
            Welcome back. Here&apos;s what&apos;s happening in your store.
          </p>
        </div>
        <Link
          to="/dashboard/shop-owner/analytics"
          className="flex items-center gap-2 rounded-xl border border-primary bg-primary-light px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
        >
          <HiOutlineArrowTrendingUp className="h-4 w-4" />
          Full Analytics
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loadingAnalytics ? (
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
              <Skeleton className="mb-3 h-4 w-24" />
              <Skeleton className="mb-2 h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))
        ) : (
          <>
            <KpiCard
              label="Total Revenue"
              value={fmtCurrency(kpis.totalRevenue)}
              sub={`${kpis.totalOrders ?? 0} orders total`}
              growth={null}
              icon={HiOutlineBanknotes}
              highlight
            />
            <KpiCard
              label="This Month"
              value={fmtCurrency(kpis.monthRevenue)}
              sub={`${kpis.monthOrders ?? 0} orders`}
              growth={kpis.revenueGrowth}
              icon={HiOutlineCalendarDays}
              accent="bg-tertiary-light"
            />
            <KpiCard
              label="Today's Revenue"
              value={fmtCurrency(kpis.todayRevenue)}
              sub={`${kpis.todayOrderCount ?? 0} orders today`}
              growth={null}
              icon={HiOutlineShoppingBag}
              accent="bg-yellow-100"
            />
            <KpiCard
              label="Avg Order Value"
              value={`₹${Number(kpis.avgOrderValue || 0).toFixed(0)}`}
              sub="per order (all time)"
              growth={kpis.ordersGrowth}
              icon={HiOutlineCube}
              accent="bg-purple-100"
            />
          </>
        )}
      </div>

      {/* Bottom grid: Recent Orders + Inventory Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Recent Orders ─────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-border px-5 py-4">
            <h2 className="font-bold text-text-dark">Recent Orders</h2>
            <Link
              to="/dashboard/shop-owner/orders"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              View All
            </Link>
          </div>

          {loadingOrders ? (
            <div className="space-y-4 p-5">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32 flex-1" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <HiOutlineArchiveBox className="h-12 w-12 text-neutral-border" />
              <p className="mt-3 text-sm font-medium text-text-muted">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-neutral-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const StatusIcon = STATUS_ICONS[order.status] || HiOutlineClock
                    return (
                      <tr key={order._id || order.displayId} className="border-b border-neutral-border last:border-0 hover:bg-neutral/40 transition-colors">
                        <td className="px-5 py-3.5">
                          <Link
                            to={`/dashboard/shop-owner/orders/${order.displayId}`}
                            className="font-semibold text-primary hover:text-primary-dark"
                          >
                            #{order.displayId}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-text-muted">
                          {order.deliveryAddress?.fullName || 'Customer'}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-neutral text-text-muted'}`}>
                            <StatusIcon className="h-3 w-3" />
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-text-dark">
                          ₹{Number(order.total || 0).toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Inventory Alerts ──────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-border px-5 py-4">
            <h2 className="font-bold text-text-dark">Inventory Alerts</h2>
            {!loadingAnalytics && inventoryAlerts.length > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {inventoryAlerts.length}
              </span>
            )}
          </div>

          {loadingAnalytics ? (
            <div className="space-y-4 p-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : inventoryAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <HiOutlineCheckCircle className="h-12 w-12 text-tertiary" />
              <p className="mt-3 text-sm font-medium text-text-muted">All stock levels OK</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-border">
              {inventoryAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 p-4">
                  <img
                    src={alert.image || PLACEHOLDER}
                    alt={alert.name}
                    onError={(e) => { e.target.src = PLACEHOLDER }}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-dark">{alert.name}</p>
                    <p className={`flex items-center gap-1 text-xs font-medium ${
                      alert.alertType === 'Out of Stock' ? 'text-red-500' : 'text-orange-500'
                    }`}>
                      <HiOutlineExclamationTriangle className="h-3 w-3" />
                      {alert.alertType}
                      {alert.stock > 0 && ` — ${alert.stock} left`}
                    </p>
                  </div>
                  <Link
                    to="/dashboard/shop-owner/inventory"
                    className="shrink-0 rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light transition-colors"
                  >
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Status Overview */}
      {!loadingAnalytics && analytics?.statusBreakdown && Object.keys(analytics.statusBreakdown).length > 0 && (
        <div className="mt-6 rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-bold text-text-dark">Order Status Overview</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => {
              const count = analytics.statusBreakdown[status] || 0
              const Icon = STATUS_ICONS[status] || HiOutlineClock
              const style = STATUS_STYLES[status] || 'bg-neutral text-text-muted'
              return (
                <div key={status} className={`flex flex-col items-center gap-1 rounded-xl p-3 text-center ${style}`}>
                  <Icon className="h-5 w-5" />
                  <span className="text-2xl font-bold">{count}</span>
                  <span className="text-xs font-semibold">{status}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
