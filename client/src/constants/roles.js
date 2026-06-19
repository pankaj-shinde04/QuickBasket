export const ROLES = {
  CUSTOMER: 'customer',
  SHOP_OWNER: 'shop_owner',
  ADMIN: 'admin',
}

export const ROLE_CONFIG = [
  {
    value: ROLES.CUSTOMER,
    label: 'Customer',
    icon: 'shopping-bag',
    dashboardPath: '/dashboard/customer',
  },
  {
    value: ROLES.SHOP_OWNER,
    label: 'Shop Owner',
    icon: 'store',
    dashboardPath: '/dashboard/shop-owner',
  },
  {
    value: ROLES.ADMIN,
    label: 'Admin',
    icon: 'shield',
    dashboardPath: '/dashboard/admin',
  },
]

export const SIGNUP_ROLE_CONFIG = ROLE_CONFIG.filter((role) => role.value !== ROLES.ADMIN)

export function getDashboardPath(role) {
  return ROLE_CONFIG.find((r) => r.value === role)?.dashboardPath ?? '/'
}

export function getPostAuthPath(role, shopProfileComplete = true) {
  if (role === ROLES.CUSTOMER) return '/'
  if (role === ROLES.SHOP_OWNER && !shopProfileComplete) return '/register-shop'
  return getDashboardPath(role)
}

export const SHOP_REGISTER_PATH = '/register-shop'

export function getRoleLabel(role) {
  return ROLE_CONFIG.find((r) => r.value === role)?.label ?? role
}
