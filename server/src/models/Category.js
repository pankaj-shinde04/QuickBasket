import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
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
    slug: {
      type: String,
      required: false,
      trim: true,
    },
    icon: {
      type: String,
      default: '📦',
    },
    color: {
      type: String,
      default: 'bg-neutral text-text-dark',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Create compound index for shop + slug to make slug unique per shop
categorySchema.index({ shop: 1, slug: 1 }, { unique: true })

// Generate slug from name before saving
categorySchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
  }
  next()
})

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)

export default Category
