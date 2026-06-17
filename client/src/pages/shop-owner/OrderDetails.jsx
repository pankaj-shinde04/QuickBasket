import { useState } from 'react'
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
} from 'react-icons/hi2'
import { MdOutlineRestaurant } from 'react-icons/md'
import ShopOwnerTopBar from '../../components/shop-owner/ShopOwnerTopBar'
import { getOrderById, ORDER_ACTIONS } from '../../data/shopOwnerOrders'

const actionIcons = {
  check: HiOutlineCheck,
  preparing: MdOutlineRestaurant,
  delivery: HiOutlineTruck,
  delivered: HiOutlineCheckCircle,
}

export default function ShopOwnerOrderDetails() {
  const { orderId } = useParams()
  const order = getOrderById(orderId)
  const [currentStatus, setCurrentStatus] = useState(order?.currentStatus ?? order?.status ?? 'Accepted')
  const [rejected, setRejected] = useState(false)

  if (!order || !order.items) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
        <p className="text-text-muted">Order not found.</p>
        <Link
          to="/dashboard/shop-owner/orders"
          className="mt-4 text-sm font-semibold text-primary"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  const displayId = order.displayId ?? order.id

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
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Order #{displayId}</h1>
        </div>

        {/* Top row: Status + Customer */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          {/* Order status & quick actions */}
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-800">
                  Current Status
                </span>
                <p className="mt-2 text-3xl font-bold text-text-dark">
                  {rejected ? 'Rejected' : currentStatus}
                </p>
              </div>
              <p className="text-sm text-text-muted">
                Ordered On {order.orderedOn ?? order.date}
              </p>
            </div>

            <div className="mt-6 rounded-xl border-2 border-dashed border-neutral-border p-4 sm:p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
                Quick Actions
              </p>
              <div className="flex flex-wrap gap-2">
                {ORDER_ACTIONS.map((action) => {
                  const Icon = actionIcons[action.icon]
                  const isActive = !rejected && currentStatus === action.key
                  return (
                    <button
                      key={action.key}
                      type="button"
                      onClick={() => {
                        setRejected(false)
                        setCurrentStatus(action.key)
                      }}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
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
                  onClick={() => setRejected(true)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    rejected
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-red-300 bg-white text-red-500 hover:bg-red-50'
                  }`}
                >
                  <HiOutlineXMark className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>

          {/* Customer details sidebar */}
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                  <HiOutlineUser className="h-4 w-4" />
                  Customer Details
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={order.customer.avatar}
                    alt={order.customer.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-text-dark">{order.customer.name}</p>
                    {order.customer.email && (
                      <p className="text-xs text-text-muted">{order.customer.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {order.deliveryAddress && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <HiOutlineMapPin className="h-4 w-4" />
                    Delivery Address
                  </div>
                  <p className="text-sm leading-relaxed text-text-dark">{order.deliveryAddress}</p>
                </div>
              )}

              {order.phone && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <HiOutlinePhone className="h-4 w-4" />
                    Contact
                  </div>
                  <p className="text-sm font-medium text-text-dark">{order.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items ordered - full width */}
        <div className="rounded-xl border border-neutral-border bg-white shadow-sm">
          <div className="border-b border-neutral-border px-5 py-4">
            <h2 className="font-bold text-text-dark">Items Ordered ({order.items.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-neutral-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Quantity</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.name} className="border-b border-neutral-border last:border-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-text-dark">{item.name}</p>
                          <p className="text-xs text-text-muted">Category: {item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-muted">{item.quantity}</td>
                    <td className="px-5 py-4 text-text-muted">${item.price.toFixed(2)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-primary">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-neutral-border px-5 py-4">
            <div className="ml-auto max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Tax (Included)</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-border pt-2 text-base font-bold">
                <span className="text-text-dark">Total Amount</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer note */}
        {order.customerNote && (
          <div className="mt-6 rounded-xl bg-primary p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">Customer Note</p>
            <p className="mt-2 text-sm italic text-white sm:text-base">
              &ldquo;{order.customerNote}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
