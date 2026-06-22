import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineSquares2X2,
  HiOutlineCube,
  HiOutlineCog6Tooth,
  HiOutlineShoppingCart,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserCircle,
} from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'

export const customerNavItems = [
  { to: '/dashboard/customer', label: 'Dashboard', icon: HiOutlineSquares2X2, end: true },
  { to: '/dashboard/customer/orders', label: 'My Orders', icon: HiOutlineCube },
  { to: '/dashboard/customer/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
]

export default function CustomerSidebarContent({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const close = () => onNavigate?.()

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest'
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()

  return (
    <>
      {/* Profile card */}
      <div className="border-b border-neutral-border px-5 py-5">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={fullName}
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-primary-light"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light ring-2 ring-primary/20">
              <span className="text-base font-bold text-primary">{initials || <HiOutlineUserCircle className="h-6 w-6" />}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-text-dark">{fullName}</p>
            <p className="text-xs font-medium text-primary">Customer</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {customerNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:bg-neutral hover:text-text-dark'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* CTA + logout */}
      <div className="border-t border-neutral-border p-4">
        <button
          type="button"
          onClick={() => { navigate('/'); close() }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <HiOutlineShoppingCart className="h-5 w-5" />
          Start Shopping
        </button>
        <button
          type="button"
          onClick={() => { logout(); close() }}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-border py-2 text-xs font-medium text-text-muted hover:bg-neutral"
        >
          <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </>
  )
}
