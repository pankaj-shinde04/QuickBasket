import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineBars3,
  HiOutlineMagnifyingGlass,
  HiOutlineUser,
  HiOutlineGift,
  HiOutlinePhone,
  HiOutlineXMark,
} from 'react-icons/hi2'
import Logo from './Logo'
import CartTarget from './CartTarget'
import { navLinks } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath, ROLES } from '../constants/roles'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const accountPath =
    isAuthenticated && user?.role === ROLES.CUSTOMER
      ? getDashboardPath(user.role)
      : '/auth'

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top announcement bar */}
      <div className="bg-primary px-4 py-2 text-center text-xs text-white sm:text-sm">
        <p>
          Free delivery on orders over <strong>₹500</strong> — Shop fresh groceries today!
        </p>
      </div>

      {/* Main header */}
      <div className="border-b border-neutral-border">
        <div className="page-container flex flex-col gap-3 py-3 sm:py-4 lg:flex-row lg:items-center lg:gap-5 lg:py-4">
          <div className="flex items-center justify-between gap-4">
            <Logo />

            <div className="flex items-center gap-2 lg:hidden">
              <CartTarget iconClassName="h-6 w-6" />
              <Link
                to={accountPath}
                className="rounded-full p-2.5 text-text-muted hover:bg-neutral hover:text-primary"
                aria-label="Account"
              >
                <HiOutlineUser className="h-6 w-6" />
              </Link>
              <button
                type="button"
                className="rounded-full p-2.5 text-text-muted hover:bg-neutral hover:text-primary"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <HiOutlineXMark className="h-7 w-7" />
                ) : (
                  <HiOutlineBars3 className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex w-full items-center overflow-hidden rounded-full border border-neutral-border bg-neutral lg:flex-1">
            <input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-text-muted sm:px-5"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 bg-secondary px-4 py-2.5 text-sm font-semibold text-text-dark transition-colors hover:bg-secondary-dark sm:px-6"
            >
              <HiOutlineMagnifyingGlass className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* User actions — desktop only */}
          <div className="hidden items-center gap-2 lg:flex lg:gap-3">
            <CartTarget iconClassName="h-6 w-6" className="p-3" />
            <Link
              to={accountPath}
              className="rounded-full p-3 text-text-muted transition-colors hover:bg-neutral hover:text-primary"
              aria-label="Account"
            >
              <HiOutlineUser className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-border bg-white lg:hidden">
          <div className="page-container space-y-1 py-4">
            {navLinks.map((link, i) => (
              <Link
                key={link}
                to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-base font-medium ${
                  i === 0 ? 'bg-primary-light text-primary' : 'text-text-dark hover:bg-neutral'
                }`}
              >
                {link}
              </Link>
            ))}
            <div className="border-t border-neutral-border pt-4">
              <Link
                to={accountPath}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-text-muted"
              >
                <HiOutlineUser className="h-6 w-6" /> Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sub navigation */}
      <div className="hidden border-b border-neutral-border bg-white lg:block">
        <div className="page-container flex items-center justify-between gap-5 py-3">
          <nav className="flex items-center gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link}
                to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  i === 0 ? 'text-primary' : 'text-text-muted hover:text-primary'
                }`}
              >
                {link}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              to="/shop"
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark"
            >
              <HiOutlineGift className="h-6 w-6" />
              Weekly Discount
            </Link>
            <div className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white">
              <HiOutlinePhone className="h-5 w-5" />
              <div className="text-xs leading-tight">
                <span className="block opacity-80">Online Number</span>
                <span className="text-sm font-semibold">+1 (800) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile horizontal nav scroll */}
      <div className="border-b border-neutral-border bg-white lg:hidden">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {navLinks.map((link, i) => (
            <Link
              key={link}
              to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium sm:text-base ${
                i === 0
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:text-primary'
              }`}
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
