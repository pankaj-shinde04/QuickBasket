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

const statIcons = {
  new: HiOutlineShoppingCart,
  delivery: HiOutlineTruck,
  completed: HiOutlineCheckCircle,
  returns: HiOutlineExclamationTriangle,
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
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 5

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getAuthToken()
      const endpoint = activeTab === 'all' ? '/orders/shop-owner/all' : `/orders/shop-owner/status/${activeTab}`
      const res = await apiRequest(endpoint, { token })
      setOrders(res.data.orders || [])
    } catch (err) {
      setError(err.message || 'Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const tabCounts = {
    all: orders.length,
    Pending: orders.filter((o) => o.status === 'Pending').length,
    Processing: orders.filter((o) => o.status === 'Processing').length,
    Shipped: orders.filter((o) => o.status === 'Shipped').length,
    Delivered: orders.filter((o) => o.status === 'Delivered').length,
    Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
  }
  const totalPages = Math.max(1, Math.ceil(orders.length / perPage))
  const paginated = orders.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <ShopOwnerTopBar searchPlaceholder="Search orders, customers, or IDs..." />

      <div className="px-5 pb-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-dark sm:text-3xl">Order Management</h1>
            <p className="mt-1 text-sm text-text-muted">
              {loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-neutral-border bg-white px-4 py-2 text-sm font-semibold text-text-dark hover:bg-neutral disabled:opacity-60"
            >
              <HiOutlineArrowPath className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Orders</p>
                <p className="mt-1 text-2xl font-bold text-text-dark">{tabCounts.all}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <HiOutlineShoppingCart className="h-5 w-5 text-blue-600" />
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted">Pending</p>
                <p className="mt-1 text-2xl font-bold text-text-dark">{tabCounts.Pending}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <HiOutlineExclamationTriangle className="h-5 w-5 text-yellow-600" />
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted">Processing</p>
                <p className="mt-1 text-2xl font-bold text-text-dark">{tabCounts.Processing}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <HiOutlineTruck className="h-5 w-5 text-blue-600" />
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted">Delivered</p>
                <p className="mt-1 text-2xl font-bold text-text-dark">{tabCounts.Delivered}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <HiOutlineCheckCircle className="h-5 w-5 text-green-600" />
              </span>
            </div>
          </div>
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

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16 text-sm text-text-muted">
              <HiOutlineArrowPath className="mr-2 h-5 w-5 animate-spin text-primary" />
              Loading orders...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-600">
              {error}
              <button onClick={fetchOrders} className="mt-2 block w-full font-semibold text-primary">
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <HiOutlineShoppingCart className="h-14 w-14 text-neutral-border" />
              <h2 className="mt-4 font-semibold text-text-dark">No orders found</h2>
              <p className="mt-1 text-sm text-text-muted">
                {activeTab === 'all' ? "There are no orders yet." : `No orders with status "${activeTab}".`}
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && orders.length > 0 && (
            <>
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
                      <tr key={order._id} className="border-b border-neutral-border last:border-0">
                        <td className="px-5 py-4 font-medium text-text-dark">#{order.displayId}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                              {order.customer?.name?.charAt(0) || 'U'}
                            </span>
                            <div>
                              <span className="block font-medium text-text-dark">{order.customer?.name || 'Unknown'}</span>
                              <span className="block text-xs text-text-muted">{order.customer?.phone || ''}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-text-muted">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="px-5 py-4 font-medium text-text-dark">₹{Number(order.total).toFixed(2)}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-neutral text-text-muted'}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            to={`/dashboard/shop-owner/orders/${order.displayId}`}
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
                  Showing {paginated.length} of {orders.length} orders
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
