import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'NetBanking'],
      required: true,
    },
    paymentGateway: {
      type: String,
      enum: ['Razorpay', 'Stripe', 'PayPal', 'PhonePe', 'GPay'],
      default: 'Razorpay',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    gatewayOrderId: {
      type: String,
    },
    gatewayPaymentId: {
      type: String,
    },
    gatewaySignature: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentDetails: {
      cardLast4Digits: { type: String },
      cardBrand: { type: String },
      upiId: { type: String },
      bankName: { type: String },
    },
    failureReason: {
      type: String,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundStatus: {
      type: String,
      enum: ['None', 'Pending', 'Completed', 'Failed'],
      default: 'None',
    },
    refundId: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.gatewaySignature
        return ret
      },
    },
  },
)

// Index for faster queries (no unique constraints)
paymentSchema.index({ customer: 1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ createdAt: -1 })

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema)

export default Payment
