import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlineShoppingBag,
  HiOutlineBanknotes,
  HiOutlineArrowPath,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineCalendarDays,
  HiOutlineCube,
} from 'react-icons/hi2'
import AdminTopBar from '../../components/admin/AdminTopBar'
import { apiRequest, getAuthToken } from '../../services/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtCurrency(n) {
  const v = Number(n || 0)
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`
  if (v >= 100000)   return `₹${(v / 100000).toFixed(1)}L`
  if (v >= 1000)     return `₹${(v / 1000).toFixed(1)}K`
  return `₹${v.toFixed(0)}`
}

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-lg bg-neutral ${className}`} />
}

// ─── Chart Modes ──────────────────────────────────────────────────────────────
const MODES = [
  { key: 'revenue', label: 'Revenue',  icon: HiOutlineBanknotes,         color: '#4f46e5', gradient: ['#4f46e5', '#818cf8'], fmt: fmtCurrency },
  { key: 'orders',  label: 'Orders',   icon: HiOutlineShoppingBag,        color: '#0ea5e9', gradient: ['#0ea5e9', '#7dd3fc'], fmt: (v) => `${v} orders` },
  { key: 'users',   label: 'Users',    icon: HiOutlineUsers,              color: '#10b981', gradient: ['#10b981', '#6ee7b7'], fmt: (v) => `${v} users` },
  { key: 'shops',   label: 'Shops',    icon: HiOutlineBuildingStorefront, color: '#f59e0b', gradient: ['#f59e0b', '#fcd34d'], fmt: (v) => `${v} shops` },
]

