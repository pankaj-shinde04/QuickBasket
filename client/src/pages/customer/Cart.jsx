import { Link } from 'react-router-dom'
import {
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineArrowRight,
  HiOutlineShoppingCart,
  HiOutlineInformationCircle,
} from 'react-icons/hi2'
import CustomerFooter from '../../components/customer/CustomerFooter'
import { useCart } from '../../context/CartContext'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop'

export default function CustomerCart() {
  const { items, setQty, removeFromCart, subtotal, serviceFee, total, cartCount } = useCart()
  const freeDelivery = subtotal >= 500

  if (items.length === 0) {
    return (
      <div>
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
          <HiOutlineShoppingCart className="h-16 w-16 text-neutral-border" />
          <h1 className="mt-4 text-xl font-bold text-text-dark">Your cart is empty</h1>
          <p className="mt-2 text-sm text-text-muted">Looks like you haven't added anything yet.</p>
          <Link
            to="/"
            className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Browse Products
          </Link>
        </div>
        <CustomerFooter variant="simple" />
      </div>
    )
  }

  return (
    <div>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-text-dark sm:text-3xl">
          Your Cart{' '}
          <span className="text-base font-normal text-text-muted">({cartCount} items)</span>
        </h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5 ${
                    i < items.length - 1 ? 'border-b border-neutral-border' : ''
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    <img
                      src={item.image || PLACEHOLDER}
                      alt={item.name}
                      onError={(e) => { e.target.src = PLACEHOLDER }}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-20 sm:w-20"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-tertiary">
                        {item.category}
                      </span>
                      <h3 className="mt-0.5 font-semibold text-text-dark line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-text-muted">
                        ₹{Number(item.price).toFixed(2)} / {item.unit || 'ea'}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                    {/* Qty controls */}
                    <div className="flex items-center rounded-full bg-neutral">
                      <button
                        type="button"
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="rounded-full p-2 hover:bg-gray-200"
                      >
                        <HiOutlineMinus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(item.id, item.qty + 1)}
                        disabled={item.qty >= (item.stock ?? 999)}
                        className="rounded-full p-2 hover:bg-gray-200 disabled:opacity-40"
                      >
                        <HiOutlinePlus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="w-20 text-right font-bold text-primary">
                      ₹{(Number(item.price) * item.qty).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
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
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Delivery Fee</span>
                <span className={freeDelivery ? 'font-semibold text-tertiary' : ''}>
                  {freeDelivery ? 'Free' : '₹49.00'}
                </span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Service Fee</span>
                <span>₹{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-border pt-3 text-lg font-bold">
                <span className="text-text-dark">Total</span>
                <span className="text-primary">₹{(total + (freeDelivery ? 0 : 49)).toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/dashboard/customer/checkout"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark"
            >
              Proceed to Checkout
              <HiOutlineArrowRight className="h-5 w-5" />
            </Link>

            {freeDelivery ? (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary-light p-3 text-xs text-primary">
                <HiOutlineInformationCircle className="mt-0.5 h-4 w-4 shrink-0" />
                You've unlocked Free Delivery on this order!
              </div>
            ) : (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-neutral p-3 text-xs text-text-muted">
                <HiOutlineInformationCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Add ₹{(500 - subtotal).toFixed(2)} more to unlock Free Delivery.
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomerFooter variant="simple" />
    </div>
  )
}
