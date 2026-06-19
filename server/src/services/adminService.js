import bcrypt from 'bcryptjs'
import User, { USER_STATUS } from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import { formatAdminUserListItem, formatPublicUser } from '../utils/userFormatter.js'
import { getPagination, buildPaginationMeta } from '../utils/pagination.js'
import { ROLES } from '../constants/roles.js'

export async function createAdmin({ firstName, lastName, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.')
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
  })

  return formatPublicUser(user)
}

export async function listAdmins() {
  const admins = await User.find({ role: ROLES.ADMIN })
    .sort({ createdAt: -1 })
    .select('-password')

  return admins.map(formatAdminUserListItem)
}

export async function listUsers(query = {}) {
  const { page, limit, skip } = getPagination(query, 10)
  const filter = {}

  if (query.role) {
    filter.role = query.role
  }

  if (query.status) {
    filter.status = query.status
  }

  if (query.search) {
    const search = query.search.trim()
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password'),
    User.countDocuments(filter),
  ])

  return {
    users: users.map(formatAdminUserListItem),
    pagination: buildPaginationMeta({ page, limit, total }),
  }
}

export async function getUserStats() {
  const [totalCustomers, activeCustomers, bannedCustomers, totalAdmins] = await Promise.all([
    User.countDocuments({ role: ROLES.CUSTOMER }),
    User.countDocuments({ role: ROLES.CUSTOMER, status: USER_STATUS.ACTIVE }),
    User.countDocuments({ role: ROLES.CUSTOMER, status: USER_STATUS.BANNED }),
    User.countDocuments({ role: ROLES.ADMIN }),
  ])

  return {
    totalCustomers,
    activeCustomers,
    bannedCustomers,
    totalAdmins,
  }
}

export async function updateUserStatus(userId, status) {
  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(404, 'User not found.')
  }

  if (user.role === ROLES.ADMIN) {
    throw new ApiError(400, 'Admin account status cannot be changed from this panel.')
  }

  user.status = status
  await user.save()

  return formatAdminUserListItem(user)
}
