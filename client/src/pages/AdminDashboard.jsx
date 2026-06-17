import { Link } from 'react-router-dom'
import {
  HiOutlineBanknotes,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineEllipsisVertical,
} from 'react-icons/hi2'
import AdminTopBar from '../components/admin/AdminTopBar'
import {
  platformStats,
  recentUsers,
  systemEvents,
  userStatusStyles,
} from '../data/adminData'

const statIcons = {
  revenue: HiOutlineBanknotes,
  users: HiOutlineUsers,
  performance: HiOutlineChartBar,
}

export default function AdminDashboard() {
  return (
    <div>
      <AdminTopBar
        title="Platform Overview"
        subtitle="Monitor platform health, users, and vendor activity."
        searchPlaceholder="Search platform..."
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {platformStats.map((stat) => {
            const Icon = statIcons[stat.id]
            return (
              <div
                key={stat.id}
                className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-muted">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-text-dark sm:text-3xl">{stat.value}</p>
                    <p
                      className={`mt-1 text-xs font-medium ${
                        stat.trendUp === true
                          ? 'text-tertiary'
                          : stat.trendUp === false
                            ? 'text-red-500'
                            : 'text-text-muted'
                      }`}
                    >
                      {stat.trend}
                    </p>
                  </div>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main grid */}
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
                    <th className="px-4 py-3 sm:px-5">Status</th>
                    <th className="px-4 py-3 sm:px-5">Last Active</th>
                    <th className="px-4 py-3 sm:px-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-neutral-border last:border-0">
                      <td className="px-4 py-3.5 sm:px-5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${user.avatarColor}`}
                          >
                            {user.initials}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-text-dark">{user.name}</p>
                            <p className="truncate text-xs text-text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 sm:px-5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${userStatusStyles[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-text-muted sm:px-5">{user.lastActive}</td>
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
          </div>

          {/* System Events */}
          <div className="rounded-xl border border-neutral-border bg-white shadow-sm">
            <div className="border-b border-neutral-border px-4 py-4 sm:px-5">
              <h2 className="font-bold text-text-dark">System Events</h2>
            </div>
            <div className="divide-y divide-neutral-border">
              {systemEvents.map((event) => (
                <div key={event.id} className="flex gap-3 p-4 sm:p-5">
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${event.color}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-dark">{event.title}</p>
                    <p className="mt-0.5 text-xs text-text-muted">{event.description}</p>
                    <p className="mt-1 text-xs text-text-muted">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-border p-4 text-center">
              <button
                type="button"
                className="text-sm font-semibold text-primary hover:text-primary-dark"
              >
                View Event Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
