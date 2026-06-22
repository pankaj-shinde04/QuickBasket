import { Link } from 'react-router-dom'
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiOutlineSparkles,
} from 'react-icons/hi2'
import { FaStar } from 'react-icons/fa'
import CustomerFooter from '../../components/customer/CustomerFooter'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop'

export default function CustomerWishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  return (
    <div>
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-xs text-text-muted sm:text-sm">
          <Link to="/dashboard/customer" className="hover:text-primary">Home</Link>
          {' > '}
          <span className="text-text-dark">Wishlist</span>
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-dark sm:text-2xl lg:text-3xl">My Wishlist</h1>
            <p className="mt-1 text-sm text-text-muted">
              {items.length === 0
                ? 'Your wishlist is empty.'
                : `You have ${items.length} item${items.length === 1 ? '' : 's'} saved for later.`}
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => items.forEach((item) => addToCart(item))}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark sm:w-auto"
            >
              <HiOutlineShoppingBag className="h-5 w-5" />
              Add All to Cart
            </button>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-border bg-white py-16 text-center">
            <HiOutlineHeart className="h-16 w-16 text-neutral-border" />
            <p className="mt-4 font-medium text-text-muted">Nothing saved yet</p>
            <Link
              to="/"
              className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Explore Products
            </Link>
          </div>
        )}

        {/* Wishlist grid */}
        {items.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:mt-8 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm"
              >
                <div className="relative bg-neutral p-4">
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <HiOutlineHeart className="h-4 w-4 fill-primary" />
                  </button>
                  <img
                    src={item.image || PLACEHOLDER}
                    alt={item.name}
                    onError={(e) => { e.target.src = PLACEHOLDER }}
                    className="mx-auto h-36 w-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    {item.category}
                  </span>
                  <h3 className="mt-1 font-semibold text-text-dark line-clamp-1">{item.name}</h3>
                  <div className="mt-1 flex items-center gap-1">
                    <FaStar className="h-3.5 w-3.5 text-secondary" />
                    <span className="text-xs text-text-muted">New</span>
                  </div>
                  <p className="mt-2 font-bold text-text-dark">
                    ₹{Number(item.price).toFixed(2)}
                    <span className="text-sm font-normal text-text-muted"> / {item.unit || 'ea'}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    disabled={item.stock === 0}
                    className="mt-3 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-40"
                  >
                    {item.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id)}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Promo banner */}
        <section className="mt-12">
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 sm:p-10">
            <div className="relative z-10 max-w-md">
              <h3 className="text-2xl font-bold text-white">Weekly Specials</h3>
              <p className="mt-2 text-sm text-white/80">
                Fresh picks from local shops — save on seasonal products this week.
              </p>
              <Link
                to="/"
                className="mt-5 inline-block rounded-lg bg-secondary px-5 py-2.5 text-sm font-bold text-text-dark hover:bg-secondary-dark"
              >
                Explore Deals
              </Link>
            </div>
            <HiOutlineSparkles className="absolute -bottom-6 -right-6 h-40 w-40 text-white/10" />
          </div>
        </section>
      </div>

      <CustomerFooter variant="extended" />
    </div>
  )
}
