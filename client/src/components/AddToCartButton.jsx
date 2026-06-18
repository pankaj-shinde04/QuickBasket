import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../constants/roles'

export default function AddToCartButton({
  image,
  imageRef,
  onAdded,
  className = '',
  children,
  ...props
}) {
  const { flyToCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fallbackRef = useRef(null)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated || user?.role !== ROLES.CUSTOMER) {
      navigate('/auth', { state: { from: location }, replace: false })
      return
    }

    const fromElement =
      imageRef?.current ??
      fallbackRef.current?.closest('[data-product-image]') ??
      fallbackRef.current

    flyToCart({ image, fromElement })
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
