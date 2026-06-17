import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineSquares2X2,
  HiOutlineChartBar,
  HiOutlineBuildingStorefront,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'

export const adminNavItems = [
  { to: '/dashboard/admin', label: 'Dashboard', icon: HiOutlineSquares2X2, end: true },
  { to: '/dashboard/admin/analytics', label: 'Analytics', icon: HiOutlineChartBar },
  { to: '/dashboard/admin/vendors', label: 'Vendors', icon: HiOutlineBuildingStorefront },
  { to: '/dashboard/admin/users', label: 'Users', icon: HiOutlineUsers },
  { to: '/dashboard/admin/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
]

export default function AdminSidebarContent({ onNavigate, showBrand = true }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const close = () => onNavigate?.()

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Admin User'

  return (
    <>
      {showBrand && (
        <div className="border-b border-neutral-border px-5 py-5">
          <Link to="/dashboard/admin" className="block" onClick={close}>
            <h1 className="text-lg font-bold text-primary">QuickBasket Admin</h1>
            <p className="text-xs text-text-muted">Platform Management</p>
          </Link>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3 py-4">
        {adminNavItems.map(({ to, label, icon: Icon, end }) => (
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

      <div className="border-t border-neutral-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <img
            src={`https://i.pravatar.cc/150?u=${user?.email}`}
            alt={fullName}
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-primary-light"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-dark">{fullName}</p>
            <p className="truncate text-xs font-medium text-primary">Super Admin</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            logout()
            close()
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-border py-2 text-xs font-medium text-text-muted hover:bg-neutral"
        >
          <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </>
  )
}
