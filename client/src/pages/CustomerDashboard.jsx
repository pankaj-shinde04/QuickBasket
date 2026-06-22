import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlinePlus,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
  HiOutlineArrowPath,
  HiOutlineShoppingCart,
  HiOutlineTag,
} from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { apiRequest } from '../services/api'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop'

const CATEGORY_COLORS = {
  Fruits: 'bg-orange-100 text-orange-700',
  Vegetables: 'bg-green-100 text-green-700',
  Dairy: 'bg-blue-100 text-blue-700',
  Bakery: 'bg-yellow-100 text-yellow-700',
  Beverages: 'bg-purple-100 text-purple-700',
  Snacks: 'bg-red-100 text-red-700',
  Meat: 'bg-pink-100 text-pink-700',
  default: 'bg-primary-light text-primary',
}

function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.default
}

function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    onAdd(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const displayPrice = hasDiscount ? product.discountPrice : product.price

  return (
    <article className="group overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-neutral p-4">
          {hasDiscount && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-gray-500 px-2 py-0.5 text-[10px] font-bold text-white">
              Out of Stock
            </span>
          )}
          <img
            src={product.image || PLACEHOLDER}
            alt={product.name}
            onError={(e) => { e.target.src = PLACEHOLDER }}
            className="mx-auto h-28 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-32 md:h-36"
          />
        </div>
      </Link>
      <div className="p-3 sm:p-4">
        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(product.category)}`}>
          {product.category}
        </span>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold text-text-dark hover:text-primary sm:text-base">
            {product.name}
          </h3>
        </Link>
        {product.shopName && (
          <p className="mt-0.5 truncate text-xs text-text-muted">{product.shopName}</p>
        )}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-text-dark">
              ₹{Number(displayPrice).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="ml-1.5 text-xs text-text-muted line-through">
                ₹{Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
              added ? 'bg-green-500' : 'bg-primary hover:bg-primary-dark'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <HiOutlinePlus className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const { addToCart, cartCount } = useCart()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    apiRequest('/public/categories')
      .then((res) => setCategories(['All', ...(res.data.categories || [])]))
      .catch(() => setCategories(['All']))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '16' })
    if (activeCategory !== 'All') params.set('category', activeCategory)
    if (search) params.set('search', search)

    apiRequest(`/public/products?${params}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [activeCategory, search])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome banner */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-light to-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-dark sm:text-3xl">
              Welcome back, <span className="text-primary">{user?.firstName}!</span>
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Shop fresh products from local stores — delivered to your door.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/dashboard/customer/orders"
              className="flex items-center gap-2 rounded-lg border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-light"
            >
              <HiOutlineShoppingBag className="h-4 w-4" />
              My Orders
            </Link>
            <Link
              to="/dashboard/customer/cart"
              className="relative flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              <HiOutlineShoppingCart className="h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-text-dark">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search + Category Filter */}
      <div className="mb-5 space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-neutral-border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'border border-neutral-border bg-white text-text-muted hover:border-primary hover:text-primary'
                }`}
              >
                {cat !== 'All' && <HiOutlineTag className="h-3 w-3" />}
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products section */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-text-dark sm:text-xl">
            {activeCategory === 'All' ? 'Featured Products' : activeCategory}
          </h2>
          {products.length > 0 && (
            <span className="text-xs text-text-muted">{products.length} products</span>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 text-sm text-text-muted">
            <HiOutlineArrowPath className="mr-2 h-5 w-5 animate-spin text-primary" />
            Loading products...
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-border bg-white py-16 text-center">
            <HiOutlineShoppingBag className="h-14 w-14 text-neutral-border" />
            <p className="mt-3 font-medium text-text-muted">
              {search ? `No products found for "${search}"` : 'No products available yet.'}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-3 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
