import { useState, useEffect } from 'react'
import ProductCard from '../ProductCard'
import SectionHeading from '../SectionHeading'
import { apiRequest } from '../../services/api'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiRequest('/public/products?limit=10')
        setProducts(res.data.products || [])
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section>
        <SectionHeading title="Featured Products" />
        <div className="text-center py-8 text-sm text-text-muted">Loading products...</div>
      </section>
    )
  }

  return (
    <section>
      <SectionHeading title="Featured Products" />
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
