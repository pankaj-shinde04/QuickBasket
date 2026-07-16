import { ROLES } from '../constants/roles'

/** Demo account emails for quick-login panel — no passwords stored client-side */
export const DUMMY_USERS = [
  {
    id: 'dummy-customer-001',
    firstName: 'Jane',
    lastName: 'Customer',
    email: 'customer@quickbasket.com',
    role: ROLES.CUSTOMER,
  },
  {
    id: 'dummy-shop-owner-001',
    firstName: 'John',
    lastName: 'Store',
    email: 'owner@quickbasket.com',
    role: ROLES.SHOP_OWNER,
  },
]
