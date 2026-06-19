import * as productService from '../services/productService.js'
import { uploadImageBuffer } from '../services/cloudinaryService.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import logger from '../utils/logger.js'

export const getProducts = asyncHandler(async (req, res) => {
  productService.assertShopOwner(req.user)
  const { page, limit, search, category } = req.query
  const result = await productService.listProducts(req.user._id, { page, limit, search, category })
  res.json({ success: true, data: result })
})

export const getProductById = asyncHandler(async (req, res) => {
  productService.assertShopOwner(req.user)
  const product = await productService.getProduct(req.user._id, req.params.id)
  res.json({ success: true, data: { product } })
})

export const addProduct = asyncHandler(async (req, res) => {
  productService.assertShopOwner(req.user)

  let imageUrl = null
  if (req.file) {
    imageUrl = await uploadImageBuffer(req.file.buffer, 'quickbasket/products')
    if (!imageUrl) {
      return res.status(500).json({ success: false, message: 'Failed to upload product image.' })
    }
  }

  const product = await productService.createProduct(req.user._id, req.body, imageUrl)
  res.status(201).json({ success: true, message: 'Product added successfully.', data: { product } })
})

export const editProduct = asyncHandler(async (req, res) => {
  productService.assertShopOwner(req.user)

  let imageUrl = null
  if (req.file) {
    imageUrl = await uploadImageBuffer(req.file.buffer, 'quickbasket/products')
    if (!imageUrl) {
      return res.status(500).json({ success: false, message: 'Failed to upload product image.' })
    }
  }

  const product = await productService.updateProduct(req.user._id, req.params.id, req.body, imageUrl)
  res.json({ success: true, message: 'Product updated successfully.', data: { product } })
})

export const removeProduct = asyncHandler(async (req, res) => {
  productService.assertShopOwner(req.user)
  logger.info(`Deleting product ${req.params.id} for user ${req.user._id}`)
  await productService.deleteProduct(req.user._id, req.params.id)
  logger.info(`Product ${req.params.id} permanently deleted from DB`)
  res.json({ success: true, message: 'Product deleted successfully.' })
})
