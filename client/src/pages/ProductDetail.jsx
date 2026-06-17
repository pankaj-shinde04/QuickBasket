import { useState, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineLockClosed,
} from 'react-icons/hi2'
import { FaStar, FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP } from 'react-icons/fa'
import AddToCartButton from '../components/AddToCartButton'
import CategoryRow from '../components/home/CategoryRow'
import TrendingProducts from '../components/home/TrendingProducts'
import { getProductById, productDetailTabs } from '../data/productDetailData'

function StarRating({ rating, showCount, reviewCount }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
            i < rating ? 'text-secondary' : 'text-gray-200'
          }`}
        />
      ))}
      {showCount && reviewCount !== undefined && (
        <span className="ml-1 text-sm text-text-muted">({reviewCount})</span>
      )}
    </div>
  )
}

export default function ProductDetail() {
  const { productId } = useParams()
  const product = getProductById(productId)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedWeight, setSelectedWeight] = useState(product?.defaultWeight ?? '400gm')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('Additional information')
  const mainImageRef = useRef(null)

  if (!product) {
    return <Navigate to="/" replace />
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  )

  return (
    <div className="bg-white">
      <div className="page-container py-4 sm:py-6">
        <CategoryRow />

        {/* Breadcrumb */}
        <nav className="mt-6 text-sm text-text-muted">
          <Link to="/" className="hover:text-primary">Home</Link>
          {' / '}
          <Link to="/" className="hover:text-primary">Shop</Link>
          {' / '}
          <span className="text-text-dark">{product.shortName}</span>
        </nav>

        {/* Product main */}
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-neutral-border bg-neutral p-6 sm:p-10">
              <button
                type="button"
                className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-text-muted shadow-sm hover:text-red-500"
                aria-label="Add to wishlist"
              >
                <HiOutlineHeart className="h-5 w-5" />
              </button>
              <img
                ref={mainImageRef}
                data-product-image
                src={product.images[selectedImage]}
                alt={product.name}
                className="mx-auto h-64 w-full object-contain sm:h-80 lg:h-96"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`overflow-hidden rounded-xl border-2 bg-neutral p-2 transition-colors ${
                    selectedImage === i ? 'border-primary' : 'border-transparent hover:border-neutral-border'
                  }`}
                >
                  <img src={img} alt="" className="h-16 w-full object-contain sm:h-20" />
                </button>
              ))}
            </div>
          </div>

          {/* Purchase info */}
          <div>
            <p className="text-sm font-medium text-tertiary">
              available only: {product.stockLeft}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-text-dark sm:text-3xl lg:text-4xl">
              {product.shortName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StarRating rating={product.rating} showCount reviewCount={product.reviewCount} />
              <span className="text-sm text-text-muted">|</span>
              <span className="text-sm text-text-muted">{product.productType}</span>
            </div>

            {/* Weight selector */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-text-dark">Select Weight</p>
              <div className="flex flex-wrap gap-2">
                {product.weights.map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    onClick={() => setSelectedWeight(weight)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedWeight === weight
                        ? 'border-primary bg-primary text-white'
                        : 'border-neutral-border text-text-muted hover:border-primary hover:text-primary'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-lg text-text-muted line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="text-3xl font-extrabold text-primary sm:text-4xl">
                ${product.price.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">
                  -{discount}%
                </span>
              )}
            </div>

            <p className="mt-2 text-sm font-medium text-text-muted">
              available only: {product.stockLeft}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-neutral-border">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-l-full px-4 py-2.5 hover:bg-neutral"
                  aria-label="Decrease quantity"
                >
                  <HiOutlineMinus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="rounded-r-full px-4 py-2.5 hover:bg-neutral"
                  aria-label="Increase quantity"
                >
                  <HiOutlinePlus className="h-4 w-4" />
                </button>
              </div>
              <AddToCartButton
                image={product.images[selectedImage]}
                imageRef={mainImageRef}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark sm:flex-none sm:px-10 sm:text-base"
              >
                <HiOutlineShoppingBag className="h-5 w-5" />
                Add to cart
              </AddToCartButton>
            </div>

            {/* Social share */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-sm text-text-muted">Share:</span>
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-border text-text-muted hover:border-primary hover:text-primary"
                  aria-label="Share"
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-6 space-y-2 border-t border-neutral-border pt-6 text-sm text-text-muted">
              <p>✓ {product.returnsNote}</p>
              <p>✓ {product.dispatchNote}</p>
            </div>

            {/* Secure checkout */}
            <div className="mt-6 rounded-xl border border-neutral-border bg-neutral p-4 sm:p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-dark">
                <HiOutlineLockClosed className="h-4 w-4 text-primary" />
                Guaranteed safe &amp; secure checkout
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['VISA', 'MC', 'PayPal', 'Amex', 'GPay'].map((method) => (
                  <span
                    key={method}
                    className="rounded border border-neutral-border bg-white px-3 py-1.5 text-xs font-bold text-text-muted"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 sm:mt-16">
          <div className="flex gap-1 overflow-x-auto border-b border-neutral-border">
            {productDetailTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors sm:px-6 sm:text-base ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text-dark'
                }`}
              >
                {tab}
                {tab === 'Reviews' && ` (${product.reviewCount})`}
              </button>
            ))}
          </div>

          <div className="py-6 sm:py-8">
            {activeTab === 'Description' && (
              <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-text-muted sm:text-base">
                <p>{product.longDescription}</p>
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'Additional information' && (
              <table className="w-full max-w-lg text-sm">
                <tbody>
                  {Object.entries(product.additionalInfo).map(([key, value]) => (
                    <tr key={key} className="border-b border-neutral-border">
                      <td className="py-3 pr-6 font-semibold text-text-dark">{key}</td>
                      <td className="py-3 text-text-muted">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'Reviews' && (
              <div className="max-w-2xl space-y-6">
                {product.reviews.length === 0 ? (
                  <p className="text-sm text-text-muted">No reviews yet.</p>
                ) : (
                  product.reviews.map((review) => (
                    <article key={review.id} className="border-b border-neutral-border pb-6">
                      <div className="flex items-center gap-3">
                        <StarRating rating={review.rating} />
                        <span className="font-semibold text-text-dark">{review.author}</span>
                        <span className="text-sm text-text-muted">{review.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-text-muted">{review.text}</p>
                    </article>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Trending */}
        <div className="mt-4 border-t border-neutral-border pt-10 sm:pt-12">
          <TrendingProducts />
        </div>
      </div>
    </div>
  )
}