// ─── Bar Chart (scrollable, all months) ───────────────────────────────────────
function AllMonthsBarChart({ data, mode }) {
  const scrollRef = useRef(null)
  const modeConfig = MODES.find((m) => m.key === mode) || MODES[0]
  const values = data.map((d) => d[mode] || 0)
  const maxVal = Math.max(...values, 1)
  // Each bar is at least 36px wide; minimum chart width fills the container
  const BAR_WIDTH = Math.max(36, 600 / Math.max(data.length, 1))

  // Scroll to the right (most recent) on load
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [data])

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-text-muted">
        No data available yet
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="overflow-x-auto pb-2">
      <div
        className="flex items-end gap-1.5"
        style={{ minWidth: `${data.length * (BAR_WIDTH + 6)}px`, height: '220px' }}
      >
        {data.map((item) => {
          const val = item[mode] || 0
          const pct = maxVal > 0 ? (val / maxVal) * 100 : 0
          return (
            <div
              key={item.key}
              className="group relative flex flex-shrink-0 flex-col items-center"
              style={{ width: `${BAR_WIDTH}px` }}
            >
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full mb-2 hidden w-max max-w-[140px] rounded-xl border border-neutral-border bg-white px-3 py-2 text-center text-xs shadow-xl group-hover:block z-20">
                <p className="font-bold text-text-dark">{modeConfig.fmt(val)}</p>
                <p className="mt-0.5 text-text-muted">{item.month}</p>
              </div>

              {/* Bar */}
              <div className="flex w-full items-end" style={{ height: '180px' }}>
                <div
                  className="w-full cursor-pointer rounded-t-md transition-all duration-500 hover:opacity-80"
                  style={{
                    height: `${Math.max(pct, val > 0 ? 3 : 0)}%`,
                    background: val > 0
                      ? `linear-gradient(to top, ${modeConfig.gradient[0]}, ${modeConfig.gradient[1]})`
                      : '#e5e7eb',
                    minHeight: val > 0 ? '6px' : '0px',
                  }}
                />
              </div>

              {/* Label */}
              <span
                className="mt-1.5 w-full truncate text-center text-[10px] font-medium text-text-muted"
                title={item.month}
              >
                {item.month}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, growth, icon: Icon, highlight, loading }) {
  const isPos = Number(growth) >= 0
  return (
    <div className={`rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 ${
      highlight ? 'border-primary bg-gradient-to-br from-primary to-primary-dark text-white' : 'border-neutral-border bg-white'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold uppercase tracking-wider ${highlight ? 'text-white/70' : 'text-text-muted'}`}>
            {label}
          </p>
          {loading
            ? <Skeleton className="mt-2 h-8 w-28" />
            : <p className={`mt-2 text-2xl font-extrabold sm:text-3xl ${highlight ? 'text-white' : 'text-text-dark'}`}>{value}</p>
          }
          {!loading && sub && (
            <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${
              growth !== null && growth !== undefined
                ? highlight ? 'text-white/80' : isPos ? 'text-green-600' : 'text-red-500'
                : highlight ? 'text-white/70' : 'text-text-muted'
            }`}>
              {growth !== null && growth !== undefined && (
                isPos
                  ? <HiOutlineArrowTrendingUp className="h-3 w-3" />
                  : <HiOutlineArrowTrendingDown className="h-3 w-3" />
              )}
              {sub}
            </p>
          )}
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          highlight ? 'bg-white/20' : 'bg-primary-light'
        }`}>
          <Icon className={`h-5 w-5 ${highlight ? 'text-white' : 'text-primary'}`} />
        </span>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminAnalytics() {
  const [stats, setStats]           = useState(null)
  const [growthChart, setGrowthChart] = useState([])
  const [loading, setLoading]       = useState(true)
  const [chartMode, setChartMode]   = useState('revenue')
  const token = getAuthToken()

  const loadStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiRequest('/admin/platform-stats', { method: 'GET', token })
      setStats(res.data.stats)
      setGrowthChart(res.data.growthChart || [])
    } catch {
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { loadStats() }, [loadStats])

  const s = stats || {}

  // Totals for the selected mode (summed across all months)
  const modeTotals = {
    revenue: s.totalRevenue,
    orders:  s.totalOrders,
    users:   s.totalUsers,
    shops:   s.totalShops,
  }

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: fmtCurrency(s.totalRevenue),
      sub: s.revenueGrowth != null
        ? `${Number(s.revenueGrowth) >= 0 ? '+' : ''}${s.revenueGrowth}% vs last month`
        : `${(s.totalOrders ?? 0).toLocaleString()} orders`,
      growth: s.revenueGrowth ?? null,
      icon: HiOutlineBanknotes,
      highlight: true,
    },
    {
      label: 'Total Users',
      value: (s.totalUsers ?? 0).toLocaleString(),
      sub: `${(s.activeUsers ?? 0).toLocaleString()} active`,
      growth: null,
      icon: HiOutlineUsers,
      highlight: false,
    },
    {
      label: 'Total Shops',
      value: (s.totalShops ?? 0).toLocaleString(),
      sub: `${(s.activeShops ?? 0).toLocaleString()} active · ${(s.pendingShops ?? 0).toLocaleString()} pending`,
      growth: null,
      icon: HiOutlineBuildingStorefront,
      highlight: false,
    },
    {
      label: 'Total Orders',
      value: (s.totalOrders ?? 0).toLocaleString(),
      sub: 'all time',
      growth: null,
      icon: HiOutlineShoppingBag,
      highlight: false,
    },
    {
      label: 'This Month',
      value: fmtCurrency(s.monthRevenue),
      sub: 'current month revenue',
      growth: null,
      icon: HiOutlineCalendarDays,
      highlight: false,
    },
  ]

  const currentMode = MODES.find((m) => m.key === chartMode)

  return (
    <div>
      <AdminTopBar
        title="Platform Analytics"
        subtitle="Real-time performance metrics across all months."
        searchPlaceholder="Search analytics..."
      />

      <div className="p-4 sm:p-6 lg:p-8">

        {/* ── KPI Cards ─────────────────────────────────────────────── */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kpiCards.map((card) => (
            <KpiCard key={card.label} {...card} loading={loading} />
          ))}
        </div>

        {/* ── Chart Section ──────────────────────────────────────────── */}
        <div className="mt-6 rounded-2xl border border-neutral-border bg-white shadow-sm">
          {/* Chart header */}
          <div className="flex flex-col gap-3 border-b border-neutral-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-bold text-text-dark">Monthly Growth</h2>
              <p className="mt-0.5 text-xs text-text-muted">
                {loading ? '—' : `${growthChart.length} month${growthChart.length !== 1 ? 's' : ''} of data · scroll to view all`}
              </p>
            </div>

            {/* Mode tabs */}
            <div className="flex flex-wrap gap-1.5">
              {MODES.map((m) => {
                const Icon = m.icon
                const active = chartMode === m.key
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setChartMode(m.key)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? 'text-white shadow-sm'
                        : 'bg-neutral text-text-muted hover:text-text-dark'
                    }`}
                    style={active ? { background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})` } : {}}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chart body */}
          <div className="p-4 sm:p-5">
            {/* Summary row for current mode */}
            {!loading && (
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${currentMode.gradient[0]}, ${currentMode.gradient[1]})` }}
                >
                  <currentMode.icon className="h-4 w-4 text-white" />
                </span>
                <div>
                  <p className="text-sm text-text-muted">{currentMode.label} — all time total</p>
                  <p className="text-xl font-extrabold text-text-dark">
                    {currentMode.fmt(modeTotals[chartMode] ?? 0)}
                  </p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex h-56 items-center justify-center">
                <HiOutlineArrowPath className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <AllMonthsBarChart data={growthChart} mode={chartMode} />
            )}
          </div>
        </div>

        {/* ── Bottom Grid: Breakdown + Summary Banner ────────────────── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Per-metric summary table */}
          <div className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm">
            <div className="border-b border-neutral-border px-5 py-4">
              <h2 className="font-bold text-text-dark">Platform Breakdown</h2>
            </div>
            <div className="divide-y divide-neutral-border">
              {[
                { label: 'Total Users',      value: s.totalUsers,   sub: `${s.activeUsers ?? 0} active`,                         dot: 'bg-green-400'  },
                { label: 'Active Shops',     value: s.activeShops,  sub: `${s.pendingShops ?? 0} pending approval`,              dot: 'bg-tertiary'   },
                { label: 'Total Orders',     value: s.totalOrders,  sub: 'all time',                                             dot: 'bg-blue-400'   },
                { label: 'Total Revenue',    value: null,           sub: fmtCurrency(s.totalRevenue),                            dot: 'bg-primary'    },
                { label: 'This Month Rev.',  value: null,           sub: fmtCurrency(s.monthRevenue),                            dot: 'bg-indigo-300' },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 px-5 py-3">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${row.dot}`} />
                  <p className="flex-1 text-sm font-medium text-text-dark">{row.label}</p>
                  {loading
                    ? <Skeleton className="h-4 w-14" />
                    : <span className="text-sm font-bold text-text-dark">
                        {row.value !== null && row.value !== undefined
                          ? (row.value).toLocaleString()
                          : row.sub
                        }
                      </span>
                  }
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-border p-4 text-center">
              <Link to="/dashboard/admin/vendors" className="text-sm font-semibold text-primary hover:text-primary-dark">
                Manage Vendors →
              </Link>
            </div>
          </div>

          {/* Summary banner */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-sm lg:col-span-2">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-48 bg-white/20" />
                <Skeleton className="h-10 w-64 bg-white/20" />
                <Skeleton className="h-4 w-full bg-white/20" />
              </div>
            ) : (
              <>
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  Platform Summary
                </span>
                <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                  {fmtCurrency(s.totalRevenue)}
                  <span className="ml-2 text-base font-medium text-white/70">total revenue</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {(s.totalOrders ?? 0).toLocaleString()} orders processed across{' '}
                  {(s.activeShops ?? 0).toLocaleString()} active shops and{' '}
                  {(s.totalUsers ?? 0).toLocaleString()} registered users.
                  {s.revenueGrowth != null && (
                    <> Month-over-month revenue{' '}
                      {Number(s.revenueGrowth) >= 0
                        ? <strong className="text-secondary">grew {s.revenueGrowth}%</strong>
                        : <strong className="text-red-300">declined {Math.abs(s.revenueGrowth)}%</strong>
                      }.
                    </>
                  )}
                </p>

                {/* Mini stat row */}
                <div className="mt-6 flex flex-wrap gap-6">
                  {[
                    { label: 'Users',    value: (s.totalUsers  ?? 0).toLocaleString() },
                    { label: 'Shops',    value: (s.totalShops  ?? 0).toLocaleString() },
                    { label: 'Orders',   value: (s.totalOrders ?? 0).toLocaleString() },
                    { label: 'Pending',  value: (s.pendingShops ?? 0).toLocaleString() },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-2xl font-extrabold">{item.value}</p>
                      <p className="text-xs text-white/70">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    to="/dashboard/admin/users"
                    className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/30 transition-colors"
                  >
                    Manage Users
                  </Link>
                  <Link
                    to="/dashboard/admin/vendors"
                    className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-text-dark hover:bg-secondary-dark transition-colors"
                  >
                    Manage Vendors
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
