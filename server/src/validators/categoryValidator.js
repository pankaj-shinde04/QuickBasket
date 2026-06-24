import { body, param } from 'express-validator'

export const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required.')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters.'),

  body('icon')
    .optional()
    .isLength({ max: 10 }).withMessage('Icon must be under 10 characters.'),

  body('color')
    .optional()
    .isLength({ max: 50 }).withMessage('Color must be under 50 characters.'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters.'),
]

export const validateUpdateCategory = [
  param('id').isMongoId().withMessage('Invalid category ID.'),

  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Category name cannot be empty.')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters.'),

  body('icon')
    .optional()
    .isLength({ max: 10 }).withMessage('Icon must be under 10 characters.'),

  body('color')
    .optional()
    .isLength({ max: 50 }).withMessage('Color must be under 50 characters.'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters.'),
]
