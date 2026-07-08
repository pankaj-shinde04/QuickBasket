import { Router } from 'express'
import Product from '../models/Product.js'
import Shop from '../models/Shop.js'
import Category from '../models/Category.js'

const router = Router()

// ─── Helper: attach shop info to a list of lean product docs ─────────────────
async function attachShopInfo(products) {
  if (!products.length) return []
  const shopIds = [...new Set(products.map((p) => p.shop?.toString()).filter(Boolean))]
  const shops = await Shop.find({ _id: { $in: shopIds } }, 'name logo').lean()
  const shopMap = Object.fromEntries(shops.map((s) => [s._id.toString(), s]))

  return products.map((p) => {
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
      isFeatured: p.isFeatured || false,
      salesCount: p.salesCount || 0,
      viewCount: p.viewCount || 0,
      shopId: p.shop?.toString(),
      shopName: shop.name || '',
      shopLogo: shop.logo || '',
    }
  })
}

// ─── GET /api/public/products/featured ───────────────────────────────────────
// IMPORTANT: specific sub-paths MUST be defined before '/products/:id'
router.get('/products/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query
    let products = await Product.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean()

    if (products.length === 0) {
      products = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean()
    }

    const formatted = await attachShopInfo(products)
    res.json({ success: true, data: { products: formatted } })
  } catch (err) {
    console.error('GET /public/products/featured error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch featured products.' })
  }
})

// ─── GET /api/public/products/trending ───────────────────────────────────────
router.get('/products/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const products = await Product.find({ isActive: true })
      .sort({ viewCount: -1, salesCount: -1, createdAt: -1 })
      .limit(Number(limit))
      .lean()

    const formatted = await attachShopInfo(products)
    res.json({ success: true, data: { products: formatted } })
  } catch (err) {
    console.error('GET /public/products/trending error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch trending products.' })
  }
})

// ─── GET /api/public/products/best-sellers ───────────────────────────────────
router.get('/products/best-sellers', async (req, res) => {
  try {
    const { limit = 6 } = req.query
    const products = await Product.find({ isActive: true })
      .sort({ salesCount: -1, createdAt: -1 })
      .limit(Number(limit))
      .lean()

    const formatted = await attachShopInfo(products)
    res.json({ success: true, data: { products: formatted } })
  } catch (err) {
    console.error('GET /public/products/best-sellers error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch best sellers.' })
  }
})

// ─── GET /api/public/products — general browse ───────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 20 } = req.query
    const query = { isActive: true }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ]
    }
    if (category && category !== 'All') query.category = category

    const skip = (Number(page) - 1) * Number(limit)
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ])

    const formatted = await attachShopInfo(products)
    res.json({
      success: true,
      data: {
        products: formatted,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (err) {
    console.error('GET /public/products error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch products.' })
  }
})

// ─── GET /api/public/products/:id — single product ───────────────────────────
// MUST be after all /products/* named routes
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(404).json({ success: false, message: 'Product not found.' })
    }

    const product = await Product.findById(id).lean()
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' })

    // Increment view count (fire-and-forget)
    Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).catch(() => {})

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
          isFeatured: product.isFeatured || false,
          salesCount: product.salesCount || 0,
          shopId: product.shop?.toString(),
          shopName: shop?.name || '',
          shopLogo: shop?.logo || '',
          shopAddress: shop?.address || '',
          shopContact: shop?.contactNumber || '',
        },
      },
    })
  } catch (err) {
    console.error('GET /public/products/:id error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch product.' })
  }
})

// ─── GET /api/public/categories ───────────────────────────────────────────────
router.get('/categories', async (_req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean()

    const seen = new Set()
    const formatted = []
    for (const cat of categories) {
      if (!seen.has(cat.name)) {
        seen.add(cat.name)
        formatted.push({
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
          icon: cat.icon || '📦',
          color: cat.color || 'bg-neutral text-text-dark',
        })
      }
    }

    res.json({ success: true, data: { categories: formatted } })
  } catch (err) {
    console.error('GET /public/categories error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' })
  }
})

// ─── GET /api/public/shops ────────────────────────────────────────────────────
router.get('/shops', async (req, res) => {
  try {
    const { limit = 4 } = req.query
    const shops = await Shop.find({}, 'name logo').sort({ createdAt: -1 }).limit(Number(limit)).lean()

    if (!shops.length) {
      return res.json({ success: true, data: { shops: [] } })
    }

    const shopIds = shops.map((s) => s._id)

    const productCounts = await Product.aggregate([
      { $match: { shop: { $in: shopIds }, isActive: true } },
      { $group: { _id: '$shop', count: { $sum: 1 }, totalSales: { $sum: '$salesCount' } } },
    ])

    const countMap = Object.fromEntries(
      productCounts.map((p) => [p._id.toString(), { count: p.count, totalSales: p.totalSales }])
    )

    const formatted = shops
      .map((s) => ({
        id: s._id.toString(),
        name: s.name,
        logo: s.logo || '',
        productCount: countMap[s._id.toString()]?.count || 0,
        totalSales: countMap[s._id.toString()]?.totalSales || 0,
      }))
      .sort((a, b) => b.totalSales - a.totalSales)

    res.json({ success: true, data: { shops: formatted } })
  } catch (err) {
    console.error('GET /public/shops error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch shops.' })
  }
})

export default router
