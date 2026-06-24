import { Router } from 'express'
import Product from '../models/Product.js'
import Shop from '../models/Shop.js'
import Category from '../models/Category.js'

const router = Router()

// GET /api/public/products?search=&category=&page=1&limit=20
router.get('/products', async (req, res) => {
  const { search = '', category = '', page = 1, limit = 20 } = req.query
  const query = {}

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ]
  }
  if (category) query.category = category

  const skip = (Number(page) - 1) * Number(limit)
  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(query),
  ])

  // Attach shop name to each product
  const shopIds = [...new Set(products.map((p) => p.shop?.toString()).filter(Boolean))]
  const shops = await Shop.find({ _id: { $in: shopIds } }, 'name logo').lean()
  const shopMap = Object.fromEntries(shops.map((s) => [s._id.toString(), s]))

  const formatted = products.map((p) => {
    const shop = shopMap[p.shop?.toString()] || {}
    return {
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      category: p.category,
      brand: p.brand,
      image: p.image || '',
      price: p.price,
      discountPrice: p.discountPrice || null,
      stock: p.stock,
      unit: p.unit,
      taxable: p.taxable,
      shopId: p.shop?.toString(),
      shopName: shop.name || '',
      shopLogo: shop.logo || '',
    }
  })

  res.json({
    success: true,
    data: {
      products: formatted,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    },
  })
})

// GET /api/public/products/:id
router.get('/products/:id', async (req, res) => {
  // Check if the ID is a valid MongoDB ObjectId
  const { id } = req.params
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id)

  if (!isValidObjectId) {
    return res.status(404).json({ success: false, message: 'Product not found.' })
  }

  const product = await Product.findById(id).lean()
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' })

  const shop = product.shop
    ? await Shop.findById(product.shop, 'name logo address contactNumber').lean()
    : null

  res.json({
    success: true,
    data: {
      product: {
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        image: product.image || '',
        price: product.price,
        discountPrice: product.discountPrice || null,
        stock: product.stock,
        unit: product.unit,
        taxable: product.taxable,
        shopId: product.shop?.toString(),
        shopName: shop?.name || '',
        shopLogo: shop?.logo || '',
        shopAddress: shop?.address || '',
        shopContact: shop?.contactNumber || '',
      },
    },
  })
})

// GET /api/public/categories — get all active categories
router.get('/categories', async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 })
  const formatted = categories.map((cat) => ({
    id: cat._id.toString(),
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
  }))
  res.json({ success: true, data: { categories: formatted } })
})

export default router
