import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
  HiOutlineFunnel,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSquares2X2,
  HiOutlineExclamationTriangle,
  HiOutlineArrowTrendingUp,
  HiOutlinePlus,
  HiOutlineArrowPath,
} from 'react-icons/hi2'
import { useProducts } from '../../context/ProductContext'

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop'

export default function ShopOwnerInventory() {
  const { products, totalProducts, lowStockCount, outOfStockCount, loading, error, refresh } = useProducts()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-primary sm:text-2xl">Inventory Management</h1>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Search inventory..."
              className="w-56 rounded-full border border-neutral-border bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <button type="button" className="rounded-full p-2 text-text-muted hover:bg-white">
            <HiOutlineBell className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-full p-2 text-text-muted hover:bg-white">
            <HiOutlineQuestionMarkCircle className="h-5 w-5" />
          </button>
          <HiOutlineUserCircle className="h-8 w-8 text-text-muted" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {/* Total Products */}
        <div className="flex items-center gap-4 rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-light">
            <HiOutlineSquares2X2 className="h-6 w-6 text-primary" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Total Products</p>
            <p className="text-2xl font-bold text-text-dark">{totalProducts.toLocaleString()}</p>
            <p className="flex items-center gap-1 text-xs font-medium text-tertiary">
              <HiOutlineArrowTrendingUp className="h-3.5 w-3.5" />
              Live from database
            </p>
          </div>
        </div>

        {/* Out of Stock */}
        <div className={`flex items-center gap-4 rounded-xl border p-5 shadow-sm ${
          outOfStockCount > 0
            ? 'border-red-200 bg-red-50'
            : 'border-neutral-border bg-white'
        }`}>
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            outOfStockCount > 0 ? 'bg-red-100' : 'bg-neutral'
          }`}>
            <HiOutlineExclamationTriangle className={`h-6 w-6 ${outOfStockCount > 0 ? 'text-red-500' : 'text-text-muted'}`} />
          </span>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${outOfStockCount > 0 ? 'text-red-600' : 'text-text-muted'}`}>
              Out of Stock
            </p>
            <p className={`text-2xl font-bold ${outOfStockCount > 0 ? 'text-red-600' : 'text-text-dark'}`}>
              {outOfStockCount} {outOfStockCount === 1 ? 'Item' : 'Items'}
            </p>
            <p className={`text-xs ${outOfStockCount > 0 ? 'text-red-500' : 'text-text-muted'}`}>
              {outOfStockCount > 0 ? 'Needs immediate restocking' : 'All items in stock'}
            </p>
          </div>
        </div>

        {/* Low Stock */}
        <div className={`flex items-center gap-4 rounded-xl border p-5 shadow-sm ${
          lowStockCount > 0
            ? 'border-yellow-200 bg-yellow-50'
            : 'border-neutral-border bg-white'
        }`}>
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            lowStockCount > 0 ? 'bg-yellow-100' : 'bg-neutral'
          }`}>
            <HiOutlineExclamationTriangle className={`h-6 w-6 ${lowStockCount > 0 ? 'text-yellow-500' : 'text-text-muted'}`} />
          </span>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${lowStockCount > 0 ? 'text-yellow-600' : 'text-text-muted'}`}>
              Low Stock
            </p>
            <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-yellow-600' : 'text-text-dark'}`}>
              {lowStockCount} {lowStockCount === 1 ? 'Item' : 'Items'}
            </p>
            <p className={`text-xs ${lowStockCount > 0 ? 'text-yellow-500' : 'text-text-muted'}`}>
              {lowStockCount > 0 ? 'Below minimum threshold' : 'Stock levels healthy'}
            </p>
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="rounded-xl border border-neutral-border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-border px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-text-dark">All Products</h2>
            <span className="rounded-full bg-neutral px-2.5 py-0.5 text-xs font-semibold text-text-muted">
              {totalProducts.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              type="button"
              onClick={() => refresh()}
              disabled={loading}
              title="Refresh"
              className="rounded-lg border border-neutral-border p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
            >
              <HiOutlineArrowPath className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Search */}
            <div className="relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search by name, SKU..."
                className="w-48 rounded-lg border border-neutral-border py-2 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-56"
              />
            </div>

            <button
              type="button"
              className="rounded-lg border border-neutral-border p-2 text-text-muted hover:bg-neutral"
            >
              <HiOutlineFunnel className="h-5 w-5" />
            </button>

            {/* Add product button */}
            <Link
              to="/dashboard/shop-owner/inventory/add"
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              <HiOutlinePlus className="h-4 w-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-sm text-text-muted">
            <HiOutlineArrowPath className="mr-2 h-5 w-5 animate-spin" />
            Loading products...
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="py-16 text-center">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => refresh()}
              className="mt-3 text-sm font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <HiOutlineSquares2X2 className="mb-3 h-12 w-12 text-neutral-border" />
            <p className="font-medium text-text-dark">No products yet</p>
            <p className="mt-1 text-sm text-text-muted">
              Start by adding your first product to the inventory.
            </p>
            <Link
              to="/dashboard/shop-owner/inventory/add"
              className="mt-4 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              <HiOutlinePlus className="h-4 w-4" />
              Add First Product
            </Link>
          </div>
        )}

        {/* Table */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b border-neutral-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                    <th className="px-5 py-3">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Stock</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((product) => (
                    <tr key={product.id} className="border-b border-neutral-border last:border-0 hover:bg-neutral/40">
                      <td className="px-5 py-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || PLACEHOLDER}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                            onError={(e) => { e.target.src = PLACEHOLDER }}
                          />
                          <div>
                            <p className="font-medium text-text-dark">{product.name}</p>
                            <p className="text-xs text-text-muted">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.categoryColor}`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-text-dark">{product.priceLabel}</span>
                        {product.originalPrice && (
                          <span className="ml-1 text-xs text-text-muted line-through">
                            ₹{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-medium ${product.stockColor}`}>
                          {product.stock}{' '}
                          <span className="text-xs">({product.stockStatus})</span>
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/dashboard/shop-owner/inventory/edit/${product.id}`}
                          className="text-sm font-semibold text-primary hover:text-primary-dark"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-border px-5 py-4">
              <p className="text-sm text-text-muted">
                Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–
                {Math.min(page * perPage, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
                >
                  <HiOutlineChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                      page === p ? 'bg-primary text-white' : 'text-text-muted hover:bg-neutral'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
                >
                  <HiOutlineChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
