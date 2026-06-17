import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineDocumentText,
  HiOutlineCreditCard,
  HiOutlineArrowRight,
  HiOutlineLockClosed,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2'
import CustomerFooter from '../../components/customer/CustomerFooter'
import { checkoutItems, checkoutSummary } from '../../data/customerShopData'

export default function CustomerCheckout() {
  const [form, setForm] = useState({
    street: '123 Fresh Way',
    city: 'San Francisco',
    postal: '94103',
    phone: '',
    instructions: '',
  })

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  return (
    <div>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-xl font-bold text-text-dark sm:text-2xl lg:text-3xl">Checkout</h1>
        <p className="mt-1 text-sm text-text-muted">
          Finish your order and we&apos;ll handle the rest.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left — forms */}
          <div className="space-y-8 lg:col-span-2">
            {/* Delivery Address */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <HiOutlineMapPin className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-text-dark">Delivery Address</h2>
              </div>
              <div className="space-y-4 rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    Street Address
                  </label>
                  <div className="relative">
                    <input
                      value={form.street}
                      onChange={(e) => update('street', e.target.value)}
                      className="w-full rounded-lg border border-neutral-border py-2.5 pl-3 pr-28 text-sm outline-none focus:border-primary sm:pl-4 sm:pr-32"
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md bg-neutral px-2 py-1 text-[10px] font-medium text-primary sm:right-2 sm:text-xs"
                    >
                      <HiOutlineGlobeAlt className="h-3.5 w-3.5" />
                      Detect Location
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">City</label>
                    <input
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">
                      Postal Code
                    </label>
                    <input
                      value={form.postal}
                      onChange={(e) => update('postal', e.target.value)}
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <HiOutlinePhone className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-text-dark">Contact Details</h2>
              </div>
              <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
                <label className="mb-1.5 block text-sm font-medium text-text-muted">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-lg border border-neutral-border bg-neutral px-3 text-sm text-text-muted">
                    +1
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="(555) 000-0000"
                    className="flex-1 rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </section>

            {/* Instructions */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <HiOutlineDocumentText className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-text-dark">Delivery Instructions</h2>
              </div>
              <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
                <label className="mb-1.5 block text-sm font-medium text-text-muted">
                  Special Notes
                </label>
                <textarea
                  rows={3}
                  value={form.instructions}
                  onChange={(e) => update('instructions', e.target.value)}
                  placeholder="e.g., 'Leave at the front door', 'Gate code is 1234'"
                  className="w-full resize-none rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </section>

            {/* Payment */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <HiOutlineCreditCard className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-text-dark">Payment Method</h2>
                <span className="rounded-full bg-neutral px-2.5 py-0.5 text-xs font-semibold text-text-muted">
                  Coming Soon
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-12 rounded-lg bg-neutral" />
                ))}
              </div>
            </section>
          </div>

          {/* Right — order summary */}
          <div className="h-fit lg:sticky lg:top-6">
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-bold text-primary">Order Summary</h2>
              <div className="mt-4 space-y-3">
                {checkoutItems.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-dark">{item.name}</p>
                      <p className="text-xs text-text-muted">
                        {item.qty} x ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-text-dark">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-neutral-border pt-4 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span>${checkoutSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-tertiary">Free</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Service Fee</span>
                  <span>${checkoutSummary.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-text-dark">Total</span>
                  <span className="text-primary">${checkoutSummary.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark"
              >
                Place Order
                <HiOutlineArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-3 text-center text-xs text-text-muted">
                By placing your order, you agree to QuickBasket&apos;s{' '}
                <a href="#" className="text-primary">Terms of Service</a>.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted">
                <HiOutlineLockClosed className="h-4 w-4" />
                SECURE SSL CHECKOUT
              </div>
            </div>

            <Link
              to="/dashboard/customer/cart"
              className="mt-4 block text-center text-sm font-semibold text-primary hover:text-primary-dark"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>

      <CustomerFooter variant="simple" />
    </div>
  )
}
