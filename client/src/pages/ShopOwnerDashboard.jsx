import {
  HiOutlineBanknotes,
  HiOutlineUsers,
  HiOutlineTruck,
  HiOutlineShoppingCart,
  HiOutlineEllipsisVertical,
} from 'react-icons/hi2'
import { dashboardStats, recentOrders, inventoryAlerts } from '../data/shopOwnerData'

const statIcons = {
  sales: HiOutlineBanknotes,
  visitors: HiOutlineUsers,
  orders: HiOutlineTruck,
  conversion: HiOutlineShoppingCart,
}

const statusStyles = {
  Processing: 'bg-yellow-100 text-yellow-800',
  Fulfilled: 'bg-tertiary-light text-tertiary',
}

export default function ShopOwnerDashboard() {
  return (
    <div className="p-5 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-dark sm:text-3xl">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-text-muted">
          Welcome back. Here&apos;s what&apos;s happening in your store today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = statIcons[stat.icon]
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-text-dark">{stat.value}</p>
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

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="rounded-xl border border-neutral-border bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-border px-5 py-4">
            <h2 className="font-bold text-text-dark">Recent Orders</h2>
            <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b border-neutral-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-border last:border-0">
                    <td className="px-5 py-3.5 font-medium text-text-dark">#{order.id}</td>
                    <td className="px-5 py-3.5 text-text-muted">{order.customer}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-text-dark">{order.total}</td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        className="rounded p-1 text-text-muted hover:bg-neutral"
                        aria-label="Order actions"
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

        {/* Inventory Alerts */}
        <div className="rounded-xl border border-neutral-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-border px-5 py-4">
            <h2 className="font-bold text-text-dark">Inventory Alerts</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {inventoryAlerts.length}
            </span>
          </div>
          <div className="divide-y divide-neutral-border">
            {inventoryAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 p-4">
                <img
                  src={alert.image}
                  alt={alert.name}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-dark">{alert.name}</p>
                  <p
                    className={`text-xs font-medium ${
                      alert.type === 'expiring' ? 'text-orange-500' : 'text-red-500'
                    }`}
                  >
                    {alert.message}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light"
                >
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
