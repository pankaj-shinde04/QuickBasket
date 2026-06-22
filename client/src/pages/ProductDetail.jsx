import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  HiOutlineShoppingBag,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineLockClosed,
  HiOutlineArrowPath,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineTruck,
} from 'react-icons/hi2'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../constants/roles'
import { apiRequest } from '../services/api'
import { getProductById as getDummyProduct } from '../data/productDetailData'
import CategoryRow from '../components/home/CategoryRow'
import TrendingProducts from '../components/home/TrendingProducts'

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop'

const TABS = ['Description', 'Additional Information']

// Normalise a dummy-data product into the same shape as an API product
function normaliseDummy(d) {
  if (!d) return null
  return {
    id: d.id,
    name: d.name,
    description: d.description || d.longDescription || '',
    category: d.category,
    brand: d.additionalInfo?.Brand || '',
    image: Array.isArray(d.images) ? d.images[0] : d.image || '',
    images: d.images || [],
    price: d.originalPrice ?? d.price,
    discountPrice: d.price !== d.originalPrice ? d.price : null,
    stock: d.stockLeft ?? 99,
    unit: d.weights?.[0] || d.unit || 'ea',
    taxable: false,
    shopName: '',
    shopLogo: '',
    additionalInfo: d.additionalInfo || {},
    returnsNote: d.returnsNote || '',
    dispatchNote: d.dispatchNote || '',
    _isDummy: true,
  }
}

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('Description')
  const [added, setAdded] = useState(false)

  const imageRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    apiRequest(`/public/products/${productId}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => {
        // API failed — fall back to local dummy data
        const dummy = normaliseDummy(getDummyProduct(productId))
        if (dummy) {
          setProduct(dummy)
        } else {
          setError('Product not found.')
        }
      })
      .finally(() => setLoading(false))
  }, [productId])

  const handleAddToCart = () => {
    if (!isAuthenticated || user?.role !== ROLES.CUSTOMER) {
      navigate('/auth')
      return
    }
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <HiOutlineArrowPath className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // ── Error / Not found ──────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-lg font-semibold text-text-dark">Product not found</p>
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>
    )
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const displayPrice = hasDiscount ? product.discountPrice : product.price
  const discount = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  const outOfStock = product.stock === 0

  return (
    <div className="bg-white">
      <div className="page-container py-4 sm:py-6">
        <CategoryRow />

        {/* Breadcrumb */}
        <nav className="mt-6 flex items-center gap-1.5 text-sm text-text-muted">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <span className="line-clamp-1 text-text-dark">{product.name}</span>
        </nav>

        {/* ── Main product grid ── */}
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">

          {/* Image */}
          <div>
            <div
              ref={imageRef}
              data-product-image
              className="overflow-hidden rounded-2xl border border-neutral-border bg-neutral p-6 sm:p-10"
            >
              <img
                src={product.image || PLACEHOLDER}
                alt={product.name}
                onError={(e) => { e.target.src = PLACEHOLDER }}
                className="mx-auto h-64 w-full object-contain sm:h-80 lg:h-96"
              />
            </div>
            {/* Shop info badge */}
            {product.shopName && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-neutral-border bg-white p-3 shadow-sm">
                {product.shopLogo ? (
                  <img src={product.shopLogo} alt={product.shopName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary text-xs font-bold">
                    {product.shopName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs text-text-muted">Sold by</p>
                  <p className="text-sm font-semibold text-text-dark">{product.shopName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Info panel */}
          <div>
            {/* Stock badge */}
            <p className={`text-sm font-semibold ${outOfStock ? 'text-red-500' : 'text-tertiary'}`}>
              {outOfStock ? 'Out of Stock' : `In Stock — ${product.stock} ${product.unit || 'units'} available`}
            </p>

            <h1 className="mt-2 text-2xl font-bold text-text-dark sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {product.brand && (
              <p className="mt-1 text-sm text-text-muted">
                Brand: <span className="font-medium text-text-dark">{product.brand}</span>
              </p>
            )}

            {product.category && (
              <span className="mt-3 inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                {product.category}
              </span>
            )}

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-extrabold text-primary sm:text-4xl">
                ₹{Number(displayPrice).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-text-muted line-through">
                  ₹{Number(product.price).toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">
                  -{discount}%
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-text-muted">
              per {product.unit || 'unit'}{product.taxable ? ' · incl. tax' : ''}
            </p>

            {product.description && (
              <p className="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
                {product.description}
              </p>
            )}

            {/* Quantity + Add to cart */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {!outOfStock && (
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
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="rounded-r-full px-4 py-2.5 hover:bg-neutral"
                    aria-label="Increase quantity"
                  >
                    <HiOutlinePlus className="h-4 w-4" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all sm:flex-none sm:px-10 sm:text-base ${
                  added
                    ? 'bg-green-500 hover:bg-green-600'
                    : outOfStock
                    ? 'cursor-not-allowed bg-neutral-border'
                    : 'bg-primary hover:bg-primary-dark'
                }`}
              >
                {added ? (
                  <>
                    <HiOutlineCheckCircle className="h-5 w-5" />
                    Added!
                  </>
                ) : (
                  <>
                    <HiOutlineShoppingBag className="h-5 w-5" />
                    {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 space-y-2 border-t border-neutral-border pt-5 text-sm text-text-muted">
              <p className="flex items-center gap-2">
                <HiOutlineTruck className="h-4 w-4 text-primary" />
                Free delivery on orders over ₹500
              </p>
              <p className="flex items-center gap-2">
                <HiOutlineCheckCircle className="h-4 w-4 text-primary" />
                Easy 7-day returns
              </p>
            </div>

            {/* Secure checkout */}
            <div className="mt-5 rounded-xl border border-neutral-border bg-neutral p-4 sm:p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-dark">
                <HiOutlineLockClosed className="h-4 w-4 text-primary" />
                Guaranteed safe &amp; secure checkout
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['VISA', 'Mastercard', 'UPI', 'NetBanking', 'PayPal'].map((method) => (
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

        {/* ── Tabs: Description & Additional Info only ── */}
        <div className="mt-12 sm:mt-16">
          <div className="flex gap-1 overflow-x-auto border-b border-neutral-border">
            {TABS.map((tab) => (
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
              </button>
            ))}
          </div>

          <div className="py-6 sm:py-8">
            {activeTab === 'Description' && (
              <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-text-muted sm:text-base">
                {product.description
                  ? <p>{product.description}</p>
                  : <p className="italic">No description provided.</p>
                }
              </div>
            )}

            {activeTab === 'Additional Information' && (
              <table className="w-full max-w-lg text-sm">
                <tbody>
                  {/* Real API fields */}
                  {[
                    ['Category', product.category],
                    ['Brand', product.brand],
                    ['Unit', product.unit],
                    ['Stock', product.stock != null ? `${product.stock} units` : null],
                    ['Taxable', product.taxable != null ? (product.taxable ? 'Yes' : 'No') : null],
                    ['Sold by', product.shopName],
                    // Dummy-data additionalInfo fields (if present)
                    ...Object.entries(product.additionalInfo || {}),
                    // Dummy-specific notes
                    ['Returns', product.returnsNote || null],
                    ['Dispatch', product.dispatchNote || null],
                  ]
                    .filter(([, v]) => v)
                    .map(([key, value]) => (
                      <tr key={key} className="border-b border-neutral-border">
                        <td className="py-3 pr-6 font-semibold text-text-dark">{key}</td>
                        <td className="py-3 text-text-muted">{value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
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
