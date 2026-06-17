import { Link } from 'react-router-dom'
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlineTrash } from 'react-icons/hi2'
import { FaStar } from 'react-icons/fa'
import { HiOutlineSparkles } from 'react-icons/hi2'
import CustomerFooter from '../../components/customer/CustomerFooter'
import { wishlistItems } from '../../data/customerShopData'

export default function CustomerWishlist() {
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
              You have {wishlistItems.length} items saved for later.
            </p>
          </div>
          <Link
            to="/dashboard/customer/cart"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark sm:w-auto"
          >
            <HiOutlineShoppingBag className="h-5 w-5" />
            Add All to Cart
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:mt-8 sm:gap-5">
          {wishlistItems.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm"
            >
              <div className="relative bg-neutral p-4">
                <button
                  type="button"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <HiOutlineHeart className="h-4 w-4 fill-primary" />
                </button>
                {item.badge && (
                  <span
                    className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
                <img
                  src={item.image}
                  alt={item.name}
                  className="mx-auto h-36 w-full object-contain"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  {item.category}
                </span>
                <h3 className="mt-1 font-semibold text-text-dark">{item.name}</h3>
                <div className="mt-1 flex items-center gap-1">
                  <FaStar className="h-3.5 w-3.5 text-secondary" />
                  <span className="text-xs text-text-muted">
                    {item.rating} ({item.reviews})
                  </span>
                </div>
                <p className="mt-2 font-bold text-text-dark">
                  ${item.price.toFixed(2)}
                  <span className="text-sm font-normal text-text-muted">{item.unit}</span>
                </p>
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Move to Cart
                </button>
                <button
                  type="button"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* You might also like */}
        <section className="mt-12">
          <h2 className="mb-5 text-xl font-bold text-text-dark">You might also like</h2>
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 sm:p-10">
            <div className="relative z-10 max-w-md">
              <h3 className="text-2xl font-bold text-white">Weekly Organic Specials</h3>
              <p className="mt-2 text-sm text-white/80">
                Fresh picks from local farms — save up to 20% on seasonal produce this week.
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
