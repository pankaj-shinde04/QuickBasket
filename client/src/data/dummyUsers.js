import { ROLES } from '../constants/roles'

/** Dummy accounts for local testing — password for all: Test@1234 */
export const DUMMY_USERS = [
  {
    id: 'dummy-customer-001',
    firstName: 'Jane',
    lastName: 'Customer',
    email: 'customer@quickbasket.com',
    password: 'Test@1234',
    role: ROLES.CUSTOMER,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'dummy-shop-owner-001',
    firstName: 'John',
    lastName: 'Store',
    email: 'owner@quickbasket.com',
    password: 'Test@1234',
    role: ROLES.SHOP_OWNER,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'dummy-admin-001',
    firstName: 'Alex',
    lastName: 'Admin',
    email: 'admin@quickbasket.com',
    password: 'Test@1234',
    role: ROLES.ADMIN,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

export const DUMMY_PASSWORD = 'Test@1234'
