import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlinePlus } from 'react-icons/hi2'
import { FaStar } from 'react-icons/fa'
import AddToCartButton from '../AddToCartButton'
import { apiRequest } from '../../services/api'

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating = 4 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${i < rating ? 'text-secondary' : 'text-gray-200'}`}
        />
      ))}
      <span className="ml-1 text-xs text-text-muted">({rating})</span>
    </div>
  )
}

function Countdown({ countdown }) {
  const boxes = [
    { label: 'd', value: countdown.days },
    { label: 'h', value: countdown.hours },
    { label: 'm', value: countdown.minutes },
    { label: 's', value: countdown.seconds },
  ]
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-neutral-border pt-3">
      <div className="flex gap-1">
        {boxes.map((box) => (
          <span
            key={box.label}
            className="flex h-7 w-7 items-center justify-center rounded bg-neutral text-xs font-bold text-text-dark sm:h-8 sm:w-8"
          >
            {String(box.value).padStart(2, '0')}
          </span>
        ))}
      </div>
      <span className="text-[10px] text-text-muted sm:text-xs">Remains until end of offer</span>
    </div>
  )
}

function SideProductCard({ product, showDivider, countdown }) {
  const discountPct =
    product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0
  const displayPrice = `₹${product.discountPrice ?? product.price}`
  const originalPrice = product.discountPrice ? `₹${product.price}` : null

  return (
    <div className={showDivider ? 'border-b border-neutral-border pb-5' : ''}>
      <div className="relative flex gap-3 sm:gap-4">
        {discountPct > 0 && (
          <span className="absolute -left-1 -top-1 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white sm:h-10 sm:w-10 sm:text-xs">
            {discountPct}%
          </span>
        )}
        <button
          type="button"
          className="absolute right-0 top-0 z-10 text-text-muted hover:text-red-500"
          aria-label="Add to wishlist"
        >
          <HiOutlineHeart className="h-4 w-4" />
        </button>

        <div className="flex w-24 shrink-0 items-center justify-center sm:w-28">
          <img
            src={product.image || 'https://placehold.co/200x200?text=Product'}
            alt={product.name}
            className="h-20 w-full object-contain sm:h-24"
            onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=Product' }}
          />
        </div>

        <div className="min-w-0 flex-1 pr-5">
          <h3 className="text-sm font-bold leading-snug text-text-dark sm:text-base line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-1">
            <StarRating rating={4} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base font-bold text-red-500 sm:text-lg">{displayPrice}</span>
            {originalPrice && (
              <span className="text-xs text-text-muted line-through sm:text-sm">
                {originalPrice}
              </span>
            )}
          </div>
          <AddToCartButton
            image={product.image}
            className="mt-2 flex w-full max-w-[180px] items-center justify-between rounded-full border border-neutral-border px-3 py-1.5 text-xs font-semibold text-text-dark transition-colors hover:border-primary hover:text-primary sm:text-sm"
          >
            Add to cart
            <HiOutlinePlus className="h-4 w-4" />
          </AddToCartButton>
        </div>
      </div>
      <Countdown countdown={countdown} />
    </div>
  )
}

function FeaturedCard({ product }) {
  const stockPct = product.stock > 0 ? Math.min(Math.round((product.stock / 50) * 100), 100) : 0

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-primary bg-white shadow-sm">
      <Link to={`/product/${product.id}`} className="block transition-shadow hover:shadow-md">
        <div className="relative bg-neutral px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute right-4 top-4 text-text-muted hover:text-red-500 sm:right-6 sm:top-6"
            aria-label="Add to wishlist"
          >
            <HiOutlineHeart className="h-5 w-5" />
          </button>
          <img
            src={product.image || 'https://placehold.co/400x400?text=Product'}
            alt={product.name}
            className="mx-auto h-44 w-full object-contain sm:h-52 lg:h-56"
            onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Product' }}
          />
        </div>

        <div className="px-5 pt-4 sm:px-8">
          <StarRating rating={4} />
          <h3 className="mt-2 text-base font-bold leading-snug text-text-dark sm:text-lg line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-2 text-xl font-extrabold text-text-dark sm:text-2xl">
            ₹{product.discountPrice ?? product.price}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-text-muted sm:text-sm line-clamp-2">
            {product.description || 'Premium quality product.'}
          </p>

          <div className="mt-5">
            <p className="text-xs text-text-muted">
              {product.stock <= 10 ? 'Running low – order soon!' : 'Available in stock'}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                style={{ width: `${stockPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-sm font-bold text-text-dark">
              {product.stock > 0 ? `Available: ${product.stock} items` : 'Out of stock'}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-6 sm:px-8 sm:pb-8">
        <AddToCartButton
          image={product.image}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark sm:text-base"
        >
          <HiOutlineShoppingBag className="h-5 w-5" />
          Add to cart
        </AddToCartButton>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-neutral-border bg-white">
      <div className="h-52 bg-neutral" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded bg-neutral" />
        <div className="h-4 w-1/2 rounded bg-neutral" />
        <div className="h-8 rounded bg-neutral" />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BestSellers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Live countdown timer
  const [countdown, setCountdown] = useState({ days: 2, hours: 12, minutes: 30, seconds: 0 })
  const timerRef = useRef(null)

  useEffect(() => {
    // Fetch from dedicated best-sellers endpoint
    const fetchProducts = async () => {
      try {
        const res = await apiRequest('/public/products/best-sellers?limit=6', { method: 'GET' })
        setProducts(res.data?.products || [])
      } catch (err) {
        console.error('Failed to fetch best sellers:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Countdown timer (counts down from initial state)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        if (days < 0) return { days: 2, hours: 12, minutes: 30, seconds: 0 } // reset
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const leftProducts = products.slice(0, 3)
  const rightProducts = products.slice(3, 6)

  if (loading) {
    return (
      <section>
        <div className="mb-5 sm:mb-6 lg:mb-8">
          <h2 className="text-xl font-bold text-text-dark sm:text-2xl lg:text-3xl">Best Sellers</h2>
          <p className="mt-1 text-sm text-text-muted sm:text-base">
            Don&apos;t miss this opportunity at a special discount just for this week.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)_1fr] lg:gap-5 xl:gap-8">
          <div className="hidden space-y-5 lg:block">
            {Array.from({ length: 3 }, (_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-neutral" />)}
          </div>
          <SkeletonCard />
          <div className="hidden space-y-5 lg:block">
            {Array.from({ length: 3 }, (_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-neutral" />)}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section>
      <div className="mb-5 sm:mb-6 lg:mb-8">
        <h2 className="text-xl font-bold text-text-dark sm:text-2xl lg:text-3xl">Best Sellers</h2>
        <p className="mt-1 text-sm text-text-muted sm:text-base">
          Don&apos;t miss this opportunity at a special discount just for this week.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)_1fr] lg:gap-5 xl:gap-8">
        {/* Left column – desktop only */}
        <div className="hidden space-y-5 lg:block">
          {leftProducts.map((product, i) => (
            <SideProductCard
              key={product.id}
              product={product}
              countdown={countdown}
              showDivider={i < leftProducts.length - 1}
            />
          ))}
        </div>

        {/* Center featured card */}
        <div className="lg:row-span-1">
          {products[0] && <FeaturedCard product={products[0]} />}
        </div>

        {/* Right column – desktop only */}
        <div className="hidden space-y-5 lg:block">
          {rightProducts.map((product, i) => (
            <SideProductCard
              key={product.id}
              product={product}
              countdown={countdown}
              showDivider={i < rightProducts.length - 1}
            />
          ))}
        </div>

        {/* Mobile / tablet – stacked below featured */}
        <div className="space-y-5 lg:hidden">
          {products.slice(1).map((product, i) => (
            <SideProductCard
              key={product.id}
              product={product}
              countdown={countdown}
              showDivider={i < products.length - 2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
