import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  HiOutlineCheck,
  HiOutlinePhone,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChevronDown,
  HiOutlineMapPin,
  HiOutlineArrowPath,
  HiOutlineExclamationCircle,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineHome,
  HiOutlineXCircle,
} from 'react-icons/hi2'
import { MdOutlineRestaurant } from 'react-icons/md'
import CustomerFooter from '../../components/customer/CustomerFooter'
import { apiRequest, getAuthToken } from '../../services/api'
import { useToast } from '../../context/ToastContext'

// ─── Timeline steps derived from order status ─────────────────────────────────
const TIMELINE = [
  { key: 'Pending',    label: 'Order Placed',    icon: HiOutlineShoppingBag  },
  { key: 'Processing', label: 'Being Prepared',  icon: MdOutlineRestaurant   },
  { key: 'Shipped',   label: 'Out for Delivery', icon: HiOutlineTruck        },
  { key: 'Delivered', label: 'Delivered',        icon: HiOutlineHome         },
]

const STATUS_ORDER = ['Pending', 'Processing', 'Shipped', 'Delivered']

function getTimelineState(orderStatus) {
  if (orderStatus === 'Cancelled') return TIMELINE.map((s) => ({ ...s, done: false, active: false, cancelled: true }))
  const idx = STATUS_ORDER.indexOf(orderStatus)
  return TIMELINE.map((step, i) => ({
    ...step,
    done: i < idx,
    active: i === idx,
    cancelled: false,
  }))
}

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-lg bg-neutral ${className}`} />
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CustomerOrderTracking() {
  const { orderId } = useParams()
  const { info } = useToast()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [summaryOpen, setSummaryOpen] = useState(true)
  const token = getAuthToken()

  useEffect(() => {
    if (!orderId) return
    setLoading(true)
    apiRequest(`/orders/customer/${orderId}`, { method: 'GET', token })
      .then((res) => setOrder(res.data.order))
      .catch((err) => setError(err.message || 'Order not found'))
      .finally(() => setLoading(false))
  }, [orderId, token])

  // ── Loading ──
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-56 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // ── Error / not found ──
  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <HiOutlineExclamationCircle className="h-16 w-16 text-red-400" />
        <h2 className="text-xl font-bold text-text-dark">Order Not Found</h2>
        <p className="text-sm text-text-muted">{error || 'This order does not exist or you do not have access.'}</p>
        <Link to="/dashboard/customer/orders" className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark">
          Back to Orders
        </Link>
      </div>
    )
  }

  const timeline = getTimelineState(order.status)
  const isCancelled = order.status === 'Cancelled'
  const isDelivered = order.status === 'Delivered'
  const subtotal = order.items?.reduce((sum, it) => sum + it.price * it.quantity, 0) ?? order.total

  return (
    <div>
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Breadcrumb */}
        <p className="mb-4 text-xs text-text-muted sm:text-sm">
          <Link to="/dashboard/customer" className="hover:text-primary">Home</Link>
          {' › '}
          <Link to="/dashboard/customer/orders" className="hover:text-primary">Orders</Link>
          {' › '}
          <span className="text-text-dark">#{order.displayId}</span>
        </p>

        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          {/* ── Left column ── */}
          <div className="space-y-6 lg:col-span-2">

            {/* Status card */}
            <div className="rounded-xl border border-neutral-border bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    isCancelled ? 'text-red-500' : isDelivered ? 'text-tertiary' : 'text-blue-600'
                  }`}>
                    {isCancelled ? 'Cancelled' : isDelivered ? 'Delivered' : 'Active Delivery'}
                  </p>
                  <h1 className="mt-1 text-xl font-bold text-text-dark sm:mt-2 sm:text-2xl lg:text-3xl">
                    {isDelivered
                      ? 'Your order has arrived!'
                      : isCancelled
                        ? 'Order was cancelled'
                        : `Order ${order.status}`}
                  </h1>
                  <p className="mt-1 text-sm text-text-muted">
                    Order #{order.displayId}
                    {order.createdAt && ` · Placed ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </p>
                </div>
                <span className={`w-fit rounded-full px-4 py-2 text-sm font-bold text-white sm:px-5 ${
                  isCancelled ? 'bg-red-500' : isDelivered ? 'bg-tertiary' : 'bg-primary'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Timeline — vertical on mobile */}
              <div className="mt-6 space-y-4 sm:hidden">
                {timeline.map((step) => {
                  const Icon = step.icon
                  return (
                    <div key={step.key} className="flex items-start gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        step.cancelled
                          ? 'bg-red-100 text-red-400'
                          : step.active
                            ? 'bg-primary text-white ring-4 ring-primary-light'
                            : step.done
                              ? 'bg-primary text-white'
                              : 'bg-neutral text-text-muted'
                      }`}>
                        {step.cancelled ? <HiOutlineXCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <div className="pt-1.5">
                        <p className={`text-sm font-medium ${
                          step.active || step.done ? 'text-primary' : 'text-text-muted'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Timeline — horizontal on tablet+ */}
              <div className="mt-8 hidden overflow-x-auto pb-2 sm:block">
                <div className="flex min-w-[500px] items-center justify-between">
                  {timeline.map((step, i) => {
                    const Icon = step.icon
                    return (
                      <div key={step.key} className="flex flex-1 flex-col items-center">
                        <div className="flex w-full items-center">
                          {i > 0 && (
                            <div className={`h-0.5 flex-1 ${
                              timeline[i - 1].done ? 'bg-primary' : 'border-t border-dashed border-gray-300'
                            }`} />
                          )}
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            step.cancelled
                              ? 'bg-red-100 text-red-400'
                              : step.active
                                ? 'bg-primary text-white ring-4 ring-primary-light'
                                : step.done
                                  ? 'bg-primary text-white'
                                  : 'bg-neutral text-text-muted'
                          }`}>
                            {step.cancelled ? <HiOutlineXCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                          </span>
                          {i < timeline.length - 1 && (
                            <div className={`h-0.5 flex-1 ${
                              step.done && !step.active ? 'bg-primary' : 'border-t border-dashed border-gray-300'
                            }`} />
                          )}
                        </div>
                        <p className={`mt-2 text-center text-xs font-medium ${
                          step.active || step.done ? 'text-primary' : 'text-text-muted'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Delivery address card */}
            <div className="relative overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm">
              <div className="relative h-36 bg-gradient-to-br from-green-50 via-blue-50 to-primary-light sm:h-48">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200">
                  <path d="M 40 160 Q 120 40 200 80 T 360 60" fill="none" stroke="#6c5dd3" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="40" cy="160" r="8" fill="#6c5dd3" />
                  <circle cx="360" cy="60" r="8" fill="#ffc107" />
                </svg>
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 rounded-xl bg-white/95 px-3 py-3 shadow-md backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-4 sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:px-4">
                  <HiOutlineMapPin className="h-5 w-5 shrink-0 text-amber-700" />
                  <p className="flex-1 text-xs font-medium text-text-dark sm:text-sm">
                    {order.deliveryAddress
                      ? `${order.deliveryAddress.addressLine1}, ${order.deliveryAddress.city} ${order.deliveryAddress.pincode}`
                      : 'Delivery address not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5">

            {/* Payment info */}
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h2 className="font-bold text-text-dark">Payment</h2>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Method</span>
                  <span className="font-semibold capitalize">{order.paymentMethod || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Status</span>
                  <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-tertiary' : 'text-orange-500'}`}>
                    {order.paymentStatus || '—'}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => info('Phone support coming soon.', 'Call support')}
                  className="flex items-center justify-center gap-2 rounded-lg border border-neutral-border py-2.5 text-sm font-semibold text-text-dark hover:bg-neutral"
                >
                  <HiOutlinePhone className="h-4 w-4" />
                  Call
                </button>
                <button
                  type="button"
                  onClick={() => info('Live chat coming soon.', 'Chat support')}
                  className="flex items-center justify-center gap-2 rounded-lg border border-neutral-border py-2.5 text-sm font-semibold text-text-dark hover:bg-neutral"
                >
                  <HiOutlineChatBubbleLeftRight className="h-4 w-4" />
                  Chat
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                className="flex w-full items-center justify-between font-bold text-text-dark"
              >
                Order Summary
                <HiOutlineChevronDown className={`h-5 w-5 text-text-muted transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
              </button>
              <p className="mt-1 text-sm text-text-muted">
                {order.items?.length ?? 0} items · ₹{Number(order.total).toFixed(2)}
              </p>

              {summaryOpen && (
                <>
                  <div className="mt-4 space-y-3">
                    {(order.items || []).map((item, i) => (
                      <div key={item._id || i} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral">
                          {item.image
                            ? <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                            : <HiOutlineShoppingBag className="h-5 w-5 text-text-muted" />
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text-dark">{item.name}</p>
                          <p className="text-xs text-text-muted">
                            ×{item.quantity} · ₹{Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 border-t border-neutral-border pt-4 text-sm">
                    <div className="flex justify-between text-text-muted">
                      <span>Subtotal</span>
                      <span>₹{Number(subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>Delivery</span>
                      <span className="font-semibold text-tertiary">FREE</span>
                    </div>
                    <div className="flex justify-between font-bold text-primary">
                      <span>Total</span>
                      <span>₹{Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Support */}
            <div className="rounded-xl bg-primary p-5 text-white">
              <p className="text-sm leading-relaxed">
                Need help with your order? Our support team is available 24/7 for any questions.
              </p>
              <button type="button" className="mt-4 w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-primary hover:bg-primary-light">
                Contact Support
              </button>
            </div>

            <Link to="/dashboard/customer/orders" className="block text-center text-sm font-semibold text-primary hover:text-primary-dark">
              ← Back to Order History
            </Link>
          </div>
        </div>
      </div>

      <CustomerFooter />
    </div>
  )
}
