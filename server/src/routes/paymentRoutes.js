import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  createRazorpayOrder,
  processSuccessfulPayment,
  processFailedPayment,
  getRazorpayKeyId,
  fetchPaymentDetails,
} from '../services/razorpayService.js'
import { createPayment, linkPaymentToOrder } from '../services/paymentService.js'

const router = express.Router()

// All payment routes require authentication
router.use(authenticate)

// GET /api/payments/razorpay/key — get Razorpay key ID for frontend
router.get(
  '/razorpay/key',
  asyncHandler(async (req, res) => {
    const keyId = getRazorpayKeyId()
    res.json({ success: true, data: { keyId } })
  }),
)

// POST /api/payments/razorpay/create-order — create Razorpay order
router.post(
  '/razorpay/create-order',
  authorize('customer'),
  asyncHandler(async (req, res) => {
    const { amount, orderId } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' })
    }

    // Create payment record in database
    const payment = await createPayment(req.user._id, {
      amount,
      paymentMethod: 'UPI',
      paymentGateway: 'Razorpay',
    })

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(amount, 'INR', payment._id.toString())

    // Update payment with Razorpay order ID
    payment.gatewayOrderId = razorpayOrder.id
    await payment.save()

    res.json({
      success: true,
      data: {
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
        paymentId: payment._id,
      },
    })
  }),
)

// POST /api/payments/razorpay/verify — verify Razorpay payment
router.post(
  '/razorpay/verify',
  authorize('customer'),
  asyncHandler(async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' })
    }

    // Process successful payment
    const payment = await processSuccessfulPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    // Link payment to order if orderId provided
    if (orderId) {
      await linkPaymentToOrder(payment._id, orderId)
    }

    res.json({ success: true, data: { payment } })
  }),
)

// POST /api/payments/razorpay/failed — handle failed Razorpay payment
router.post(
  '/razorpay/failed',
  authorize('customer'),
  asyncHandler(async (req, res) => {
    const { razorpayOrderId, reason } = req.body

    if (!razorpayOrderId) {
      return res.status(400).json({ success: false, message: 'Missing order ID' })
    }

    const payment = await processFailedPayment(razorpayOrderId, reason || 'Payment failed')

    res.json({ success: true, data: { payment } })
  }),
)

// GET /api/payments/:paymentId — get payment details
router.get(
  '/:paymentId',
  authorize('customer'),
  asyncHandler(async (req, res) => {
    const { paymentId } = req.params

    // Fetch from Razorpay
    const razorpayPayment = await fetchPaymentDetails(paymentId)

    res.json({ success: true, data: { payment: razorpayPayment } })
  }),
)

export default router
