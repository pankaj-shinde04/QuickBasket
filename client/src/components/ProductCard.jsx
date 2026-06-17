import { Link } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import AddToCartButton from './AddToCartButton'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${
            i < rating ? 'text-secondary' : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-neutral-border bg-white transition-shadow hover:shadow-lg lg:rounded-2xl">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-neutral p-4 sm:p-5" data-product-image>
          <img
            src={product.image}
            alt={product.name}
            className="mx-auto h-36 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-40 lg:h-44"
          />
        </div>
        <div className="p-4 sm:p-5">
          <span className="inline-block rounded-full bg-tertiary-light px-2.5 py-0.5 text-xs font-semibold text-tertiary">
            {product.category}
          </span>
          <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-text-dark sm:text-base">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-primary sm:text-base">
              {product.price}
              {product.priceMax && (
                <span className="font-normal text-text-muted"> – {product.priceMax}</span>
              )}
            </p>
            <StarRating rating={product.rating} />
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <AddToCartButton
          image={product.image}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-border py-2.5 text-sm font-semibold text-text-dark transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
        >
          <HiOutlineShoppingBag className="h-4 w-4" />
          Add to cart
        </AddToCartButton>
      </div>
    </article>
  )
}

export { StarRating }
