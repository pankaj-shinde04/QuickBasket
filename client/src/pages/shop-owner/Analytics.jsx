import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineBanknotes,
  HiOutlineShoppingBag,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowPath,
  HiOutlineCalendarDays,
  HiOutlineCube,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineFire,
  HiOutlineArchiveBox,
} from 'react-icons/hi2'
import ShopOwnerTopBar from '../../components/shop-owner/ShopOwnerTopBar'
import { apiRequest, getAuthToken } from '../../services/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
  return Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function fmtShort(n) {
  const v = Number(n || 0)
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`
  return `₹${v.toFixed(0)}`
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

// ─── Revenue Bar Chart (pure CSS, no library) ─────────────────────────────────
function RevenueChart({ data, mode }) {
  const values = data.map((d) => (mode === 'revenue' ? d.revenue : d.orders))
  const maxVal = Math.max(...values, 1)
  // Show last 14 days on mobile, all 30 on desktop
  const visible = data.slice(-14)
  const visibleAll = data

  return (
    <div>
      {/* Desktop: all 30 days */}
      <div className="hidden md:flex h-52 items-end gap-1">
        {visibleAll.map((d, i) => {
          const val = mode === 'revenue' ? d.revenue : d.orders
          const pct = maxVal > 0 ? (val / maxVal) * 100 : 0
          return (
            <div key={d.date} className="group relative flex flex-1 flex-col items-center gap-1">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden rounded-lg border border-neutral-border bg-white px-2 py-1 text-center text-xs shadow-lg group-hover:block z-10 whitespace-nowrap">
                <p className="font-bold text-text-dark">
                  {mode === 'revenue' ? `₹${fmt(val)}` : `${val} orders`}
                </p>
                <p className="text-text-muted">{d.label}</p>
              </div>
              <div
                className="w-full rounded-t-sm transition-all duration-500 cursor-pointer"
                style={{
                  height: `${Math.max(pct, 2)}%`,
                  background: val > 0
                    ? 'linear-gradient(to top, #4f46e5, #818cf8)'
                    : '#e5e7eb',
                }}
              />
            </div>
          )
        })}
      </div>
      {/* Mobile: last 14 days */}
      <div className="flex md:hidden h-40 items-end gap-1">
        {visible.map((d) => {
          const val = mode === 'revenue' ? d.revenue : d.orders
          const pct = maxVal > 0 ? (val / maxVal) * 100 : 0
          return (
            <div key={d.date} className="flex flex-1 flex-col items-center">
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: `${Math.max(pct, 2)}%`,
                  background: val > 0 ? 'linear-gradient(to top, #4f46e5, #818cf8)' : '#e5e7eb',
                }}
              />
            </div>
          )
        })}
      </div>
      {/* X axis labels — show every 5th on desktop */}
      <div className="hidden md:flex mt-2 justify-between text-[10px] text-text-muted">
        {visibleAll.filter((_, i) => i % 5 === 0 || i === visibleAll.length - 1).map((d) => (
          <span key={d.date}>{d.label}</span>
        ))}
      </div>
      <div className="flex md:hidden mt-2 justify-between text-[10px] text-text-muted">
        <span>{visible[0]?.label}</span>
        <span>{visible[visible.length - 1]?.label}</span>
      </div>
    </div>
  )
}

// ─── Status Donut (pure CSS) ──────────────────────────────────────────────────
const STATUS_COLORS = {
  Pending: { bg: 'bg-yellow-400', text: 'text-yellow-700', light: 'bg-yellow-50' },
  Processing: { bg: 'bg-blue-400', text: 'text-blue-700', light: 'bg-blue-50' },
  Shipped: { bg: 'bg-purple-400', text: 'text-purple-700', light: 'bg-purple-50' },
  Delivered: { bg: 'bg-green-400', text: 'text-green-700', light: 'bg-green-50' },
  Cancelled: { bg: 'bg-red-400', text: 'text-red-600', light: 'bg-red-50' },
}
const STATUS_ICONS = {
  Pending: HiOutlineClock,
  Processing: HiOutlineArrowPath,
  Shipped: HiOutlineTruck,
  Delivered: HiOutlineCheckCircle,
  Cancelled: HiOutlineXCircle,
}

function StatusBreakdown({ breakdown, total }) {
  return (
    <div className="space-y-3">
      {Object.entries(STATUS_COLORS).map(([status, colors]) => {
        const count = breakdown[status] || 0
        const pct = total > 0 ? Math.round((count / total) * 100) : 0
        const Icon = STATUS_ICONS[status]
        return (
          <div key={status}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${colors.text}`} />
                <span className="font-medium text-text-dark">{status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-dark">{count}</span>
                <span className="text-xs text-text-muted">({pct}%)</span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral">
              <div
                className={`h-full rounded-full transition-all duration-700 ${colors.bg}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-6 px-5 pb-8 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-neutral" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-72 rounded-2xl bg-neutral lg:col-span-2" />
        <div className="h-72 rounded-2xl bg-neutral" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 rounded-2xl bg-neutral" />
        <div className="h-64 rounded-2xl bg-neutral" />
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShopOwnerAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chartMode, setChartMode] = useState('revenue') // 'revenue' | 'orders'
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getAuthToken()
      const res = await apiRequest('/orders/shop-owner/analytics', { token })
      setData(res.data)
      setLastRefresh(new Date())
    } catch (err) {
      setError(err.message || 'Failed to load analytics.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const totalOrders = data
    ? Object.values(data.statusBreakdown || {}).reduce((a, b) => a + b, 0)
    : 0

  return (
    <div>
      <ShopOwnerTopBar searchPlaceholder="Search analytics..." />

      <div className="px-5 pb-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-dark sm:text-3xl">Analytics & Reports</h1>
            <p className="mt-1 text-sm text-text-muted">
              Real-time performance data from your store
              {lastRefresh && (
                <span className="ml-2 text-xs text-text-muted/60">
                  · Updated {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-neutral-border bg-white px-4 py-2.5 text-sm font-semibold text-text-dark shadow-sm hover:bg-neutral disabled:opacity-60"
          >
            <HiOutlineArrowPath className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error} —{' '}
            <button onClick={fetchAnalytics} className="font-semibold underline">
              retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !data && <Skeleton />}

        {/* Content */}
        {data && (
          <>
            {/* ── KPI Cards ─────────────────────────────────────────────────── */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                label="Total Revenue"
                value={`₹${fmt(data.kpis.totalRevenue)}`}
                sub={`${data.kpis.totalOrders} orders all time`}
                icon={HiOutlineBanknotes}
                highlight
              />
              <KpiCard
                label="This Month"
                value={fmtShort(data.kpis.monthRevenue)}
                sub={`${data.kpis.monthOrders} orders`}
                growth={data.kpis.revenueGrowth}
                icon={HiOutlineCalendarDays}
                accent="bg-blue-50"
              />
              <KpiCard
                label="Today"
                value={fmtShort(data.kpis.todayRevenue)}
                sub={`${data.kpis.todayOrderCount} orders today`}
                icon={HiOutlineFire}
                accent="bg-orange-50"
              />
              <KpiCard
                label="Avg Order Value"
                value={`₹${fmt(data.kpis.avgOrderValue)}`}
                sub="Per completed order"
                growth={data.kpis.ordersGrowth}
                icon={HiOutlineShoppingBag}
                accent="bg-green-50"
              />
            </div>

            {/* ── Revenue Chart + Status Breakdown ──────────────────────────── */}
            <div className="mb-6 grid gap-6 lg:grid-cols-3">

              {/* Revenue / Orders Chart */}
              <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-text-dark">
                      {chartMode === 'revenue' ? 'Revenue' : 'Orders'} — Last 30 Days
                    </h2>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {chartMode === 'revenue'
                        ? `Total: ₹${fmt(data.dailyChart.reduce((s, d) => s + d.revenue, 0))}`
                        : `Total: ${data.dailyChart.reduce((s, d) => s + d.orders, 0)} orders`}
                    </p>
                  </div>
                  <div className="flex rounded-xl border border-neutral-border p-1">
                    {[
                      { key: 'revenue', label: 'Revenue', icon: HiOutlineBanknotes },
                      { key: 'orders', label: 'Orders', icon: HiOutlineShoppingBag },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setChartMode(key)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                          chartMode === key
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-muted hover:text-text-dark'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {data.dailyChart.length > 0 ? (
                  <RevenueChart data={data.dailyChart} mode={chartMode} />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-text-muted">
                    No data for the last 30 days yet.
                  </div>
                )}
              </div>

              {/* Status Breakdown */}
              <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-bold text-text-dark">Order Status</h2>
                  <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-bold text-primary">
                    {totalOrders} total
                  </span>
                </div>
                {totalOrders > 0 ? (
                  <StatusBreakdown breakdown={data.statusBreakdown} total={totalOrders} />
                ) : (
                  <div className="flex h-32 items-center justify-center text-sm text-text-muted">
                    No orders yet.
                  </div>
                )}
              </div>
            </div>

            {/* ── Top Products + Inventory Alerts ───────────────────────────── */}
            <div className="grid gap-6 md:grid-cols-2">

              {/* Top 5 Products */}
              <div className="rounded-2xl border border-neutral-border bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-neutral-border px-5 py-4">
                  <HiOutlineFire className="h-5 w-5 text-orange-500" />
                  <h2 className="font-bold text-text-dark">Top Selling Products</h2>
                </div>
                {data.topProducts.length > 0 ? (
                  <div className="divide-y divide-neutral-border">
                    {data.topProducts.map((p, i) => (
                      <div key={p._id || i} className="flex items-center gap-4 px-5 py-3.5">
                        {/* Rank */}
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                          i === 0 ? 'bg-yellow-100 text-yellow-700'
                            : i === 1 ? 'bg-gray-100 text-gray-600'
                            : i === 2 ? 'bg-orange-100 text-orange-600'
                            : 'bg-neutral text-text-muted'
                        }`}>
                          {i + 1}
                        </span>
                        {/* Image */}
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral text-lg">
                            📦
                          </div>
                        )}
                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text-dark">{p.name}</p>
                          <p className="text-xs text-text-muted">{p.category}</p>
                        </div>
                        {/* Stats */}
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-text-dark">{p.totalQty} sold</p>
                          <p className="text-xs text-primary font-semibold">₹{fmt(p.totalRevenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center gap-2 text-sm text-text-muted">
                    <HiOutlineChartBar className="h-5 w-5" />
                    No sales data yet.
                  </div>
                )}
                <div className="border-t border-neutral-border px-5 py-3">
                  <Link
                    to="/dashboard/shop-owner/inventory"
                    className="text-xs font-semibold text-primary hover:text-primary-dark"
                  >
                    Manage inventory →
                  </Link>
                </div>
              </div>

              {/* Inventory Alerts */}
              <div className="rounded-2xl border border-neutral-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-border px-5 py-4">
                  <div className="flex items-center gap-2">
                    <HiOutlineExclamationTriangle className="h-5 w-5 text-orange-500" />
                    <h2 className="font-bold text-text-dark">Inventory Alerts</h2>
                  </div>
                  {data.inventoryAlerts.length > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {data.inventoryAlerts.length}
                    </span>
                  )}
                </div>
                {data.inventoryAlerts.length > 0 ? (
                  <div className="divide-y divide-neutral-border">
                    {data.inventoryAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center gap-3 px-5 py-3.5">
                        {alert.image ? (
                          <img
                            src={alert.image}
                            alt={alert.name}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral">
                            <HiOutlineArchiveBox className="h-5 w-5 text-text-muted" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text-dark">{alert.name}</p>
                          <p className={`text-xs font-medium ${
                            alert.alertType === 'Out of Stock' ? 'text-red-500' : 'text-orange-500'
                          }`}>
                            {alert.alertType === 'Out of Stock'
                              ? '⚠ Out of stock'
                              : `⚠ Low stock — ${alert.stock} left`}
                          </p>
                        </div>
                        <Link
                          to="/dashboard/shop-owner/inventory"
                          className="shrink-0 rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light"
                        >
                          Restock
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-text-muted">
                    <HiOutlineCheckCircle className="h-8 w-8 text-green-400" />
                    <p>All products are well-stocked!</p>
                  </div>
                )}
                <div className="border-t border-neutral-border px-5 py-3">
                  <Link
                    to="/dashboard/shop-owner/inventory"
                    className="text-xs font-semibold text-primary hover:text-primary-dark"
                  >
                    View all inventory →
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Quick Stats Row ────────────────────────────────────────────── */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Pending Orders',
                  value: data.statusBreakdown['Pending'] || 0,
                  icon: HiOutlineClock,
                  color: 'text-yellow-600',
                  bg: 'bg-yellow-50',
                  link: '/dashboard/shop-owner/orders',
                },
                {
                  label: 'Being Processed',
                  value: data.statusBreakdown['Processing'] || 0,
                  icon: HiOutlineArrowPath,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                  link: '/dashboard/shop-owner/orders',
                },
                {
                  label: 'Delivered',
                  value: data.statusBreakdown['Delivered'] || 0,
                  icon: HiOutlineCheckCircle,
                  color: 'text-green-600',
                  bg: 'bg-green-50',
                  link: '/dashboard/shop-owner/orders',
                },
              ].map((stat) => (
                <Link
                  key={stat.label}
                  to={stat.link}
                  className="flex items-center gap-4 rounded-2xl border border-neutral-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </span>
                  <div>
                    <p className="text-2xl font-extrabold text-text-dark">{stat.value}</p>
                    <p className="text-sm text-text-muted">{stat.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
