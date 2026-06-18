import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import config from '../config/index.js'
import ApiError from '../utils/ApiError.js'
import { ROLES, SIGNUP_ROLES } from '../constants/roles.js'

function createToken(userId) {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

function toPublicUser(user) {
  return {
    id: user.id ?? user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
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

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
  })

  const token = createToken(user._id)

  return {
    user: toPublicUser(user),
    token,
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

  const token = createToken(user._id)

  return {
    user: toPublicUser(user),
    token,
  }
}

export async function getUserById(userId) {
  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(401, 'User not found.')
  }

  return toPublicUser(user)
}
