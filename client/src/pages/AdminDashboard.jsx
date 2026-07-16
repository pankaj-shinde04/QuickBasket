import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineBanknotes,
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlineShoppingBag,
  HiOutlineEllipsisVertical,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowPath,
} from 'react-icons/hi2'
import AdminTopBar from '../components/admin/AdminTopBar'
import { userStatusStyles } from '../data/adminData'
import * as adminApi from '../services/adminService'
import { formatJoinDate, formatStatusLabel, getAvatarColor } from '../utils/adminUser'
import { apiRequest, getAuthToken } from '../services/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtCurrency(n) {
  const v = Number(n || 0)
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`
  return `₹${v.toFixed(0)}`
}

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded bg-neutral ${className}`} />
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, growth, icon: Icon, iconBg, iconColor, loading }) {
  const isPos = growth !== null && growth !== undefined && Number(growth) >= 0
  return (
    <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-muted">{label}</p>
          {loading
            ? <Skeleton className="mt-2 h-8 w-32" />
            : <p className="mt-1 text-2xl font-bold text-text-dark sm:text-3xl">{value}</p>
          }
          {loading
            ? <Skeleton className="mt-2 h-3 w-24" />
            : sub && (
              <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                growth !== null && growth !== undefined
                  ? isPos ? 'text-tertiary' : 'text-red-500'
                  : 'text-text-muted'
              }`}>
                {growth !== null && growth !== undefined && (
                  isPos
                    ? <HiOutlineArrowTrendingUp className="h-3 w-3" />
                    : <HiOutlineArrowTrendingDown className="h-3 w-3" />
                )}
                {sub}
              </p>
            )
          }
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </span>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [platformStats, setPlatformStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [recentUsers, setRecentUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  const token = getAuthToken()

  const loadPlatformStats = useCallback(async () => {
    setLoadingStats(true)
    try {
      const res = await apiRequest('/admin/platform-stats', { method: 'GET', token })
      setPlatformStats(res.data)
    } catch {
      setPlatformStats(null)
    } finally {
      setLoadingStats(false)
    }
  }, [token])

  const loadRecentUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const response = await adminApi.fetchUsers({ limit: 4, page: 1 })
      setRecentUsers(response.data.users)
    } catch {
      setRecentUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => {
    loadPlatformStats()
    loadRecentUsers()
  }, [loadPlatformStats, loadRecentUsers])

  const s = platformStats?.stats || {}

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: fmtCurrency(s.totalRevenue),
      sub: s.revenueGrowth !== null && s.revenueGrowth !== undefined
        ? `${Math.abs(s.revenueGrowth)}% vs last month`
        : `${s.totalOrders ?? 0} orders total`,
      growth: s.revenueGrowth ?? null,
      icon: HiOutlineBanknotes,
      iconBg: 'bg-primary-light',
      iconColor: 'text-primary',
    },
    {
      label: 'Total Users',
      value: (s.totalUsers ?? 0).toLocaleString(),
      sub: `${s.activeUsers ?? 0} active`,
      growth: null,
      icon: HiOutlineUsers,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-700',
    },
    {
      label: 'Total Shops',
      value: (s.totalShops ?? 0).toLocaleString(),
      sub: `${s.activeShops ?? 0} active · ${s.pendingShops ?? 0} pending`,
      growth: null,
      icon: HiOutlineBuildingStorefront,
      iconBg: 'bg-tertiary-light',
      iconColor: 'text-tertiary',
    },
  ]

  return (
    <div>
      <AdminTopBar
        title="Platform Overview"
        subtitle="Monitor platform health, users, and vendor activity."
        searchPlaceholder="Search platform..."
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map((card) => (
            <KpiCard key={card.label} {...card} loading={loadingStats} />
          ))}
        </div>

        {/* This month highlight */}
        {!loadingStats && s.monthRevenue !== undefined && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary-light px-5 py-3">
            <HiOutlineArrowPath className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-text-dark">
              <span className="font-bold text-primary">{fmtCurrency(s.monthRevenue)}</span>
              {' '}revenue this month across{' '}
              <span className="font-semibold">{s.totalOrders ?? 0}</span> total orders.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* Recent Users */}
          <div className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between border-b border-neutral-border px-4 py-4 sm:px-5">
              <h2 className="font-bold text-text-dark">Recent Users</h2>
              <Link
                to="/dashboard/admin/users"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-neutral-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                    <th className="px-4 py-3 sm:px-5">User</th>
                    <th className="px-4 py-3 sm:px-5">Role</th>
                    <th className="px-4 py-3 sm:px-5">Status</th>
                    <th className="px-4 py-3 sm:px-5">Joined</th>
                    <th className="px-4 py-3 sm:px-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-text-muted sm:px-5">
                        Loading users...
                      </td>
                    </tr>
                  ) : recentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-text-muted sm:px-5">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    recentUsers.map((user, index) => {
                      const statusLabel = formatStatusLabel(user.status)
                      return (
                        <tr key={user.id} className="border-b border-neutral-border last:border-0">
                          <td className="px-4 py-3.5 sm:px-5">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(index)}`}>
                                {user.initials}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-text-dark">{user.name}</p>
                                <p className="truncate text-xs text-text-muted">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 capitalize text-text-muted sm:px-5">
                            {user.role.replace('_', ' ')}
                          </td>
                          <td className="px-4 py-3.5 sm:px-5">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${userStatusStyles[statusLabel] ?? userStatusStyles.ACTIVE}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-text-muted sm:px-5">
                            {formatJoinDate(user.joinDate)}
                          </td>
                          <td className="px-4 py-3.5 sm:px-5">
                            <button
                              type="button"
                              className="rounded p-1 text-text-muted hover:bg-neutral"
                              aria-label="User actions"
                            >
                              <HiOutlineEllipsisVertical className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="rounded-xl border border-neutral-border bg-white shadow-sm">
            <div className="border-b border-neutral-border px-4 py-4 sm:px-5">
              <h2 className="font-bold text-text-dark">Platform Summary</h2>
            </div>
            <div className="divide-y divide-neutral-border">
              {[
                { label: 'Total Orders', value: loadingStats ? '—' : (s.totalOrders ?? 0).toLocaleString(), color: 'bg-primary' },
                { label: 'Active Shops', value: loadingStats ? '—' : (s.activeShops ?? 0).toLocaleString(), color: 'bg-tertiary' },
                { label: 'Pending Vendors', value: loadingStats ? '—' : (s.pendingShops ?? 0).toLocaleString(), color: 'bg-yellow-400' },
                { label: 'Active Users', value: loadingStats ? '—' : (s.activeUsers ?? 0).toLocaleString(), color: 'bg-blue-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-4 sm:p-5">
                  <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-dark">{item.label}</p>
                  </div>
                  <span className="text-sm font-bold text-text-dark">
                    {loadingStats ? <Skeleton className="h-4 w-12" /> : item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-border p-4 text-center">
              <Link
                to="/dashboard/admin/analytics"
                className="text-sm font-semibold text-primary hover:text-primary-dark"
              >
                View Full Analytics →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
