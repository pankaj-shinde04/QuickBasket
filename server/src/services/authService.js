import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User, { USER_STATUS } from '../models/User.js'
import Shop, { SHOP_STATUS } from '../models/Shop.js'
import config from '../config/index.js'
import ApiError from '../utils/ApiError.js'
import { formatPublicUser } from '../utils/userFormatter.js'
import { ROLES, SIGNUP_ROLES } from '../constants/roles.js'
import { sendShopOwnerPendingEmail } from './emailService.js'
import { buildDefaultShopName } from './vendorService.js'

function createToken(userId) {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

function getLoginStatusMessage(status) {
  if (status === USER_STATUS.PENDING) {
    return 'Your account is pending admin verification. Please wait for approval email before logging in.'
  }

  if (status === USER_STATUS.REJECTED) {
    return 'Your shop owner application was declined. Contact support if you need help.'
  }

  if (status === USER_STATUS.BANNED) {
    return 'This account has been banned. Contact support.'
  }

  return 'You are not allowed to log in at this time.'
}

export async function registerUser({ firstName, lastName, email, password, role }) {
  if (!SIGNUP_ROLES.includes(role)) {
    throw new ApiError(400, 'Only customer and shop owner accounts can be created through registration.')
  }

  const normalizedEmail = email.trim().toLowerCase()
  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.')
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const isShopOwner = role === ROLES.SHOP_OWNER

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
    status: isShopOwner ? USER_STATUS.PENDING : USER_STATUS.ACTIVE,
  })

  if (isShopOwner) {
    const shopName = buildDefaultShopName(firstName, lastName)

    await Shop.create({
      owner: user._id,
      name: shopName,
      email: normalizedEmail,
      status: SHOP_STATUS.PENDING,
    })

    void sendShopOwnerPendingEmail(user, shopName)

    return {
      user: formatPublicUser(user),
      pending: true,
    }
  }

  const token = createToken(user._id)

  return {
    user: formatPublicUser(user),
    token,
    pending: false,
  }
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = await User.findOne({ email: normalizedEmail }).select('+password')

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.')
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(403, getLoginStatusMessage(user.status))
  }

  const token = createToken(user._id)

  return {
    user: formatPublicUser(user),
    token,
  }
}

export async function getUserById(userId) {
  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(401, 'User not found.')
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(403, getLoginStatusMessage(user.status))
  }

  return formatPublicUser(user)
}
