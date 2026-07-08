import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { apiRequest } from '../services/api'

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-border bg-white p-4">
      <div className="mb-3 h-40 rounded-xl bg-neutral" />
      <div className="mb-2 h-4 w-3/4 rounded bg-neutral" />
      <div className="h-4 w-1/2 rounded bg-neutral" />
    </div>
  )
}

export default function CategoryPage() {
  const { categorySlug } = useParams()

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch all categories to find the matching one by slug
        const catRes = await apiRequest('/public/categories', { method: 'GET' })
        const allCategories = catRes.data?.categories || []

        const matched = allCategories.find(
          (c) => (c.slug || c.name.toLowerCase().replace(/\s+/g, '-')) === categorySlug
        )

        if (!matched) {
          setError('not_found')
          setLoading(false)
          return
        }

        setCategory(matched)

        // Fetch products for this category
        const prodRes = await apiRequest(
          `/public/products?category=${encodeURIComponent(matched.name)}&limit=100`,
          { method: 'GET' }
        )
        setProducts(prodRes.data?.products || [])
      } catch (err) {
        console.error('CategoryPage fetch error:', err)
        setError('fetch_failed')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categorySlug])

  // Category not found
  if (!loading && (error === 'not_found' || (!category && !loading))) {
    return (
      <div className="page-container section-gap py-10 text-center">
        <h1 className="text-2xl font-bold text-text-dark">Category not found</h1>
        <p className="mt-3 text-text-muted">The category you are looking for does not exist.</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-semibold text-primary hover:text-primary-dark"
        >
          ← Back to Home
        </Link>
      </div>
    )
  }

  // API error
  if (!loading && error === 'fetch_failed') {
    return (
      <div className="page-container section-gap py-10 text-center">
        <h1 className="text-2xl font-bold text-text-dark">Something went wrong</h1>
        <p className="mt-3 text-text-muted">Failed to load this category. Please try again.</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-semibold text-primary hover:text-primary-dark"
        >
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="page-container section-gap py-6 sm:py-8 lg:py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-text-muted">
        <Link to="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-text-dark">
          {loading ? '...' : category?.name}
        </span>
      </nav>

      {/* Category header */}
      <div className="mb-8 flex items-center gap-4">
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-sm sm:h-20 sm:w-20 sm:text-4xl ${category?.color || 'bg-neutral'}`}
        >
          {loading ? '📦' : category?.icon || '📦'}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-text-dark sm:text-3xl lg:text-4xl">
            {loading ? 'Loading...' : category?.name}
          </h1>
          {!loading && (
            <p className="mt-1 text-sm text-text-muted sm:text-base">
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </p>
          )}
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-border bg-white py-16 text-center">
          <p className="text-lg font-semibold text-text-dark">No products yet</p>
          <p className="mt-2 text-sm text-text-muted">
            Check back soon for new items in {category?.name}.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block text-sm font-semibold text-primary hover:text-primary-dark"
          >
            Browse all categories
          </Link>
        </div>
      )}
    </div>
  )
}
