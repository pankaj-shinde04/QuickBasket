import { body } from 'express-validator'
import { SIGNUP_ROLES } from '../constants/roles.js'

// Password must be at least 8 characters and contain at least one uppercase, one lowercase, one number, and one special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const registerValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  body('password')
    .matches(passwordRegex)
    .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)'),
  body('role')
    .isIn(SIGNUP_ROLES)
    .withMessage('Role must be customer or shop_owner'),
]

export const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  body('password').notEmpty().withMessage('Password is required'),
]
