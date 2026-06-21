import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getAuthToken } from '../services/api'
import * as productApi from '../services/productService'

const ProductContext = createContext(null)

// ── helpers ───────────────────────────────────────────────────────────────────

function getCategoryColor(category) {
  const map = {
    'Fresh Produce': 'bg-yellow-100 text-yellow-800',
    'Dairy Alternatives': 'bg-tertiary-light text-tertiary',
    Bakery: 'bg-amber-100 text-amber-800',
    Snacks: 'bg-orange-100 text-orange-800',
    Beverages: 'bg-blue-100 text-blue-800',
    'Frozen Foods': 'bg-sky-100 text-sky-800',
  }
  return map[category] ?? 'bg-neutral text-text-dark'
}

function getStockInfo(stock) {
  if (stock === 0) return { stockStatus: 'Out of Stock', stockColor: 'text-red-500' }
  if (stock <= 10) return { stockStatus: 'Low Stock', stockColor: 'text-red-500' }
  return { stockStatus: 'In Stock', stockColor: 'text-text-muted' }
}

function formatPriceLabel(price, unit) {
  if (unit === 'per lb') return `₹${Number(price).toFixed(2)}/lb`
  if (unit === 'per kg') return `₹${Number(price).toFixed(2)}/kg`
  if (unit === 'Piece') return `₹${Number(price).toFixed(2)}/ea`
  return `₹${Number(price).toFixed(2)}`
}

// Map raw API product → shape expected by the UI
function mapProduct(p) {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku || '',
    category: p.category,
    categoryColor: getCategoryColor(p.category),
    price: p.price,
    priceLabel: formatPriceLabel(p.price, p.unit),
    originalPrice: p.discountPrice ? p.price : null,
    discountPrice: p.discountPrice || null,
    stock: p.stock,
    ...getStockInfo(p.stock),
    unit: p.unit,
    brand: p.brand || '',
    taxable: p.taxable,
    description: p.description || '',
    image: p.image || '',
    isActive: p.isActive,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

// ── provider ──────────────────────────────────────────────────────────────────

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [lowStockCount, setLowStockCount] = useState(0)
  const [outOfStockCount, setOutOfStockCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all products from the backend
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const token = getAuthToken()
      const res = await productApi.getProducts(token, { limit: 100, ...params })
      const mapped = (res.data.products || []).map(mapProduct)
      setProducts(mapped)
      setLowStockCount(res.data.lowStockCount || 0)
      setOutOfStockCount(res.data.outOfStockCount || 0)
    } catch (err) {
      setError(err.message || 'Failed to load products.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load on mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const getProduct = useCallback(
    (id) => products.find((p) => p.id === id),
    [products],
  )

  // Refresh list after any mutation
  const addProduct = useCallback(async () => {
    await fetchProducts()
  }, [fetchProducts])

  const updateProduct = useCallback(async () => {
    await fetchProducts()
  }, [fetchProducts])

  const deleteProduct = useCallback(
    async (id) => {
      const token = getAuthToken()
      await productApi.deleteProduct(token, id)
      await fetchProducts()
    },
    [fetchProducts],
  )

  const value = useMemo(
    () => ({
      products,
      totalProducts: products.length,
      lowStockCount,
      outOfStockCount,
      loading,
      error,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      refresh: fetchProducts,
    }),
    [products, lowStockCount, outOfStockCount, loading, error, getProduct, addProduct, updateProduct, deleteProduct, fetchProducts],
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}
