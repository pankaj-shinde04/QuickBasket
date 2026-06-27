import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineShoppingCart,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineFunnel,
  HiOutlineArrowDownTray,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowPath,
} from 'react-icons/hi2'
import ShopOwnerTopBar from '../../components/shop-owner/ShopOwnerTopBar'
import { apiRequest, getAuthToken } from '../../services/api'

const STATUS_STYLES = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-500',
}

const TABS = [
  { key: 'all', label: 'All Orders' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Processing', label: 'Processing' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Delivered', label: 'Delivered' },
  { key: 'Cancelled', label: 'Cancelled' },
]

export default function ShopOwnerOrders() {
  const [activeTab, setActiveTab] = useState('all')
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const perPage = 10

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getAuthToken()
      const res = await apiRequest('/admin/orders', { token })
      setOrders(res.data.orders || [])
    } catch (err) {
      setError(err.message || 'Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filtered = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === activeTab)
  const tabCounts = {
    all: orders.length,
    Pending: orders.filter((o) => o.status === 'Pending').length,
    Processing: orders.filter((o) => o.status === 'Processing').length,
    Shipped: orders.filter((o) => o.status === 'Shipped').length,
    Delivered: orders.filter((o) => o.status === 'Delivered').length,
    Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
  }
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <ShopOwnerTopBar searchPlaceholder="Search orders, customers, or IDs..." />

      <div className="px-5 pb-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-dark sm:text-3xl">Order Management</h1>
            <p className="mt-1 text-sm text-text-muted">
              You have 12 active orders today across all locations.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-neutral-border bg-white px-4 py-2 text-sm font-semibold text-text-dark hover:bg-neutral"
            >
              <HiOutlineFunnel className="h-4 w-4" />
              Filters
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-neutral-border bg-white px-4 py-2 text-sm font-semibold text-text-dark hover:bg-neutral"
            >
              <HiOutlineArrowDownTray className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {orderStats.map((stat) => {
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
                      className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                        stat.trendUp === true
                          ? 'text-tertiary'
                          : stat.trendUp === false
                            ? 'text-red-500'
                            : 'text-text-muted'
                      }`}
                    >
                      {stat.trendUp === true && (
                        <HiOutlineArrowTrendingUp className="h-3.5 w-3.5" />
                      )}
                      {stat.trendUp === false && (
                        <HiOutlineArrowTrendingDown className="h-3.5 w-3.5" />
                      )}
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

        {/* Orders table */}
        <div className="rounded-xl border border-neutral-border bg-white shadow-sm">
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-neutral-border px-5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key)
                  setPage(1)
                }}
                className={`shrink-0 border-b-2 px-4 py-4 text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text-dark'
                }`}
              >
                {tab.label} ({tabCounts[tab.key]})
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-neutral-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-border last:border-0">
                    <td className="px-5 py-4 font-medium text-text-dark">#{order.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {order.customer.avatar ? (
                          <img
                            src={order.customer.avatar}
                            alt={order.customer.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                            {order.customer.initials}
                          </span>
                        )}
                        <span className="font-medium text-text-dark">{order.customer.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-muted">{order.date}</td>
                    <td className="px-5 py-4 font-medium text-text-dark">{order.amountLabel}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/dashboard/shop-owner/orders/${order.displayId ?? order.id}`}
                        className="text-sm font-semibold text-primary hover:text-primary-dark"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-border px-5 py-4">
            <p className="text-sm text-text-muted">
              Showing {paginated.length} of {filtered.length}{' '}
              {activeTab === 'new' ? 'new' : activeTab} orders
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
              >
                <HiOutlineChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
              >
                <HiOutlineChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
