import { useState } from 'react'
import {
  HiOutlineFunnel,
  HiOutlineEllipsisVertical,
  HiOutlineShieldCheck,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2'
import AdminTopBar from '../../components/admin/AdminTopBar'
import { platformUsers, userStats, userFilters, userStatusStyles } from '../../data/adminData'

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('All Users')
  const [page, setPage] = useState(1)

  const filtered = platformUsers.filter((user) => {
    if (activeTab === 'All Users') return true
    if (activeTab === 'Active') return user.status === 'Active'
    if (activeTab === 'Banned') return user.status === 'Banned'
    return true
  })

  return (
    <div>
      <AdminTopBar
        title="User Management"
        subtitle="Monitor and manage all customer accounts across the platform."
        searchPlaceholder="Search name or email..."
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Summary cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <p className="text-sm text-text-muted">Total Customers</p>
            <p className="mt-1 text-2xl font-bold text-primary sm:text-3xl">{userStats.totalCustomers}</p>
            <p className="mt-1 text-xs font-semibold text-tertiary">{userStats.totalTrend}</p>
          </div>
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <p className="text-sm text-text-muted">Active Now</p>
            <p className="mt-1 text-2xl font-bold text-tertiary sm:text-3xl">{userStats.activeNow}</p>
            <div className="mt-2 flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/150?u=user-${i}`}
                  alt=""
                  className="h-7 w-7 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-primary p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/80">New Registrations</p>
                <p className="mt-2 text-sm leading-relaxed">
                  You have <strong>{userStats.pendingVerifications}</strong> pending account
                  verifications today.
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-text-dark hover:bg-secondary-dark"
                >
                  Review Now
                </button>
              </div>
              <HiOutlineShieldCheck className="hidden h-10 w-10 text-white/30 sm:block" />
            </div>
          </div>
        </div>

        {/* User table */}
        <div className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-neutral-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex gap-2 overflow-x-auto">
              {userFilters.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
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
                  <th className="px-4 py-3 sm:px-5">Total Orders</th>
                  <th className="px-4 py-3 sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-border last:border-0">
                    <td className="px-4 py-3.5 sm:px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-text-dark">{user.name}</p>
                          <p className="truncate text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-text-muted sm:px-5">{user.joinDate}</td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${userStatusStyles[user.status]}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-text-dark sm:px-5">
                      {user.totalOrders}
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
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-1 border-t border-neutral-border px-4 py-4 sm:px-5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
            >
              <HiOutlineChevronLeft className="h-5 w-5" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                  page === p ? 'bg-primary text-white' : 'text-text-muted hover:bg-neutral'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(3, p + 1))}
              disabled={page === 3}
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
