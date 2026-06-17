import { Link } from 'react-router-dom'
import { HiOutlineShoppingCart } from 'react-icons/hi2'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../constants/roles'

export default function CartTarget({ className = '', iconClassName = 'h-5 w-5' }) {
  const { cartCount, cartPulse } = useCart()
  const { isAuthenticated, user } = useAuth()

  const cartPath =
    isAuthenticated && user?.role === ROLES.CUSTOMER
      ? '/dashboard/customer/cart'
      : '/auth'

  return (
    <Link
      to={cartPath}
      data-cart-target
      className={`relative rounded-full p-2 text-text-muted hover:bg-neutral ${className}`}
      aria-label="Cart"
    >
      <motion.span
        animate={cartPulse ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        className="inline-flex"
      >
        <HiOutlineShoppingCart className={iconClassName} />
      </motion.span>
      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-text-dark sm:h-5 sm:w-5 sm:text-[10px]">
        {cartCount}
      </span>
    </Link>
  )
}
