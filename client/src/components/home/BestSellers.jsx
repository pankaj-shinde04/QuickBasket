import { Link } from 'react-router-dom'
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlinePlus } from 'react-icons/hi2'
import { FaStar } from 'react-icons/fa'
import AddToCartButton from '../AddToCartButton'
import { bestSellerFeatured, bestSellerProducts } from '../../data/mockData'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
            i < rating ? 'text-secondary' : 'text-gray-200'
          }`}
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
      <span className="text-[10px] text-text-muted sm:text-xs">
        Remains until the end of the offer
      </span>
    </div>
  )
}

function SideProductCard({ product, showDivider }) {
  return (
    <div className={showDivider ? 'border-b border-neutral-border pb-5' : ''}>
      <div className="relative flex gap-3 sm:gap-4">
        <span className="absolute -left-1 -top-1 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white sm:h-10 sm:w-10 sm:text-xs">
          {product.discount}%
        </span>
        <button
          type="button"
          className="absolute right-0 top-0 z-10 text-text-muted hover:text-red-500"
          aria-label="Add to wishlist"
        >
          <HiOutlineHeart className="h-4 w-4" />
        </button>

        <div className="flex w-24 shrink-0 items-center justify-center sm:w-28" data-product-image>
          <img
            src={product.image}
            alt={product.name}
            className="h-20 w-full object-contain sm:h-24"
          />
        </div>

        <div className="min-w-0 flex-1 pr-5">
          <h3 className="text-sm font-bold leading-snug text-text-dark sm:text-base">
            {product.name}
          </h3>
          <div className="mt-1">
            <StarRating rating={product.rating} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base font-bold text-red-500 sm:text-lg">{product.price}</span>
            <span className="text-xs text-text-muted line-through sm:text-sm">
              {product.originalPrice}
            </span>
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
      <Countdown countdown={product.countdown} />
    </div>
  )
}

function FeaturedCard() {
  const featured = bestSellerFeatured

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-primary bg-white shadow-sm">
      <Link
        to="/product/aptamil-gold"
        className="block transition-shadow hover:shadow-md"
      >
        <div className="relative bg-neutral px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute right-4 top-4 text-text-muted hover:text-red-500 sm:right-6 sm:top-6"
            aria-label="Add to wishlist"
          >
            <HiOutlineHeart className="h-5 w-5" />
          </button>
          <div data-product-image>
            <img
              src={featured.image}
              alt={featured.name}
              className="mx-auto h-44 w-full object-contain sm:h-52 lg:h-56"
            />
          </div>
        </div>

        <div className="px-5 pt-4 sm:px-8">
          <StarRating rating={featured.rating} />
          <h3 className="mt-2 text-base font-bold leading-snug text-text-dark sm:text-lg">
            {featured.name}
          </h3>
          <p className="mt-2 text-xl font-extrabold text-text-dark sm:text-2xl">{featured.price}</p>
          <p className="mt-3 text-xs leading-relaxed text-text-muted sm:text-sm">
            {featured.description}
          </p>

          <div className="mt-5">
            <p className="text-xs text-text-muted">This product is about to run out</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                style={{ width: `${featured.stockPercent}%` }}
              />
            </div>
            <p className="mt-1.5 text-sm font-bold text-text-dark">
              available only: {featured.stockLeft}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-6 sm:px-8 sm:pb-8">
        <AddToCartButton
          image={featured.image}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark sm:text-base"
        >
          <HiOutlineShoppingBag className="h-5 w-5" />
          Add to cart
        </AddToCartButton>
      </div>
    </div>
  )
}

export default function BestSellers() {
  const leftProducts = bestSellerProducts.slice(0, 3)
  const rightProducts = bestSellerProducts.slice(3, 6)

  return (
    <section>
      <div className="mb-5 sm:mb-6 lg:mb-8">
        <h2 className="text-xl font-bold text-text-dark sm:text-2xl lg:text-3xl">Best Sellers</h2>
        <p className="mt-1 text-sm text-text-muted sm:text-base">
          Don&apos;t miss this opportunity at a special discount just for this week.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)_1fr] lg:gap-5 xl:gap-8">
        {/* Left column */}
        <div className="hidden space-y-5 lg:block">
          {leftProducts.map((product, i) => (
            <SideProductCard
              key={product.id}
              product={product}
              showDivider={i < leftProducts.length - 1}
            />
          ))}
        </div>

        {/* Center featured */}
        <div className="lg:row-span-1">
          <FeaturedCard />
        </div>

        {/* Right column */}
        <div className="hidden space-y-5 lg:block">
          {rightProducts.map((product, i) => (
            <SideProductCard
              key={product.id}
              product={product}
              showDivider={i < rightProducts.length - 1}
            />
          ))}
        </div>

        {/* Mobile & tablet: stacked side cards below featured */}
        <div className="space-y-5 lg:hidden">
          {bestSellerProducts.map((product, i) => (
            <SideProductCard
              key={product.id}
              product={product}
              showDivider={i < bestSellerProducts.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
