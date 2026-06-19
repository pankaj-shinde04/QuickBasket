import { body, param, query } from 'express-validator'
import { USER_STATUS } from '../models/User.js'
import { SHOP_STATUS } from '../models/Shop.js'
import { ROLES } from '../constants/roles.js'

export const createAdminValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
]

export const listUsersValidator = [
  query('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role filter'),
  query('status')
    .optional()
    .isIn(Object.values(USER_STATUS))
    .withMessage('Invalid status filter'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive number'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString(),
]

export const updateUserStatusValidator = [
  param('id').isMongoId().withMessage('Invalid user id'),
  body('status')
    .isIn(Object.values(USER_STATUS))
    .withMessage('Invalid user status'),
]

export const listVendorsValidator = [
  query('status')
    .optional()
    .isIn(Object.values(SHOP_STATUS))
    .withMessage('Invalid vendor status filter'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive number'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString(),
]

export const vendorIdValidator = [
  param('id').isMongoId().withMessage('Invalid vendor id'),
]
