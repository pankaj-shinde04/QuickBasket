import { body, validationResult } from 'express-validator'

// Validation rules for placing an order
export const placeOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item'),
  
  body('items.*.productId')
    .notEmpty()
    .withMessage('Product ID is required for each item'),
  
  body('items.*.name')
    .notEmpty()
    .withMessage('Product name is required for each item'),
  
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('items.*.qty')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('deliveryAddress.fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  
  body('deliveryAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9]{6,15}$/)
    .withMessage('Phone number must be 6-15 digits'),
  
  body('deliveryAddress.email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),
  
  body('deliveryAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('deliveryAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('deliveryAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('deliveryAddress.postal')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required')
    .matches(/^[0-9]{3,10}$/)
    .withMessage('Postal code must be 3-10 digits'),
  
  body('deliveryInstructions')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Delivery instructions must not exceed 500 characters'),
  
  body('subtotal')
    .isFloat({ min: 0 })
    .withMessage('Subtotal must be a positive number'),
  
  body('deliveryFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Delivery fee must be a positive number'),
  
  body('serviceFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Service fee must be a positive number'),
  
  body('total')
    .isFloat({ min: 0 })
    .withMessage('Total must be a positive number'),
  
  body('paymentMethod')
    .optional()
    .isIn(['COD', 'Online', 'UPI', 'Card', 'NetBanking'])
    .withMessage('Invalid payment method'),
  
  // Payment details validation for online payments
  body('paymentDetails')
    .optional(),
  
  body('paymentDetails.upiId')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9.\-_@]{2,256}$/)
    .withMessage('Invalid UPI ID format'),
  
  body('paymentDetails.cardLast4Digits')
    .optional()
    .trim()
    .matches(/^[0-9]{4}$/)
    .withMessage('Card last 4 digits must be 4 digits'),
]

// Middleware to check validation results
export const validateOrder = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('Validation errors:', JSON.stringify(errors.array(), null, 2))
    console.log('Request body:', JSON.stringify(req.body, null, 2))
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    })
  }
  next()
}
