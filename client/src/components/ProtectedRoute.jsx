import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath, getPostAuthPath, ROLES } from '../constants/roles'

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral">
      <p className="text-sm font-medium text-text-muted">Loading...</p>
    </div>
  )
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return children
}

/** Public storefront — guests and customers can browse; shop owners and admins cannot */
export function StorefrontRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <AuthLoading />
  }

  if (isAuthenticated && user.role !== ROLES.CUSTOMER) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return children
}

export function GuestRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <AuthLoading />
  }

  if (isAuthenticated) {
    return <Navigate to={getPostAuthPath(user.role)} replace />
  }

  return children
}
