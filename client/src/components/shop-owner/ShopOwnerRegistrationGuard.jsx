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

  // Block pending shop owners — they cannot access any shop-owner page until approved
  const isPending = user?.status === 'pending'

  useEffect(() => {
    let cancelled = false

    async function loadShop() {
      // If not authenticated or not a shop owner, skip the shop fetch
      if (!isAuthenticated || user?.role !== 'shop_owner') {
        setShopLoading(false)
        return
      }

      try {
        const response = await shopApi.fetchMyShop()
        if (!cancelled) {
          // Only allow access if shop profile is complete
          setProfileComplete(response.data.shop?.profileComplete === true)
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

  // Pending shop owners can only access the shop registration page
  if (isPending && !onRegisterPage) {
    return <Navigate to="/auth" replace />
  }

  // If profile is not complete, redirect to registration page
  if (!profileComplete && !onRegisterPage) {
    return <Navigate to={SHOP_REGISTER_PATH} replace />
  }

  // If profile is complete and on registration page, redirect to dashboard
  if (profileComplete && onRegisterPage) {
    return <Navigate to="/dashboard/shop-owner" replace />
  }

  return children ?? <Outlet />
}
