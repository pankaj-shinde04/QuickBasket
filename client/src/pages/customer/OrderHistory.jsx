import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineShoppingBag,
  HiOutlineArrowPath,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineXCircle,
} from 'react-icons/hi2'
import CustomerFooter from '../../components/customer/CustomerFooter'
import { useAuth } from '../../context/AuthContext'
import { apiRequest, getAuthToken } from '../../services/api'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop'

const STATUS_STYLES = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-500',
}

const FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

function OrderCard({ order, onCancel }) {
  const [expanded, setExpanded] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    setCancelling(true)
    await onCancel(order.displayId)
    setCancelling(false)
  }

  const canCancel = ['Pending', 'Processing'].includes(order.status)
  const itemCount = order.items?.reduce((s, i) => s + i.qty, 0) || 0

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm">
      {/* Header row */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:p-5">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-6 md:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Order ID</p>
            <p className="mt-0.5 text-sm font-bold text-primary">#{order.displayId}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Date</p>
            <p className="mt-0.5 text-sm font-medium text-text-dark">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Items</p>
            <p className="mt-0.5 text-sm font-medium text-text-dark">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Total</p>
            <p className="mt-0.5 text-sm font-bold text-text-dark">₹{Number(order.total).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-neutral text-text-muted'}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {order.status}
          </span>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-lg p-1.5 text-text-muted hover:bg-neutral"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <HiOutlineChevronUp className="h-5 w-5" /> : <HiOutlineChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Preview images */}
      <div className="flex items-center gap-2 border-t border-neutral-border px-4 py-3 sm:px-5">
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {(order.items || []).slice(0, 4).map((item, i) => (
            <img
              key={i}
              src={item.image || PLACEHOLDER}
              alt={item.name}
              onError={(e) => { e.target.src = PLACEHOLDER }}
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
          ))}
          {(order.items || []).length > 4 && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral text-xs font-semibold text-text-muted">
              +{order.items.length - 4}
            </span>
          )}
        </div>

        {canCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-60"
          >
            {cancelling ? <HiOutlineArrowPath className="h-3.5 w-3.5 animate-spin" /> : <HiOutlineXCircle className="h-3.5 w-3.5" />}
            Cancel
          </button>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-neutral-border bg-neutral/30 p-4 sm:p-5">
          <div className="space-y-3">
            {(order.items || []).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={item.image || PLACEHOLDER}
                  alt={item.name}
                  onError={(e) => { e.target.src = PLACEHOLDER }}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-dark">{item.name}</p>
                  <p className="text-xs text-text-muted">
                    {item.qty} × ₹{Number(item.price).toFixed(2)}
                    {item.unit ? ` / ${item.unit}` : ''}
                  </p>
                </div>
                <p className="text-sm font-bold text-primary">
                  ₹{(Number(item.price) * item.qty).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          {(order.deliveryAddress?.street || order.phone) && (
            <div className="mt-4 rounded-lg border border-neutral-border bg-white p-3 text-xs text-text-muted space-y-1">
              {order.deliveryAddress?.street && (
                <p>📍 {order.deliveryAddress.street}, {order.deliveryAddress.city} {order.deliveryAddress.postal}</p>
              )}
              {order.phone && <p>📞 {order.phone}</p>}
              {order.notes && <p>📝 {order.notes}</p>}
            </div>
          )}

          {/* Totals */}
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal</span><span>₹{Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Delivery</span>
              <span className={order.deliveryFee === 0 ? 'text-tertiary font-semibold' : ''}>
                {order.deliveryFee === 0 ? 'Free' : `₹${Number(order.deliveryFee).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-border pt-2 font-bold">
              <span className="text-text-dark">Total</span>
              <span className="text-primary">₹{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default function CustomerOrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getAuthToken()
      const res = await apiRequest('/orders', { token })
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

  const handleCancel = async (displayId) => {
    try {
      const token = getAuthToken()
      await apiRequest(`/orders/${displayId}/cancel`, { method: 'PATCH', token })
      await fetchOrders()
    } catch (err) {
      alert(err.message || 'Could not cancel order.')
    }
  }

  const filtered = activeFilter === 'All'
    ? orders
    : orders.filter((o) => o.status === activeFilter)

  return (
    <div>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-dark sm:text-2xl lg:text-3xl">My Orders</h1>
            <p className="mt-1 text-sm text-text-muted">
              {loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 self-start rounded-lg border border-neutral-border bg-white px-4 py-2 text-sm font-semibold text-text-muted hover:bg-neutral disabled:opacity-60 sm:self-auto"
          >
            <HiOutlineArrowPath className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Status filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = f === 'All' ? orders.length : orders.filter((o) => o.status === f).length
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeFilter === f
                    ? 'bg-primary text-white'
                    : 'border border-neutral-border bg-white text-text-muted hover:border-primary hover:text-primary'
                }`}
              >
                {f}
                {count > 0 && (
                  <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeFilter === f ? 'bg-white/20 text-white' : 'bg-neutral text-text-muted'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-sm text-text-muted">
            <HiOutlineArrowPath className="mr-2 h-5 w-5 animate-spin text-primary" />
            Loading your orders...
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
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-border bg-white py-16 text-center">
            <HiOutlineShoppingBag className="h-14 w-14 text-neutral-border" />
            <h2 className="mt-4 font-semibold text-text-dark">
              {activeFilter === 'All' ? 'No orders yet' : `No ${activeFilter.toLowerCase()} orders`}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {activeFilter === 'All'
                ? "You haven't placed any orders. Start shopping!"
                : `You have no orders with status "${activeFilter}".`}
            </p>
            {activeFilter === 'All' && (
              <Link
                to="/"
                className="mt-5 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                <HiOutlineShoppingBag className="h-4 w-4" />
                Browse Products
              </Link>
            )}
          </div>
        )}

        {/* Order cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order._id} order={order} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>

      <CustomerFooter />
    </div>
  )
}
