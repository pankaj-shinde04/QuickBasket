import { createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const CartContext = createContext(null)
const CART_KEY = 'quickbasket_cart_v2'

// ── persist helpers ──────────────────────────────────────────────────────────
function load() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || [] } catch { return [] }
}
function save(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

// ── reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  let next
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.product.id)
      next = existing
        ? state.map((i) => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state, { ...action.product, qty: 1 }]
      break
    }
    case 'SET_QTY': {
      next = action.qty <= 0
        ? state.filter((i) => i.id !== action.id)
        : state.map((i) => i.id === action.id ? { ...i, qty: action.qty } : i)
      break
    }
    case 'REMOVE':
      next = state.filter((i) => i.id !== action.id)
      break
    case 'CLEAR':
      next = []
      break
    default:
      return state
  }
  save(next)
  return next
}

// ── fly animation ─────────────────────────────────────────────────────────────
function getVisibleCartTarget() {
  const targets = document.querySelectorAll('[data-cart-target]')
  for (const el of targets) {
    const rect = el.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) return rect
  }
  return null
}

function FlyToCartLayer({ item, onComplete }) {
  if (!item) return null
  const startSize = Math.min(item.from.w, item.from.h, 100)
  const endSize = 32
  return createPortal(
    <AnimatePresence>
      <motion.div
        key={item.id}
        className="pointer-events-none fixed left-0 top-0 z-[9999] overflow-hidden rounded-xl border-2 border-white bg-white shadow-xl"
        style={{ width: startSize, height: startSize }}
        initial={{ x: item.from.x - startSize / 2, y: item.from.y - startSize / 2, scale: 1, opacity: 1 }}
        animate={{ x: item.to.x - endSize / 2, y: item.to.y - endSize / 2, scale: 0.25, opacity: 0.2 }}
        transition={{ duration: 1.25, ease: [0.25, 0.1, 0.25, 1] }}
        onAnimationComplete={onComplete}
      >
        <img src={item.image} alt="" className="h-full w-full object-contain p-1" />
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}

// ── provider ──────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, load)
  const [flyItem, setFlyItem] = useState(null)
  const [cartPulse, setCartPulse] = useState(false)

  const addToCart = useCallback((product) => {
    dispatch({ type: 'ADD', product })
  }, [])

  const setQty = useCallback((id, qty) => {
    dispatch({ type: 'SET_QTY', id, qty })
  }, [])

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const flyToCart = useCallback(({ image, fromElement, product }) => {
    if (!image || !fromElement) return
    const toRect = getVisibleCartTarget()
    if (!toRect) return
    const from = fromElement.getBoundingClientRect()
    setFlyItem((current) => {
      if (current) return current
      return {
        id: Date.now(),
        image,
        from: { x: from.left + from.width / 2, y: from.top + from.height / 2, w: from.width, h: from.height },
        to: { x: toRect.left + toRect.width / 2, y: toRect.top + toRect.height / 2 },
      }
    })
    if (product) dispatch({ type: 'ADD', product })
  }, [])

  const handleFlyComplete = useCallback(() => {
    setFlyItem(null)
    setCartPulse(true)
    window.setTimeout(() => setCartPulse(false), 500)
  }, [])

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const serviceFee = subtotal > 0 ? 2.99 : 0
  const total = subtotal + serviceFee

  const value = useMemo(() => ({
    items,
    cartCount,
    subtotal,
    serviceFee,
    total,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    flyToCart,
    cartPulse,
  }), [items, cartCount, subtotal, serviceFee, total, addToCart, setQty, removeFromCart, clearCart, flyToCart, cartPulse])

  return (
    <CartContext.Provider value={value}>
      {children}
      <FlyToCartLayer item={flyItem} onComplete={handleFlyComplete} />
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
