import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import config from '../config/index.js'
import ApiError from '../utils/ApiError.js'

export async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return next(new ApiError(401, 'Authentication required.'))
    }

    const decoded = jwt.verify(token, config.jwt.secret)
    const user = await User.findById(decoded.id)

    if (!user) {
      return next(new ApiError(401, 'User not found.'))
    }

    req.user = user
    next()
  } catch {
    next(new ApiError(401, 'Invalid or expired session.'))
  }
}

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'))
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to access this resource.'))
    }

    next()
  }
}
