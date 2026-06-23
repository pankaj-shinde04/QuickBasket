import { NavLink } from 'react-router-dom'
import { HiOutlineShoppingCart, HiOutlineHome, HiOutlineInformationCircle, HiOutlineShoppingBag, HiOutlineEnvelope } from 'react-icons/hi2'

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-emerald-600 text-white'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-600">
          <HiOutlineShoppingCart className="h-7 w-7" />
          QuickBasket
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            <HiOutlineHome className="h-5 w-5" />
            Home
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            <HiOutlineShoppingBag className="h-5 w-5" />
            Shop
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            <HiOutlineEnvelope className="h-5 w-5" />
            Contact
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            <HiOutlineInformationCircle className="h-5 w-5" />
            About
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
