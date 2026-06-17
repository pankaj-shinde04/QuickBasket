import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineTrash,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineArrowRight,
  HiOutlineInformationCircle,
  HiOutlineBookmark,
  HiOutlineShoppingCart,
} from 'react-icons/hi2'
import CustomerFooter from '../../components/customer/CustomerFooter'
import { cartItems as initialCart, savedForLater, cartSummary } from '../../data/customerShopData'

export default function CustomerCart() {
  const [items, setItems] = useState(initialCart)
  const [promo, setPromo] = useState('')

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        ),
    )
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const lineTotal = (item) => item.price * item.quantity

  return (
    <div>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-text-dark sm:text-3xl">Your Shopping Cart</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:p-5 ${
                    i < items.length - 1 ? 'border-b border-neutral-border' : ''
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-20 sm:w-20"
                    />
                    <div className="min-w-0 flex-1">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${item.categoryColor}`}
                    >
                      {item.category}
                    </span>
                    <h3 className="mt-1 font-semibold text-text-dark">{item.name}</h3>
                    <p className="text-sm text-text-muted">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                    <div className="flex items-center rounded-full bg-neutral">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="rounded-full p-2 hover:bg-gray-200"
                      >
                        <HiOutlineMinus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="rounded-full p-2 hover:bg-gray-200"
                      >
                        <HiOutlinePlus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="w-16 text-right font-bold text-primary">
                      ${lineTotal(item).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <HiOutlineTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-text-dark">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal ({cartSummary.itemCount} items)</span>
                <span>${cartSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Delivery Fee</span>
                <span className="font-semibold text-tertiary">Free</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Service Fee</span>
                <span>${cartSummary.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-border pt-3 text-lg font-bold">
                <span className="text-text-dark">Total</span>
                <span className="text-primary">${cartSummary.total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/dashboard/customer/checkout"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark"
            >
              Proceed to Checkout
              <HiOutlineArrowRight className="h-5 w-5" />
            </Link>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary-light p-3 text-xs text-primary">
              <HiOutlineInformationCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Congratulations! You&apos;ve unlocked Free Delivery on this order.
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                Promo Code
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 rounded-lg border border-neutral-border px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-text-dark hover:bg-secondary-dark"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved for later */}
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <HiOutlineBookmark className="h-5 w-5 text-text-muted" />
            <h2 className="text-lg font-bold text-text-dark">Saved for Later</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {savedForLater.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-neutral-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-text-dark">{item.name}</h3>
                    <p className="text-sm text-text-muted">{item.description}</p>
                    <p className="mt-1 text-sm font-bold text-primary">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1 rounded-lg border border-primary py-2 text-sm font-semibold text-primary hover:bg-primary-light sm:w-auto sm:border-0 sm:py-0 sm:hover:bg-transparent"
                >
                  <HiOutlineShoppingCart className="h-4 w-4" />
                  Move to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CustomerFooter variant="simple" />
    </div>
  )
}
