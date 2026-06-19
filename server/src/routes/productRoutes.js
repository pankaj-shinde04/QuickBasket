import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { uploadProductImage, handleMulterError } from '../middleware/upload.js'
import { validate } from '../middleware/validate.js'
import {
  getProducts,
  getProductById,
  addProduct,
  editProduct,
  removeProduct,
} from '../controllers/productController.js'
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductId,
  validateListProducts,
} from '../validators/productValidator.js'

const router = Router()

// All product routes require authentication
router.use(authenticate)

// GET  /api/products          → list all products for the owner's shop
router.get('/', validateListProducts, validate, getProducts)

// GET  /api/products/:id      → get a single product
router.get('/:id', validateProductId, validate, getProductById)

// POST /api/products          → add a new product (with optional image upload)
router.post(
  '/',
  uploadProductImage,
  handleMulterError,
  validateCreateProduct,
  validate,
  addProduct
)

// PATCH /api/products/:id     → update a product (with optional image upload)
router.patch(
  '/:id',
  uploadProductImage,
  handleMulterError,
  validateUpdateProduct,
  validate,
  editProduct
)

// DELETE /api/products/:id    → soft-delete a product
router.delete('/:id', validateProductId, validate, removeProduct)

export default router
