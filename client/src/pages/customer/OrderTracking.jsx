import { Link, useParams } from 'react-router-dom'
import {
  HiOutlineCheck,
  HiOutlinePhone,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChevronDown,
  HiOutlineMapPin,
} from 'react-icons/hi2'
import { MdOutlineRestaurant, MdOutlineDeliveryDining } from 'react-icons/md'
import CustomerFooter from '../../components/customer/CustomerFooter'
import { trackingOrder, trackingTimeline, getCustomerOrder } from '../../data/customerOrders'

const timelineIcons = {
  check: HiOutlineCheck,
  pot: MdOutlineRestaurant,
  bike: MdOutlineDeliveryDining,
}

export default function CustomerOrderTracking() {
  const { orderId } = useParams()
  const order = getCustomerOrder(orderId) ?? { displayId: orderId }
  const data = trackingOrder

  return (
    <div>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Active delivery card */}
            <div className="rounded-xl border border-neutral-border bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Active Delivery
                  </p>
                  <h1 className="mt-1 text-xl font-bold text-text-dark sm:mt-2 sm:text-2xl lg:text-3xl">
                    Arriving in {data.eta}
                  </h1>
                  <p className="mt-1 text-sm text-text-muted">
                    Order #{order.displayId ?? data.id} • Expected by {data.expectedBy}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-primary px-4 py-2 text-sm font-bold text-white sm:px-5">
                  Track Live
                </span>
              </div>

              {/* Timeline — vertical on mobile */}
              <div className="mt-6 space-y-4 sm:hidden">
                {trackingTimeline.map((step) => {
                  const Icon = timelineIcons[step.icon]
                  const isDone = step.done
                  const isActive = step.active
                  return (
                    <div key={step.key} className="flex items-start gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          isActive
                            ? 'bg-primary text-white ring-4 ring-primary-light'
                            : isDone
                              ? 'bg-primary text-white'
                              : 'bg-neutral text-text-muted'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="pt-1.5">
                        <p
                          className={`text-sm font-medium ${
                            isActive || isDone ? 'text-primary' : 'text-text-muted'
                          }`}
                        >
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
                  {trackingTimeline.map((step, i) => {
                    const Icon = timelineIcons[step.icon]
                    const isDone = step.done
                    const isActive = step.active
                    return (
                      <div key={step.key} className="flex flex-1 flex-col items-center">
                        <div className="flex w-full items-center">
                          {i > 0 && (
                            <div
                              className={`h-0.5 flex-1 ${trackingTimeline[i - 1].done ? 'bg-primary' : 'border-t border-dashed border-gray-300'}`}
                            />
                          )}
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              isActive
                                ? 'bg-primary text-white ring-4 ring-primary-light'
                                : isDone
                                  ? 'bg-primary text-white'
                                  : 'bg-neutral text-text-muted'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          {i < trackingTimeline.length - 1 && (
                            <div
                              className={`h-0.5 flex-1 ${isDone && !isActive ? 'bg-primary' : 'border-t border-dashed border-gray-300'}`}
                            />
                          )}
                        </div>
                        <p
                          className={`mt-2 text-center text-xs font-medium ${
                            isActive || isDone ? 'text-primary' : 'text-text-muted'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Live map */}
            <div className="relative overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm">
              <div className="relative h-64 bg-gradient-to-br from-green-50 via-blue-50 to-primary-light sm:h-80">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200">
                  <path
                    d="M 40 160 Q 120 40 200 80 T 360 60"
                    fill="none"
                    stroke="#6c5dd3"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle cx="40" cy="160" r="8" fill="#6c5dd3" />
                  <circle cx="360" cy="60" r="8" fill="#ffc107" />
                </svg>
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 rounded-xl bg-white/95 px-3 py-3 shadow-md backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-4 sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:px-4">
                  <HiOutlineMapPin className="h-5 w-5 shrink-0 text-amber-700" />
                  <p className="flex-1 text-xs font-medium text-text-dark sm:text-sm">{data.mapMessage}</p>
                  <div className="flex -space-x-1">
                    <span className="h-6 w-6 rounded-full bg-primary ring-2 ring-white" />
                    <span className="h-6 w-6 rounded-full bg-secondary ring-2 ring-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Delivery partner */}
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h2 className="font-bold text-text-dark">Delivery Partner</h2>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={data.courier.avatar}
                  alt={data.courier.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-text-dark">{data.courier.name}</p>
                  <p className="text-xs text-text-muted">
                    ★ {data.courier.rating} ({data.courier.deliveries} deliveries)
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-neutral-border py-2.5 text-sm font-semibold text-text-dark hover:bg-neutral"
                >
                  <HiOutlinePhone className="h-4 w-4" />
                  Call
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-neutral-border py-2.5 text-sm font-semibold text-text-dark hover:bg-neutral"
                >
                  <HiOutlineChatBubbleLeftRight className="h-4 w-4" />
                  Message
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between font-bold text-text-dark"
              >
                Order Summary
                <HiOutlineChevronDown className="h-5 w-5 text-text-muted" />
              </button>
              <p className="mt-1 text-sm text-text-muted">
                {data.itemCount} items • ${data.total.toFixed(2)}
              </p>
              <div className="mt-4 space-y-3">
                {data.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-dark">{item.name}</p>
                      <p className="text-xs text-text-muted">
                        {item.qty} • ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-neutral-border pt-4 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span>${data.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-tertiary">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-primary">
                  <span>Total</span>
                  <span>${data.total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-neutral py-2.5 text-sm font-semibold text-text-dark hover:bg-gray-200"
              >
                View Full Receipt
              </button>
            </div>

            {/* Support */}
            <div className="rounded-xl bg-primary p-5 text-white">
              <p className="text-sm leading-relaxed">
                Need help with your order? Our support team is available 24/7 for any questions.
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-primary hover:bg-primary-light"
              >
                Contact Support
              </button>
            </div>

            <Link
              to="/dashboard/customer/orders"
              className="block text-center text-sm font-semibold text-primary hover:text-primary-dark"
            >
              ← Back to Order History
            </Link>
          </div>
        </div>
      </div>

      <CustomerFooter />
    </div>
  )
}
