import Category from '../models/Category.js'
import Shop from '../models/Shop.js'
import ApiError from '../utils/ApiError.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getCategories = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id })
  if (!shop) throw new ApiError(404, 'Shop not found.')

  const categories = await Category.find({ shop: shop._id, isActive: true }).sort({ name: 1 })
  res.json({ success: true, data: { categories } })
})

export const createCategory = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id })
  if (!shop) throw new ApiError(404, 'Shop not found.')

  const { name, icon, color, description } = req.body

  // Check if category with same name exists for this shop
  const existingCategory = await Category.findOne({ shop: shop._id, name: name.trim() })
  if (existingCategory) {
    throw new ApiError(400, 'Category with this name already exists.')
  }

  const category = await Category.create({
    shop: shop._id,
    name: name.trim(),
    icon: icon || '📦',
    color: color || 'bg-neutral text-text-dark',
    description: description?.trim() || '',
  })

  res.status(201).json({ success: true, message: 'Category created successfully.', data: { category } })
})

export const updateCategory = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id })
  if (!shop) throw new ApiError(404, 'Shop not found.')

  const category = await Category.findOne({ _id: req.params.id, shop: shop._id })
  if (!category) throw new ApiError(404, 'Category not found.')

  const { name, icon, color, description } = req.body

  if (name) {
    const existingCategory = await Category.findOne({ shop: shop._id, name: name.trim(), _id: { $ne: req.params.id } })
    if (existingCategory) {
      throw new ApiError(400, 'Category with this name already exists.')
    }
    category.name = name.trim()
  }

  if (icon !== undefined) category.icon = icon
  if (color !== undefined) category.color = color
  if (description !== undefined) category.description = description?.trim() || ''

  await category.save()

  res.json({ success: true, message: 'Category updated successfully.', data: { category } })
})

export const deleteCategory = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id })
  if (!shop) throw new ApiError(404, 'Shop not found.')

  const category = await Category.findOne({ _id: req.params.id, shop: shop._id })
  if (!category) throw new ApiError(404, 'Category not found.')

  await Category.findByIdAndDelete(req.params.id)

  res.json({ success: true, message: 'Category deleted successfully.' })
})
