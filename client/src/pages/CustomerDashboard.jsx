import { Link } from 'react-router-dom'
import { HiOutlineHeart, HiOutlinePlus, HiOutlineSparkles } from 'react-icons/hi2'
import { FaStar } from 'react-icons/fa'
import AddToCartButton from '../components/AddToCartButton'
import { useAuth } from '../context/AuthContext'
import { quickReorderProducts, rewardsData } from '../data/customerData'
import { getTrackingPath, ACTIVE_TRACKING_ORDER_ID } from '../data/customerOrders'

export default function CustomerDashboard() {
  const { user } = useAuth()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Top row: Welcome + Rewards */}
      <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-5 lg:grid-cols-3">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-primary-light p-5 sm:p-6 lg:col-span-2 lg:p-8">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-xl font-bold text-primary sm:text-2xl lg:text-3xl">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="mt-2 text-sm text-text-muted sm:mt-3 sm:text-base">
              Your next grocery delivery is scheduled for tomorrow between{' '}
              <strong className="text-text-dark">2 PM – 4 PM</strong>.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link
                to={getTrackingPath(ACTIVE_TRACKING_ORDER_ID)}
                className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Track Order
              </Link>
              <Link
                to="/dashboard/customer/orders"
                className="rounded-lg border border-primary bg-white px-5 py-2.5 text-center text-sm font-semibold text-primary hover:bg-primary-light"
              >
                View Details
              </Link>
            </div>
          </div>
          <HiOutlineSparkles className="absolute -bottom-4 -right-4 hidden h-32 w-32 text-primary/10 sm:block sm:h-40 sm:w-40" />
        </div>

        {/* Rewards card */}
        <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <FaStar className="h-5 w-5 text-secondary" />
            <h2 className="font-bold text-text-dark">QuickBasket Rewards</h2>
          </div>
          <p className="text-2xl font-bold text-primary sm:text-3xl">{rewardsData.points.toLocaleString()} pts</p>
          <p className="mt-1 text-sm text-text-muted">
            {rewardsData.pointsToNext} pts to next reward tier
          </p>
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs font-medium text-text-muted">
              <span>{rewardsData.currentTier}</span>
              <span>{rewardsData.nextTier}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-neutral">
              <div
                className="h-full rounded-full bg-secondary"
                style={{ width: `${rewardsData.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reorder */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
          <h2 className="text-lg font-bold text-text-dark sm:text-xl">Quick Reorder</h2>
          <Link
            to="/"
            className="shrink-0 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-4 lg:gap-5">
          {quickReorderProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative bg-neutral p-3 sm:p-4" data-product-image>
                <button
                  type="button"
                  className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-text-muted shadow-sm hover:text-red-500 sm:right-3 sm:top-3"
                  aria-label="Add to favorites"
                >
                  <HiOutlineHeart className="h-4 w-4" />
                </button>
                <img
                  src={product.image}
                  alt={product.name}
                  className="mx-auto h-24 w-full object-contain sm:h-28 md:h-32"
                />
              </div>
              <div className="p-3 sm:p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-tertiary">
                  {product.category}
                </span>
                <h3 className="mt-1 text-sm font-semibold text-text-dark sm:text-base">
                  {product.name}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-text-dark">
                    ${product.price.toFixed(2)}
                  </span>
                  <AddToCartButton
                    image={product.image}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-dark"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <HiOutlinePlus className="h-5 w-5" />
                  </AddToCartButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
