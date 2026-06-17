import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const CartContext = createContext(null)
const CART_COUNT_KEY = 'quickbasket_cart_count'

function getVisibleCartTarget() {
  const targets = document.querySelectorAll('[data-cart-target]')
  for (const el of targets) {
    const rect = el.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      return rect
    }
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
        initial={{
          x: item.from.x - startSize / 2,
          y: item.from.y - startSize / 2,
          scale: 1,
          opacity: 1,
        }}
        animate={{
          x: item.to.x - endSize / 2,
          y: item.to.y - endSize / 2,
          scale: 0.25,
          opacity: 0.2,
        }}
        transition={{
          duration: 1.25,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        onAnimationComplete={onComplete}
      >
        <img src={item.image} alt="" className="h-full w-full object-contain p-1" />
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_COUNT_KEY)
      return saved ? Number.parseInt(saved, 10) : 3
    } catch {
      return 3
    }
  })
  const [flyItem, setFlyItem] = useState(null)
  const [cartPulse, setCartPulse] = useState(false)

  const flyToCart = useCallback(({ image, fromElement }) => {
    if (!image || !fromElement) return

    const toRect = getVisibleCartTarget()
    if (!toRect) return

    const from = fromElement.getBoundingClientRect()

    setFlyItem((current) => {
      if (current) return current

      return {
        id: Date.now(),
        image,
        from: {
          x: from.left + from.width / 2,
          y: from.top + from.height / 2,
          w: from.width,
          h: from.height,
        },
        to: {
          x: toRect.left + toRect.width / 2,
          y: toRect.top + toRect.height / 2,
        },
      }
    })
  }, [])

  const handleFlyComplete = useCallback(() => {
    setFlyItem(null)
    setCartCount((count) => {
      const next = count + 1
      localStorage.setItem(CART_COUNT_KEY, String(next))
      return next
    })
    setCartPulse(true)
    window.setTimeout(() => setCartPulse(false), 500)
  }, [])

  const value = useMemo(
    () => ({ cartCount, flyToCart, cartPulse }),
    [cartCount, flyToCart, cartPulse],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
      <FlyToCartLayer item={flyItem} onComplete={handleFlyComplete} />
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
