import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineFunnel,
  HiOutlineArrowDownTray,
  HiOutlineShoppingCart,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2'
import CustomerFooter from '../../components/customer/CustomerFooter'
import {
  customerOrders,
  orderFilters,
  customerOrderStatusStyles,
  getTrackingPath,
} from '../../data/customerOrders'

export default function CustomerOrderHistory() {
  const [activeFilter, setActiveFilter] = useState('All Orders')
  const [page, setPage] = useState(1)

  return (
    <div>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl font-bold text-text-dark sm:text-2xl lg:text-3xl">Order History</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage and track your organic deliveries.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {orderFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'border border-neutral-border bg-white text-text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-neutral-border bg-white px-4 py-2 text-sm font-semibold text-text-muted hover:border-primary hover:text-primary"
          >
            <HiOutlineFunnel className="h-4 w-4" />
            More Filters
          </button>
        </div>

        {/* Order cards */}
        <div className="space-y-4">
          {customerOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-neutral-border bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-6 md:gap-10">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Order Placed
                    </p>
                    <p className="mt-1 text-sm font-medium text-text-dark">{order.placedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Total Amount
                    </p>
                    <p className="mt-1 text-sm font-bold text-primary">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Order ID
                    </p>
                    <p className="mt-1 text-sm font-medium text-text-dark">#{order.displayId}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${customerOrderStatusStyles[order.status]}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {order.status}
                  </span>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-text-muted hover:bg-neutral"
                    aria-label="Download receipt"
                  >
                    <HiOutlineArrowDownTray className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4 border-t border-neutral-border pt-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:border-0 sm:pt-0">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {order.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ))}
                  {order.moreCount > 0 && (
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral text-sm font-semibold text-text-muted">
                      +{order.moreCount}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  <Link
                    to={`/dashboard/customer/orders/${order.displayId}`}
                    className="text-sm font-semibold text-primary hover:text-primary-dark"
                  >
                    View Details
                  </Link>
                  {order.trackable && (
                    <Link
                      to={getTrackingPath(order.displayId)}
                      className="text-sm font-semibold text-primary hover:text-primary-dark"
                    >
                      Track Order
                    </Link>
                  )}
                  {order.status === 'Cancelled' ? (
                    <button
                      type="button"
                      disabled
                      className="w-full cursor-not-allowed rounded-lg bg-neutral px-4 py-2 text-sm font-semibold text-text-muted sm:w-auto"
                    >
                      Unavailable
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-text-dark hover:bg-secondary-dark sm:w-auto"
                    >
                      <HiOutlineShoppingCart className="h-4 w-4" />
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg p-2 text-text-muted hover:bg-white disabled:opacity-40"
          >
            <HiOutlineChevronLeft className="h-5 w-5" />
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                page === p ? 'bg-primary text-white' : 'text-text-muted hover:bg-white'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(3, p + 1))}
            disabled={page === 3}
            className="rounded-lg p-2 text-text-muted hover:bg-white disabled:opacity-40"
          >
            <HiOutlineChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <CustomerFooter />
    </div>
  )
}
