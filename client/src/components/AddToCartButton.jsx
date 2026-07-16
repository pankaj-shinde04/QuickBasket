import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ROLES } from '../constants/roles'

/**
 * AddToCartButton
 *
 * Props:
 *   product   – the full product object { id, name, price, image, unit, stock, ... }
 *               REQUIRED to actually add the item to the cart.
 *   image     – fallback image URL for the fly animation (if product.image is not set)
 *   imageRef  – ref to the product image element (used as animation start point)
 *   onAdded   – callback fired after the item is added
 */
export default function AddToCartButton({
  product,
  image,
  imageRef,
  onAdded,
  silent = false,
  className = '',
  children,
  ...props
}) {
  const { addToCart, flyToCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { success, info } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const fallbackRef = useRef(null)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated || user?.role !== ROLES.CUSTOMER) {
      if (!silent) info('Please log in to add items to your cart.', 'Login required')
      navigate('/auth', { state: { from: location }, replace: false })
      return
    }

    if (product) {
      addToCart(product)
      if (!silent) success(`${product.name} added to cart!`)
    }

    const animImage = image ?? product?.image
    if (animImage) {
      const fromElement =
        imageRef?.current ??
        fallbackRef.current?.closest('[data-product-image]') ??
        fallbackRef.current
      if (fromElement) {
        flyToCart({ image: animImage, fromElement })
      }
    }

    onAdded?.()
  }

  return (
    <button
      ref={fallbackRef}
      type="button"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}
