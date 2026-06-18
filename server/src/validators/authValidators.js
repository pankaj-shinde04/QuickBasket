import { body } from 'express-validator'
import { SIGNUP_ROLES } from '../constants/roles.js'

export const registerValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .isIn(SIGNUP_ROLES)
    .withMessage('Role must be customer or shop_owner'),
]

export const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  body('password').notEmpty().withMessage('Password is required'),
]
