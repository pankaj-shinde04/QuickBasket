import Product from '../models/Product.js'
import Shop from '../models/Shop.js'
import ApiError from '../utils/ApiError.js'
import { ROLES } from '../constants/roles.js'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatProduct(product) {
  const p = product.toObject ? product.toObject() : product
  return {
    id: p._id.toString(),
    shop: p.shop?.toString(),
    name: p.name,
    description: p.description,
    category: p.category,
    brand: p.brand,
    sku: p.sku,
    image: p.image,
    price: p.price,
    discountPrice: p.discountPrice,
    taxable: p.taxable,
    stock: p.stock,
    unit: p.unit,
    lowStockThreshold: p.lowStockThreshold,
    isActive: p.isActive,
    stockStatus: p.stockStatus,
    effectivePrice: p.effectivePrice,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

async function getShopForOwner(ownerId) {
  const shop = await Shop.findOne({ owner: ownerId })
  if (!shop) throw new ApiError(404, 'Shop not found. Please register your shop first.')
  return shop
}

// ─── service functions ───────────────────────────────────────────────────────

/**
 * List all products for a shop owner (paginated + searchable).
 */
export async function listProducts(ownerId, { page = 1, limit = 20, search = '', category = '' } = {}) {
  const shop = await getShopForOwner(ownerId)

  const query = { shop: shop._id }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ]
  }

  if (category) {
    query.category = category
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ])

  const lowStockCount = await Product.countDocuments({
    shop: shop._id,
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
  })

  return {
    products: products.map(formatProduct),
    total,
    lowStockCount,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  }
}

/**
 * Get a single product by ID (must belong to the owner's shop).
 */
export async function getProduct(ownerId, productId) {
  const shop = await getShopForOwner(ownerId)
  const product = await Product.findOne({ _id: productId, shop: shop._id })
  if (!product) throw new ApiError(404, 'Product not found.')
  return formatProduct(product)
}

/**
 * Create a new product for the owner's shop.
 */
export async function createProduct(ownerId, payload, imageUrl = null) {
  const shop = await getShopForOwner(ownerId)

  const product = new Product({
    shop: shop._id,
    name: payload.name?.trim(),
    description: payload.description?.trim() || '',
    category: payload.category,
    brand: payload.brand?.trim() || '',
    sku: payload.sku?.trim() || undefined, // will auto-generate if blank
    image: imageUrl || '',
    price: Number(payload.price),
    discountPrice: payload.discountPrice ? Number(payload.discountPrice) : null,
    taxable: payload.taxable === true || payload.taxable === 'true',
    stock: Number(payload.stock),
    unit: payload.unit || 'Piece',
    lowStockThreshold: payload.lowStockThreshold ? Number(payload.lowStockThreshold) : 10,
  })

  await product.save()
  return formatProduct(product)
}

/**
 * Update an existing product (owner must own it).
 */
export async function updateProduct(ownerId, productId, payload, imageUrl = null) {
  const shop = await getShopForOwner(ownerId)
  const product = await Product.findOne({ _id: productId, shop: shop._id })
  if (!product) throw new ApiError(404, 'Product not found.')

  const fields = ['name', 'description', 'category', 'brand', 'sku', 'unit']
  fields.forEach((f) => {
    if (payload[f] !== undefined) product[f] = typeof payload[f] === 'string' ? payload[f].trim() : payload[f]
  })

  if (payload.price !== undefined) product.price = Number(payload.price)
  if (payload.discountPrice !== undefined)
    product.discountPrice = payload.discountPrice ? Number(payload.discountPrice) : null
  if (payload.stock !== undefined) product.stock = Number(payload.stock)
  if (payload.taxable !== undefined) product.taxable = payload.taxable === true || payload.taxable === 'true'
  if (payload.lowStockThreshold !== undefined) product.lowStockThreshold = Number(payload.lowStockThreshold)
  if (imageUrl) product.image = imageUrl

  await product.save()
  return formatProduct(product)
}

/**
 * Permanently delete a product from the database.
 */
export async function deleteProduct(ownerId, productId) {
  const shop = await getShopForOwner(ownerId)
  const product = await Product.findOneAndDelete({ _id: productId, shop: shop._id })
  if (!product) throw new ApiError(404, 'Product not found.')
}

/**
 * Assert user is a shop owner.
 */
export function assertShopOwner(user) {
  if (user.role !== ROLES.SHOP_OWNER) {
    throw new ApiError(403, 'Only shop owners can manage inventory.')
  }
}
