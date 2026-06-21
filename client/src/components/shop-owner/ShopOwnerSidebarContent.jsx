import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineSquares2X2,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlinePlus,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBuildingStorefront,
} from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'
import { useShop } from '../../context/ShopContext'

export const shopOwnerNavItems = [
  { to: '/dashboard/shop-owner', label: 'Dashboard', icon: HiOutlineSquares2X2, end: true },
  { to: '/dashboard/shop-owner/inventory', label: 'Inventory', icon: HiOutlineCube },
  { to: '/dashboard/shop-owner/orders', label: 'Orders', icon: HiOutlineShoppingCart },
  { to: '/dashboard/shop-owner/reports', label: 'Analytics', icon: HiOutlineChartBar },
  { to: '/dashboard/shop-owner/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
]

export default function ShopOwnerSidebarContent({ onNavigate, showBrand = true }) {
  const { logout } = useAuth()
  const { shop } = useShop()
  const navigate = useNavigate()

  const close = () => onNavigate?.()

  const handleAddProduct = () => {
    navigate('/dashboard/shop-owner/inventory/add')
    close()
  }

  const handleLogout = () => {
    logout()
    close()
  }

  return (
    <>
      {showBrand && (
        <div className="border-b border-neutral-border px-5 py-5">
          <Link to="/dashboard/shop-owner" className="block" onClick={close}>
            <h1 className="text-lg font-bold text-primary">QuickBasket</h1>
            <p className="text-xs text-text-muted">Seller Dashboard</p>
          </Link>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3 py-4">
        {shopOwnerNavItems.map(({ to, label, icon: Icon, end }) => (
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

      {/* Profile card at bottom */}
      <div className="border-t border-neutral-border p-4">
        <Link
          to="/dashboard/shop-owner/settings"
          onClick={close}
          className="mb-4 flex items-center gap-3 rounded-xl p-2 transition hover:bg-neutral"
        >
          {shop?.logo ? (
            <img
              src={shop.logo}
              alt={shop.name}
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
              <HiOutlineBuildingStorefront className="h-5 w-5 text-primary" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-dark">
              {shop?.name || 'My Store'}
            </p>
            <p className="truncate text-xs text-text-muted">View Settings</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleAddProduct}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Add Product
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-border py-2 text-xs font-medium text-text-muted hover:bg-neutral"
        >
          <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </>
  )
}
