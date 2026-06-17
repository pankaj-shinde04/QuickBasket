import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiOutlineHeart,
  HiOutlineBars3,
  HiOutlineXMark,
} from 'react-icons/hi2'
import CartTarget from '../CartTarget'

const topNavLinks = [
  { to: '/', label: 'Shop' },
  { to: '/dashboard/customer/orders', label: 'Orders' },
  { to: '/dashboard/customer/rewards', label: 'Rewards' },
  { to: '/dashboard/customer/settings', label: 'Settings' },
]

export default function CustomerTopNav({ menuOpen, onMenuToggle }) {
  const location = useLocation()
  const isOrdersActive = location.pathname.includes('/dashboard/customer/orders')
  const isShopActive = location.pathname === '/'

  return (
    <>
      <div className="flex items-center gap-2 border-b border-neutral-border px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 lg:px-6">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-text-dark hover:bg-neutral lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <HiOutlineXMark className="h-6 w-6" />
          ) : (
            <HiOutlineBars3 className="h-6 w-6" />
          )}
        </button>

        <Link to="/dashboard/customer" className="min-w-0 shrink-0">
          <span className="text-lg font-extrabold italic text-primary sm:text-xl">QuickBasket</span>
        </Link>

        <nav className="hidden flex-1 justify-center gap-4 xl:gap-6 lg:flex">
          {topNavLinks.map((link) =>
            link.label === 'Orders' ? (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isOrdersActive
                    ? 'border-b-2 border-primary pb-0.5 text-primary'
                    : 'text-text-muted hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ) : link.label === 'Shop' ? (
              <Link
                key={link.to}
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isShopActive
                    ? 'border-b-2 border-primary pb-0.5 text-primary'
                    : 'text-text-muted hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-b-2 border-primary pb-0.5 text-primary'
                      : 'text-text-muted hover:text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-2">
          <div className="relative hidden md:block">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Search groceries..."
              className="w-36 rounded-full border border-neutral-border bg-neutral py-2 pl-9 pr-3 text-sm outline-none focus:border-primary lg:w-48 xl:w-56"
            />
          </div>
          <button
            type="button"
            className="relative hidden rounded-full p-2 text-text-muted hover:bg-neutral sm:block"
            aria-label="Notifications"
          >
            <HiOutlineBell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <Link
            to="/dashboard/customer/wishlist"
            className="rounded-full p-2 text-text-muted hover:bg-neutral"
            aria-label="Wishlist"
          >
            <HiOutlineHeart className="h-5 w-5" />
          </Link>
          <CartTarget />
          <Link
            to="/dashboard/customer/settings"
            className="hidden rounded-full p-1 text-text-muted hover:bg-neutral sm:block"
            aria-label="Account"
          >
            <HiOutlineUserCircle className="h-7 w-7 sm:h-8 sm:w-8" />
          </Link>
        </div>
      </div>

      <nav className="scrollbar-hide flex gap-3 overflow-x-auto border-b border-neutral-border px-3 py-2 lg:hidden">
        {topNavLinks.map((link) =>
          link.label === 'Orders' ? (
            <Link
              key={link.to}
              to={link.to}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm ${
                isOrdersActive
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted'
              }`}
            >
              {link.label}
            </Link>
          ) : link.label === 'Shop' ? (
            <Link
              key={link.to}
              to="/"
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm ${
                isShopActive ? 'bg-primary text-white' : 'bg-neutral text-text-muted'
              }`}
            >
              {link.label}
            </Link>
          ) : (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm ${
                  isActive ? 'bg-primary text-white' : 'bg-neutral text-text-muted'
                }`
              }
            >
              {link.label}
            </NavLink>
          ),
        )}
      </nav>
    </>
  )
}
