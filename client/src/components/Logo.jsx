import { Link } from 'react-router-dom'
import { HiOutlineShoppingCart } from 'react-icons/hi2'

export default function Logo({ light = false, className = '' }) {
  return (
    <Link to="/" className={`group flex shrink-0 items-center gap-2 ${className}`}>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg sm:h-10 sm:w-10 lg:h-11 lg:w-11 ${
          light ? 'bg-white/20' : 'bg-primary-light'
        }`}
      >
        <HiOutlineShoppingCart
          className={`h-5 w-5 sm:h-6 sm:w-6 ${light ? 'text-white' : 'text-primary'}`}
        />
      </span>
      <span
        className={`text-lg font-extrabold italic tracking-tight sm:text-xl lg:text-2xl ${
          light ? 'text-white' : 'text-primary'
        }`}
      >
        QuickBasket
      </span>
    </Link>
  )
}
