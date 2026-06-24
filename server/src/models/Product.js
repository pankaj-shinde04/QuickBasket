import mongoose from 'mongoose'

export const UNIT_TYPES = ['Piece', 'per lb', 'per kg', 'per pack', 'per bottle']

function generateSKU() {
  return 'SKU-' + Math.random().toString(36).toUpperCase().slice(2, 9)
}

const productSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    taxable: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    unit: {
      type: String,
      enum: UNIT_TYPES,
      default: 'Piece',
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Auto-generate SKU before saving if not provided
productSchema.pre('save', function (next) {
  if (!this.sku) {
    this.sku = generateSKU()
  }
  next()
})

// Virtual: stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'Out of Stock'
  if (this.stock <= this.lowStockThreshold) return 'Low Stock'
  return 'In Stock'
})

// Virtual: effective selling price
productSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice != null && this.discountPrice < this.price
    ? this.discountPrice
    : this.price
})

productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product
