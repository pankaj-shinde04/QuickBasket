import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js'
import {
  validateCreateCategory,
  validateUpdateCategory,
} from '../validators/categoryValidator.js'

const router = Router()

// All category routes require authentication
router.use(authenticate)

// GET  /api/categories          → get all categories for the owner's shop
router.get('/', getCategories)

// POST /api/categories          → create a new category
router.post('/', validateCreateCategory, validate, createCategory)

// PATCH /api/categories/:id     → update a category
router.patch('/:id', validateUpdateCategory, validate, updateCategory)

// DELETE /api/categories/:id    → delete a category
router.delete('/:id', deleteCategory)

export default router
