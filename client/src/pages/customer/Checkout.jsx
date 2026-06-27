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
    fullName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    postal: '',
    deliveryInstructions: '',
    paymentMethod: 'COD',
  })
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    if (!form.fullName || !form.phone || !form.street || !form.city || !form.state || !form.postal) {
      setError('Please fill in all required delivery address fields.')
      return
    }

    setPlacing(true)
    setError(null)

    try {
      const token = getAuthToken()

      // If online payment, initiate Razorpay
      if (form.paymentMethod !== 'COD') {
        // Create Razorpay order
        const razorpayRes = await apiRequest('/payments/razorpay/create-order', {
          method: 'POST',
          token,
          body: {
            amount: grandTotal,
          },
        })

        const { razorpayOrder, paymentId } = razorpayRes.data

        // Get Razorpay key
        const keyRes = await apiRequest('/payments/razorpay/key', {
          method: 'GET',
          token,
        })
        const { keyId } = keyRes.data

        // Load Razorpay script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => {
          const options = {
            key: keyId,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'QuickBasket',
            description: 'Order Payment',
            order_id: razorpayOrder.id,
            handler: async function (response) {
              // Verify payment on backend
              try {
                const body = {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }

                // Create order after successful payment
                const orderBody = {
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
                    fullName: form.fullName,
                    phone: form.phone,
                    alternatePhone: form.alternatePhone,
                    email: form.email,
                    street: form.street,
                    landmark: form.landmark,
                    city: form.city,
                    state: form.state,
                    postal: form.postal,
                  },
                  deliveryInstructions: form.deliveryInstructions,
                  subtotal,
                  deliveryFee,
                  serviceFee,
                  total: grandTotal,
                  paymentMethod: form.paymentMethod,
                  paymentDetails: {
                    paymentId: paymentId,
                  },
                }

                const orderRes = await apiRequest('/orders', {
                  method: 'POST',
                  token,
                  body: orderBody,
                })

                // Verify payment
                await apiRequest('/payments/razorpay/verify', {
                  method: 'POST',
                  token,
                  body: {
                    ...body,
                    orderId: orderRes.data.order._id,
                  },
                })

                clearCart()
                setSuccess(orderRes.data.order.displayId)
              } catch (err) {
                setError(err.message || 'Payment verification failed. Please contact support.')
              } finally {
                setPlacing(false)
              }
            },
            prefill: {
              name: form.fullName,
              email: form.email,
              contact: form.phone,
            },
            theme: {
              color: '#4F46E5',
            },
            modal: {
              ondismiss: function () {
                setPlacing(false)
                setError('Payment cancelled by user.')
              },
            },
          }

          const rzp = new window.Razorpay(options)
          rzp.open()
        }
        script.onerror = () => {
          setPlacing(false)
          setError('Failed to load payment gateway. Please try again.')
        }
        document.body.appendChild(script)
      } else {
        // COD order
        const body = {
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
            fullName: form.fullName,
            phone: form.phone,
            alternatePhone: form.alternatePhone,
            email: form.email,
            street: form.street,
            landmark: form.landmark,
            city: form.city,
            state: form.state,
            postal: form.postal,
          },
          deliveryInstructions: form.deliveryInstructions,
          subtotal,
          deliveryFee,
          serviceFee,
          total: grandTotal,
          paymentMethod: 'COD',
        }

        const res = await apiRequest('/orders', {
          method: 'POST',
          token,
          body,
        })

        clearCart()
        setSuccess(res.data.order.displayId)
        setPlacing(false)
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">Full Name *</label>
                    <input
                      required
                      value={form.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">Alternate Phone</label>
                    <input
                      type="tel"
                      value={form.alternatePhone}
                      onChange={(e) => update('alternatePhone', e.target.value)}
                      placeholder="e.g. 9876543211"
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
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
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">Landmark</label>
                  <input
                    value={form.landmark}
                    onChange={(e) => update('landmark', e.target.value)}
                    placeholder="e.g. Near Central Mall"
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
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">State *</label>
                    <input
                      required
                      value={form.state}
                      onChange={(e) => update('state', e.target.value)}
                      placeholder="e.g. Karnataka"
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">Postal Code *</label>
                  <input
                    required
                    value={form.postal}
                    onChange={(e) => update('postal', e.target.value)}
                    placeholder="e.g. 560034"
                    className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  value={form.deliveryInstructions}
                  onChange={(e) => update('deliveryInstructions', e.target.value)}
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
              <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm space-y-3">
                <div
                  onClick={() => update('paymentMethod', 'COD')}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 ${
                    form.paymentMethod === 'COD'
                      ? 'border-primary bg-primary-light'
                      : 'border-neutral-border hover:border-neutral-300'
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    form.paymentMethod === 'COD' ? 'border-primary bg-primary' : 'border-neutral-border'
  }`}>
                    {form.paymentMethod === 'COD' && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-dark">Cash on Delivery (COD)</p>
                    <p className="text-xs text-text-muted">Pay when your order arrives</p>
                  </div>
                </div>

                <div
                  onClick={() => update('paymentMethod', 'UPI')}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 ${
                    form.paymentMethod === 'UPI'
                      ? 'border-primary bg-primary-light'
                      : 'border-neutral-border hover:border-neutral-300'
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    form.paymentMethod === 'UPI' ? 'border-primary bg-primary' : 'border-neutral-border'
                  }`}>
                    {form.paymentMethod === 'UPI' && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-dark">Online Payment</p>
                    <p className="text-xs text-text-muted">Pay instantly using UPI, Card, NetBanking</p>
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
