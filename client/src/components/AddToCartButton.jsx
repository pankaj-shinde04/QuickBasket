import { useRef } from 'react'
import { useCart } from '../context/CartContext'

export default function AddToCartButton({
  image,
  imageRef,
  onAdded,
  className = '',
  children,
  ...props
}) {
  const { flyToCart } = useCart()
  const fallbackRef = useRef(null)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

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
