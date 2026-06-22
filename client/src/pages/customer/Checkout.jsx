import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineDocumentText,
  HiOutlineCreditCard,
  HiOutlineArrowRight,
  HiOutlineLockClosed,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineShoppingBag,
} from 'react-icons/hi2'
import CustomerFooter from '../../components/customer/CustomerFooter'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { apiRequest, getAuthToken } from '../../services/api'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop'

export default function CustomerCheckout() {
  const { items, subtotal, serviceFee, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const freeDelivery = subtotal >= 500
  const deliveryFee = freeDelivery ? 0 : 49
  const grandTotal = subtotal + serviceFee + deliveryFee

  const [form, setForm] = useState({
    street: '',
    city: '',
    postal: '',
    phone: '',
    notes: '',
  })
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    if (!form.street || !form.city) {
      setError('Please fill in your delivery address.')
      return
    }

    setPlacing(true)
    setError(null)

    try {
      const token = getAuthToken()
      const res = await apiRequest('/orders', {
        method: 'POST',
        token,
        body: {
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            image: i.image || '',
            category: i.category || '',
            price: i.price,
            qty: i.qty,
            unit: i.unit || '',
          })),
          deliveryAddress: {
            street: form.street,
            city: form.city,
            postal: form.postal,
          },
          phone: form.phone,
          notes: form.notes,
          subtotal,
          deliveryFee,
          serviceFee,
          total: grandTotal,
          paymentMethod: 'COD',
        },
      })

      clearCart()
      setSuccess(res.data.order.displayId)
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <HiOutlineCheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-text-dark">Order Placed!</h1>
        <p className="mt-2 text-sm text-text-muted">
          Your order <span className="font-semibold text-primary">#{success}</span> has been placed successfully.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/dashboard/customer/orders"
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            View My Orders
            <HiOutlineArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="rounded-lg border border-neutral-border px-5 py-2.5 text-sm font-semibold text-text-muted hover:bg-neutral"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <HiOutlineShoppingBag className="h-14 w-14 text-neutral-border" />
        <p className="mt-4 font-semibold text-text-dark">Your cart is empty</p>
        <Link to="/" className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-xl font-bold text-text-dark sm:text-2xl lg:text-3xl">Checkout</h1>
        <p className="mt-1 text-sm text-text-muted">Finish your order and we'll handle the rest.</p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left — forms */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Address */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <HiOutlineMapPin className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-text-dark">Delivery Address</h2>
              </div>
              <div className="space-y-4 rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">Street Address *</label>
                  <input
                    required
                    value={form.street}
                    onChange={(e) => update('street', e.target.value)}
                    placeholder="e.g. 12 MG Road, Koramangala"
                    className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">City *</label>
                    <input
                      required
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">Postal Code</label>
                    <input
                      value={form.postal}
                      onChange={(e) => update('postal', e.target.value)}
                      placeholder="e.g. 560034"
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <HiOutlinePhone className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-text-dark">Contact Details</h2>
              </div>
              <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
                <label className="mb-1.5 block text-sm font-medium text-text-muted">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-lg border border-neutral-border bg-neutral px-3 text-sm text-text-muted">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="98765 43210"
                    className="flex-1 rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </section>

            {/* Instructions */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <HiOutlineDocumentText className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-text-dark">Delivery Instructions</h2>
              </div>
              <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
                <label className="mb-1.5 block text-sm font-medium text-text-muted">Special Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="e.g. 'Leave at the front door', 'Gate code is 1234'"
                  className="w-full resize-none rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </section>

            {/* Payment */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <HiOutlineCreditCard className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-text-dark">Payment Method</h2>
              </div>
              <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 rounded-lg border-2 border-primary bg-primary-light p-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-primary">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-dark">Cash on Delivery (COD)</p>
                    <p className="text-xs text-text-muted">Pay when your order arrives</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right — order summary */}
          <div className="h-fit lg:sticky lg:top-6">
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-bold text-primary">Order Summary</h2>
              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image || PLACEHOLDER}
                      alt={item.name}
                      onError={(e) => { e.target.src = PLACEHOLDER }}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-dark">{item.name}</p>
                      <p className="text-xs text-text-muted">
                        {item.qty} × ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-text-dark">
                      ₹{(Number(item.price) * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-neutral-border pt-4 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Delivery Fee</span>
                  <span className={freeDelivery ? 'font-semibold text-tertiary' : ''}>
                    {freeDelivery ? 'Free' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Service Fee</span>
                  <span>₹{serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-border pt-3 text-xl font-bold">
                  <span className="text-text-dark">Total</span>
                  <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placing}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                {placing ? (
                  <>
                    <HiOutlineArrowPath className="h-5 w-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <HiOutlineArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-text-muted">
                By placing your order, you agree to QuickBasket's{' '}
                <a href="#" className="text-primary">Terms of Service</a>.
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-muted">
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
