import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { initialProducts } from '../data/shopOwnerData'

const PRODUCTS_KEY = 'quickbasket_shop_products'

const ProductContext = createContext(null)

function loadProducts() {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    /* use defaults */
  }
  return initialProducts
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

function formatPriceLabel(price, unit) {
  if (unit === 'per lb') return `$${price.toFixed(2)}/lb`
  if (unit === 'per kg') return `$${price.toFixed(2)}/kg`
  if (unit === 'Piece') return `$${price.toFixed(2)}/ea`
  return `$${price.toFixed(2)}`
}

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
  if (stock <= 15) return { stockStatus: 'Low Stock', stockColor: 'text-red-500' }
  return { stockStatus: 'In Stock', stockColor: 'text-text-muted' }
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(loadProducts)

  const persist = useCallback((next) => {
    setProducts(next)
    saveProducts(next)
  }, [])

  const getProduct = useCallback(
    (id) => products.find((p) => p.id === id),
    [products],
  )

  const addProduct = useCallback(
    (data) => {
      const stock = Number(data.stock) || 0
      const price = Number(data.price) || 0
      const product = {
        id: crypto.randomUUID(),
        name: data.name,
        sku: data.sku || `SKU-${Date.now()}`,
        category: data.category,
        categoryColor: getCategoryColor(data.category),
        price,
        priceLabel: formatPriceLabel(price, data.unit),
        originalPrice: data.discount ? price * 1.2 : null,
        discountPrice: data.discount ? price : null,
        stock,
        ...getStockInfo(stock),
        unit: data.unit,
        brand: data.brand || '',
        taxable: data.taxable ?? true,
        description: data.description || '',
        image:
          data.image ||
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop',
      }
      persist([product, ...products])
      return product
    },
    [products, persist],
  )

  const updateProduct = useCallback(
    (id, data) => {
      const stock = Number(data.stock) || 0
      const price = Number(data.price) || 0
      const next = products.map((p) =>
        p.id === id
          ? {
              ...p,
              name: data.name,
              sku: data.sku,
              category: data.category,
              categoryColor: getCategoryColor(data.category),
              price,
              priceLabel: formatPriceLabel(price, data.unit),
              originalPrice: data.discountPrice ? price : p.originalPrice,
              discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
              stock,
              ...getStockInfo(stock),
              unit: data.unit,
              brand: data.brand || '',
              taxable: data.taxable ?? true,
              description: data.description || '',
              image: data.image || p.image,
            }
          : p,
      )
      persist(next)
    },
    [products, persist],
  )

  const deleteProduct = useCallback(
    (id) => {
      persist(products.filter((p) => p.id !== id))
    },
    [products, persist],
  )

  const value = useMemo(
    () => ({
      products,
      totalProducts: products.length,
      lowStockCount: products.filter((p) => p.stock <= 15).length,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [products, getProduct, addProduct, updateProduct, deleteProduct],
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}
