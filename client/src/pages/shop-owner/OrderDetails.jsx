import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  HiOutlineArrowLeft,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineMapPin,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineCreditCard,
  HiOutlineCalendar,
  HiOutlineHashtag,
} from 'react-icons/hi2'
import { MdOutlineRestaurant } from 'react-icons/md'
import ShopOwnerTopBar from '../../components/shop-owner/ShopOwnerTopBar'
import { apiRequest, getAuthToken } from '../../services/api'
import { useToast } from '../../context/ToastContext'

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Processing: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-600 border-red-200',
}

const ORDER_ACTIONS = [
  { key: 'Pending', label: 'Pending', icon: 'clock' },
  { key: 'Processing', label: 'Processing', icon: 'preparing' },
  { key: 'Shipped', label: 'Shipped', icon: 'delivery' },
  { key: 'Delivered', label: 'Delivered', icon: 'delivered' },
]

const actionIcons = {
  clock: HiOutlineCheck,
  preparing: MdOutlineRestaurant,
  delivery: HiOutlineTruck,
  delivered: HiOutlineCheckCircle,
}

// ─── Helper: format address object into readable string ───────────────────────
function formatAddress(addr) {
  if (!addr) return ''
  if (typeof addr === 'string') return addr
  const parts = [
    addr.street,
    addr.landmark,
    addr.city,
    addr.state,
    addr.postal,
    addr.country,
  ].filter(Boolean)
  return parts.join(', ')
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse px-5 pb-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-8 w-48 rounded bg-neutral" />
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="h-64 rounded-xl bg-neutral lg:col-span-2" />
        <div className="h-64 rounded-xl bg-neutral" />
      </div>
      <div className="h-72 rounded-xl bg-neutral" />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ShopOwnerOrderDetails() {
  const { orderId } = useParams()
  const { success, error: toastError } = useToast()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentStatus, setCurrentStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateMsg, setUpdateMsg] = useState(null)

  // Fetch order from API
  const fetchOrder = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getAuthToken()
      const res = await apiRequest(`/orders/shop-owner/${orderId}`, { token })
      const fetched = res.data?.order
      setOrder(fetched)
      setCurrentStatus(fetched?.status || 'Pending')
    } catch (err) {
      setError(err.message || 'Failed to load order.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  // Update order status via API
  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === currentStatus) return
    setUpdating(true)
    setUpdateMsg(null)
    try {
      const token = getAuthToken()
      await apiRequest(`/orders/shop-owner/${orderId}/status`, {
        method: 'PATCH',
        token,
        body: { status: newStatus },
      })
      setCurrentStatus(newStatus)
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev))
      setUpdateMsg({ type: 'success', text: `Status updated to "${newStatus}"` })
      success(`Order status updated to "${newStatus}".`, 'Status updated')
    } catch (err) {
      setUpdateMsg({ type: 'error', text: err.message || 'Failed to update status.' })
      toastError(err.message || 'Failed to update status.', 'Update failed')
    } finally {
      setUpdating(false)
      setTimeout(() => setUpdateMsg(null), 3000)
    }
  }

  // ── States: loading / error / not found ──────────────────────────────────────
  if (loading) {
    return (
      <div>
        <ShopOwnerTopBar searchPlaceholder="Search orders..." />
        <Skeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <ShopOwnerTopBar searchPlaceholder="Search orders..." />
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              onClick={fetchOrder}
              className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <HiOutlineArrowPath className="h-4 w-4" />
              Try again
            </button>
          </div>
          <Link to="/dashboard/shop-owner/orders" className="mt-6 text-sm font-semibold text-primary">
            ← Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div>
        <ShopOwnerTopBar searchPlaceholder="Search orders..." />
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
          <p className="text-lg font-semibold text-text-dark">Order not found</p>
          <p className="mt-2 text-sm text-text-muted">
            Order <span className="font-mono font-bold">#{orderId}</span> does not exist.
          </p>
          <Link to="/dashboard/shop-owner/orders" className="mt-6 text-sm font-semibold text-primary">
            ← Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  // ── Derived values ────────────────────────────────────────────────────────────
  const displayId = order.displayId || orderId
  const customer = order.customer || {}
  const address = formatAddress(order.deliveryAddress)
  const phone = order.deliveryAddress?.phone || customer.phone || ''
  const items = order.items || []
  const subtotal = Number(order.subtotal || 0)
  const deliveryFee = Number(order.deliveryFee || 0)
  const serviceFee = Number(order.serviceFee || 0)
  const total = Number(order.total || 0)
  const orderedOn = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—'

  return (
    <div>
      <ShopOwnerTopBar searchPlaceholder="Search orders, customers, or IDs..." />

      <div className="px-5 pb-8 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-6">
          <Link
            to="/dashboard/shop-owner/orders"
            className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-text-dark sm:text-3xl">
              Order #{displayId}
            </h1>
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[currentStatus] || 'bg-neutral text-text-muted border-neutral-border'}`}
            >
              {currentStatus}
            </span>
          </div>
        </div>

        {/* Update feedback */}
        {updateMsg && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
              updateMsg.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {updateMsg.text}
          </div>
        )}

        {/* Top row: Status actions + Customer info */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">

          {/* Status & Quick Actions */}
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-border pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Current Status</p>
                <p className="mt-1 text-2xl font-bold text-text-dark">{currentStatus}</p>
              </div>
              <div className="text-right text-sm text-text-muted">
                <div className="flex items-center gap-1">
                  <HiOutlineCalendar className="h-4 w-4" />
                  <span>{orderedOn}</span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <HiOutlineCreditCard className="h-4 w-4" />
                  <span>{order.paymentMethod || 'COD'}</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {ORDER_ACTIONS.map((action) => {
                  const Icon = actionIcons[action.icon]
                  const isActive = currentStatus === action.key
                  return (
                    <button
                      key={action.key}
                      type="button"
                      disabled={updating}
                      onClick={() => handleStatusUpdate(action.key)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'bg-neutral text-text-muted hover:bg-gray-200 hover:text-text-dark'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </button>
                  )
                })}
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusUpdate('Cancelled')}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
                    currentStatus === 'Cancelled'
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-red-300 bg-white text-red-500 hover:bg-red-50'
                  }`}
                >
                  <HiOutlineXMark className="h-4 w-4" />
                  Cancel
                </button>
              </div>
              {updating && (
                <p className="mt-2 flex items-center gap-1 text-xs text-text-muted">
                  <HiOutlineArrowPath className="h-3 w-3 animate-spin" />
                  Updating status...
                </p>
              )}
            </div>
          </div>

          {/* Customer info */}
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-5">

              {/* Customer name / email */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                  <HiOutlineUser className="h-4 w-4" />
                  Customer
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                    {customer.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <div>
                    <p className="font-semibold text-text-dark">{customer.name || 'Unknown'}</p>
                    {customer.email && (
                      <p className="text-xs text-text-muted">{customer.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              {address && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <HiOutlineMapPin className="h-4 w-4" />
                    Delivery Address
                  </div>
                  <p className="text-sm leading-relaxed text-text-dark">{address}</p>
                  {order.deliveryAddress?.fullName && (
                    <p className="mt-1 text-xs text-text-muted">
                      Attn: {order.deliveryAddress.fullName}
                    </p>
                  )}
                </div>
              )}

              {/* Phone */}
              {phone && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <HiOutlinePhone className="h-4 w-4" />
                    Contact
                  </div>
                  <p className="text-sm font-medium text-text-dark">{phone}</p>
                </div>
              )}

              {/* Order ID reference */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                  <HiOutlineHashtag className="h-4 w-4" />
                  Order ID
                </div>
                <p className="font-mono text-sm font-semibold text-text-dark">#{displayId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items ordered */}
        <div className="rounded-xl border border-neutral-border bg-white shadow-sm">
          <div className="border-b border-neutral-border px-5 py-4">
            <h2 className="font-bold text-text-dark">
              Items Ordered ({items.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-neutral-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Qty</th>
                  <th className="px-5 py-3">Unit Price</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.productId || idx} className="border-b border-neutral-border last:border-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral text-xl">
                            📦
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-text-dark">{item.name}</p>
                          {item.category && (
                            <p className="text-xs text-text-muted">{item.category}</p>
                          )}
                          {item.unit && (
                            <p className="text-xs text-text-muted">{item.unit}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-muted">× {item.qty ?? item.quantity ?? 1}</td>
                    <td className="px-5 py-4 text-text-muted">
                      ₹{Number(item.price || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-primary">
                      ₹{(Number(item.price || 0) * Number(item.qty ?? item.quantity ?? 1)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order totals */}
          <div className="border-t border-neutral-border px-5 py-4">
            <div className="ml-auto max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              {serviceFee > 0 && (
                <div className="flex justify-between text-text-muted">
                  <span>Service Fee</span>
                  <span>₹{serviceFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-border pt-2 text-base font-bold">
                <span className="text-text-dark">Total Amount</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Instructions */}
        {order.deliveryInstructions && (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Delivery Instructions
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-dark">
              &ldquo;{order.deliveryInstructions}&rdquo;
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
