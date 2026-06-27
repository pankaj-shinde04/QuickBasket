import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  category: { type: String, default: '' },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  unit: { type: String, default: '' },
})

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    displayId: { type: String, unique: true },
    items: { type: [orderItemSchema], required: true },
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      alternatePhone: { type: String, default: '' },
      email: { type: String, default: '' },
      street: { type: String, required: true },
      landmark: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    deliveryInstructions: { type: String, default: '' },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online', 'UPI', 'Card', 'NetBanking'],
      default: 'COD',
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true },
)

// Auto-generate a human-readable display ID before save
orderSchema.pre('save', async function (next) {
  if (!this.displayId) {
    const count = await mongoose.model('Order').countDocuments()
    this.displayId = `QB${String(count + 1).padStart(5, '0')}`
  }
  next()
})

export default mongoose.model('Order', orderSchema)
