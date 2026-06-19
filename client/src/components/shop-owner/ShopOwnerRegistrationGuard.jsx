import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { SHOP_REGISTER_PATH } from '../../constants/roles'
import * as shopApi from '../../services/shopService'

export default function ShopOwnerRegistrationGuard({ children }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const [shopLoading, setShopLoading] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadShop() {
      if (!isAuthenticated || user?.role !== 'shop_owner') {
        setShopLoading(false)
        return
      }

      try {
        const response = await shopApi.fetchMyShop()
        if (!cancelled) {
          setProfileComplete(!!response.data.shop.profileComplete)
        }
      } catch {
        if (!cancelled) {
          setProfileComplete(false)
        }
      } finally {
        if (!cancelled) {
          setShopLoading(false)
        }
      }
    }

    loadShop()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, user?.role, user?.id])

  if (loading || shopLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral">
        <p className="text-sm font-medium text-text-muted">Loading...</p>
      </div>
    )
  }

  const onRegisterPage = location.pathname === SHOP_REGISTER_PATH

  if (!profileComplete && !onRegisterPage) {
    return <Navigate to={SHOP_REGISTER_PATH} replace />
  }

  if (profileComplete && onRegisterPage) {
    return <Navigate to="/dashboard/shop-owner" replace />
  }

  return children ?? <Outlet />
}
