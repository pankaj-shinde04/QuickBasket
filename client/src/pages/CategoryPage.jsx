import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getCategoryBySlug, getProductsByCategory } from '../data/mockData'

export default function CategoryPage() {
  const { categorySlug } = useParams()
  const category = getCategoryBySlug(categorySlug)
  const products = category ? getProductsByCategory(category.name) : []

  if (!category) {
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

  return (
    <div className="page-container section-gap py-6 sm:py-8 lg:py-10">
      <nav className="mb-6 text-sm text-text-muted">
        <Link to="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-text-dark">{category.name}</span>
      </nav>

      <div className="mb-8 flex items-center gap-4">
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-sm sm:h-20 sm:w-20 sm:text-4xl ${category.color}`}
        >
          {category.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-text-dark sm:text-3xl lg:text-4xl">
            {category.name}
          </h1>
          <p className="mt-1 text-sm text-text-muted sm:text-base">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-border bg-white py-16 text-center">
          <p className="text-lg font-semibold text-text-dark">No products yet</p>
          <p className="mt-2 text-sm text-text-muted">
            Check back soon for new items in {category.name}.
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
