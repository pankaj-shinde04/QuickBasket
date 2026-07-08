import { useState, useEffect } from 'react'
import ProductCard from '../ProductCard'
import SectionHeading from '../SectionHeading'
import { apiRequest } from '../../services/api'

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-border bg-white p-4">
      <div className="mb-3 h-40 rounded-xl bg-neutral" />
      <div className="mb-2 h-4 w-3/4 rounded bg-neutral" />
      <div className="h-4 w-1/2 rounded bg-neutral" />
    </div>
  )
}

export default function TrendingProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiRequest('/public/products/trending?limit=10', { method: 'GET' })
        setProducts(res.data?.products || [])
      } catch (err) {
        console.error('Failed to fetch trending products:', err)
        setError('Failed to load trending products.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section>
        <SectionHeading title="Trending Products" />
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => <ProductSkeleton key={i} />)}
        </div>
      </section>
    )
  }

  if (error || products.length === 0) {
    return null
  }

  return (
    <section>
      <SectionHeading title="Trending Products" />
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
