import { useState, useEffect } from 'react'
import { HiOutlineFunnel, HiOutlineXMark, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2'
import ProductCard from '../components/ProductCard'
import { apiRequest } from '../services/api'
import { getPublicCategories } from '../services/categoryService'

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState('all')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalProducts, setTotalProducts] = useState(0)

  const fetchCategories = async () => {
    try {
      const res = await getPublicCategories()
      setCategories(res.data.categories || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        limit: 1000,
      }
      if (selectedCategory !== 'All') {
        params.category = selectedCategory
      }
      const queryString = new URLSearchParams(params).toString()
      const res = await apiRequest(`/public/products?${queryString}`, { method: 'GET' })
      setProducts(res.data.products || [])
      setTotalProducts(res.data.total || 0)
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [selectedCategory])

  const filteredProducts = products.filter((product) => {
    let priceMatch = true

    if (priceRange !== 'all') {
      const price = product.price
      if (priceRange === '0-10') priceMatch = price >= 0 && price <= 10
      else if (priceRange === '10-20') priceMatch = price > 10 && price <= 20
      else if (priceRange === '20-50') priceMatch = price > 20 && price <= 50
      else if (priceRange === '50+') priceMatch = price > 50
    }

    return priceMatch
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  return (
    <div className="bg-white">
      <div className="page-container py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-dark sm:text-3xl">Shop</h1>
            <p className="mt-1 text-sm text-text-muted">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 rounded-lg border border-neutral-border px-4 py-2 text-sm font-semibold text-text-dark hover:bg-neutral"
          >
            <HiOutlineFunnel className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside
            className={`${
              showMobileFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'
            } lg:block lg:static lg:w-64 lg:flex-shrink-0`}
          >
            {showMobileFilters && (
              <div className="mb-4 flex items-center justify-between lg:hidden">
                <h2 className="text-lg font-bold text-text-dark">Filters</h2>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-lg p-2 hover:bg-neutral"
                >
                  <HiOutlineXMark className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-text-dark">Category</h3>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  handleFilterChange()
                }}
                className="w-full rounded-lg border border-neutral-border px-3 py-2 text-sm font-medium text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id || category.name} value={category.name}>
                    {category.icon || ''} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-text-dark">Price Range</h3>
              <select
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(e.target.value)
                  handleFilterChange()
                }}
                className="w-full rounded-lg border border-neutral-border px-3 py-2 text-sm font-medium text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Prices</option>
                <option value="0-10">Under ₹10</option>
                <option value="10-20">₹10 - ₹20</option>
                <option value="20-50">₹20 - ₹50</option>
                <option value="50+">₹50+</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All')
                setPriceRange('all')
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-neutral-border px-4 py-2 text-sm font-semibold text-text-dark transition-colors hover:bg-neutral"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-sm text-text-muted">
                Loading products...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 py-16 text-center">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-3 text-sm font-semibold text-red-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 rounded-lg border border-neutral-border px-3 py-2 text-sm font-medium text-text-dark transition-colors hover:bg-neutral disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <HiOutlineChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'border border-neutral-border text-text-dark hover:bg-neutral'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 rounded-lg border border-neutral-border px-3 py-2 text-sm font-medium text-text-dark transition-colors hover:bg-neutral disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                      <HiOutlineChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-neutral-border bg-white py-16 text-center">
                <p className="text-lg font-semibold text-text-dark">No products found</p>
                <p className="mt-2 text-sm text-text-muted">
                  Try adjusting your filters to see more products.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
