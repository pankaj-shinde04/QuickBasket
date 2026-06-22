import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const WishlistContext = createContext(null)
const WISHLIST_KEY = 'quickbasket_wishlist_v2'

function load() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [] } catch { return [] }
}
function save(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(load)

  const addToWishlist = useCallback((product) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev
      const next = [...prev, product]
      save(next)
      return next
    })
  }, [])

  const removeFromWishlist = useCallback((id) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id)
      save(next)
      return next
    })
  }, [])

  const isInWishlist = useCallback((id) => items.some((i) => i.id === id), [items])

  const toggleWishlist = useCallback((product) => {
    if (items.find((i) => i.id === product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }, [items, addToWishlist, removeFromWishlist])

  const value = useMemo(() => ({
    items,
    count: items.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  }), [items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
