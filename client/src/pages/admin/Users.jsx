import { useCallback, useEffect, useState } from 'react'
import {
  HiOutlineFunnel,
  HiOutlineEllipsisVertical,
  HiOutlineShieldCheck,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2'
import AdminTopBar from '../../components/admin/AdminTopBar'
import { userFilters, userStatusStyles } from '../../data/adminData'
import * as adminApi from '../../services/adminService'
import { formatJoinDate, formatStatusLabel, getAvatarColor, USER_STATUS } from '../../utils/adminUser'
import { ROLES } from '../../constants/roles'

const TAB_STATUS_MAP = {
  'All Users': undefined,
  Active: USER_STATUS.ACTIVE,
  Banned: USER_STATUS.BANNED,
}

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('All Users')
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ totalPages: 1 })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminApi.fetchUsers({
        page,
        limit: 10,
        role: ROLES.CUSTOMER,
        status: TAB_STATUS_MAP[activeTab],
      })
      setUsers(response.data.users)
      setPagination(response.data.pagination)
    } catch (err) {
      setError(err.message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [activeTab, page])

  const loadStats = useCallback(async () => {
    try {
      const response = await adminApi.fetchUserStats()
      setStats(response.data.stats)
    } catch {
      setStats(null)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPage(1)
  }

  const toggleUserStatus = async (user) => {
    const nextStatus =
      user.status === USER_STATUS.BANNED ? USER_STATUS.ACTIVE : USER_STATUS.BANNED

    try {
      await adminApi.updateUserStatus(user.id, nextStatus)
      await Promise.all([loadUsers(), loadStats()])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <AdminTopBar
        title="User Management"
        subtitle="Monitor and manage all customer accounts across the platform."
        searchPlaceholder="Search name or email..."
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <p className="text-sm text-text-muted">Total Customers</p>
            <p className="mt-1 text-2xl font-bold text-primary sm:text-3xl">
              {stats?.totalCustomers?.toLocaleString() ?? '—'}
            </p>
            <p className="mt-1 text-xs font-semibold text-tertiary">From database</p>
          </div>
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <p className="text-sm text-text-muted">Active Customers</p>
            <p className="mt-1 text-2xl font-bold text-tertiary sm:text-3xl">
              {stats?.activeCustomers?.toLocaleString() ?? '—'}
            </p>
          </div>
          <div className="rounded-xl bg-primary p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/80">Banned Accounts</p>
                <p className="mt-1 text-2xl font-bold sm:text-3xl">
                  {stats?.bannedCustomers?.toLocaleString() ?? '—'}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  Total admins: <strong>{stats?.totalAdmins ?? '—'}</strong>
                </p>
              </div>
              <HiOutlineShieldCheck className="hidden h-10 w-10 text-white/30 sm:block" />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <div className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-neutral-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex gap-2 overflow-x-auto">
              {userFilters.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? 'bg-primary text-white'
                      : 'bg-neutral text-text-muted hover:text-text-dark'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-neutral-border px-4 py-2 text-sm font-semibold text-text-muted hover:border-primary hover:text-primary"
            >
              <HiOutlineFunnel className="h-4 w-4" />
              Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-neutral-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-4 py-3 sm:px-5">User</th>
                  <th className="px-4 py-3 sm:px-5">Join Date</th>
                  <th className="px-4 py-3 sm:px-5">Status</th>
                  <th className="px-4 py-3 sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-text-muted sm:px-5">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-text-muted sm:px-5">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => {
                    const statusLabel = formatStatusLabel(user.status)
                    return (
                      <tr key={user.id} className="border-b border-neutral-border last:border-0">
                        <td className="px-4 py-3.5 sm:px-5">
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(index)}`}
                            >
                              {user.initials}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-text-dark">{user.name}</p>
                              <p className="truncate text-xs text-text-muted">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-text-muted sm:px-5">
                          {formatJoinDate(user.joinDate)}
                        </td>
                        <td className="px-4 py-3.5 sm:px-5">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${userStatusStyles[statusLabel] ?? userStatusStyles.Active}`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-5">
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(user)}
                            className="rounded-lg border border-neutral-border px-3 py-1.5 text-xs font-semibold text-text-muted hover:border-primary hover:text-primary"
                          >
                            {user.status === USER_STATUS.BANNED ? 'Activate' : 'Ban'}
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-1 border-t border-neutral-border px-4 py-4 sm:px-5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
            >
              <HiOutlineChevronLeft className="h-5 w-5" />
            </button>
            <span className="px-3 text-sm text-text-muted">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages || loading}
              className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
            >
              <HiOutlineChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
