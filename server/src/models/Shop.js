import mongoose from 'mongoose'

export const SHOP_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
}

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: Object.values(SHOP_STATUS),
      default: SHOP_STATUS.PENDING,
    },
  },
  { timestamps: true }
)

const Shop = mongoose.models.Shop || mongoose.model('Shop', shopSchema)

export default Shop
