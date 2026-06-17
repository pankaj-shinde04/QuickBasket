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

export function getDashboardPath(role) {
  return ROLE_CONFIG.find((r) => r.value === role)?.dashboardPath ?? '/'
}

export function getRoleLabel(role) {
  return ROLE_CONFIG.find((r) => r.value === role)?.label ?? role
}
