import { body, param, query } from 'express-validator'
import { PRODUCT_CATEGORIES, UNIT_TYPES } from '../models/Product.js'

export const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required.')
    .isLength({ max: 200 }).withMessage('Name must be under 200 characters.'),

  body('category')
    .notEmpty().withMessage('Category is required.')
    .isIn(PRODUCT_CATEGORIES).withMessage(`Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}.`),

  body('price')
    .notEmpty().withMessage('Price is required.')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number.'),

  body('stock')
    .notEmpty().withMessage('Stock quantity is required.')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer.'),

  body('discountPrice')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Discount price must be a positive number.'),

  body('unit')
    .optional()
    .isIn(UNIT_TYPES).withMessage(`Unit must be one of: ${UNIT_TYPES.join(', ')}.`),

  body('description')
    .optional()
    .isLength({ max: 2000 }).withMessage('Description must be under 2000 characters.'),

  body('brand')
    .optional()
    .isLength({ max: 100 }).withMessage('Brand must be under 100 characters.'),

  body('sku')
    .optional()
    .isLength({ max: 100 }).withMessage('SKU must be under 100 characters.'),

  body('taxable')
    .optional()
    .isBoolean().withMessage('Taxable must be true or false.'),

  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 }).withMessage('Low stock threshold must be a non-negative integer.'),
]

export const validateUpdateProduct = [
  param('id').isMongoId().withMessage('Invalid product ID.'),

  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Product name cannot be empty.')
    .isLength({ max: 200 }).withMessage('Name must be under 200 characters.'),

  body('category')
    .optional()
    .isIn(PRODUCT_CATEGORIES).withMessage(`Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}.`),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number.'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer.'),

  body('discountPrice')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Discount price must be a positive number.'),

  body('unit')
    .optional()
    .isIn(UNIT_TYPES).withMessage(`Unit must be one of: ${UNIT_TYPES.join(', ')}.`),

  body('taxable')
    .optional()
    .isBoolean().withMessage('Taxable must be true or false.'),

  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 }).withMessage('Low stock threshold must be a non-negative integer.'),
]

export const validateProductId = [
  param('id').isMongoId().withMessage('Invalid product ID.'),
]

export const validateListProducts = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
  query('category').optional().isIn(PRODUCT_CATEGORIES).withMessage('Invalid category.'),
]
