import Razorpay from 'razorpay'
import Payment from '../models/Payment.js'
import Order from '../models/Order.js'
import { updatePaymentStatus, handlePaymentFailure, linkPaymentToOrder } from './paymentService.js'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Create Razorpay order
export async function createRazorpayOrder(amount, currency = 'INR', receipt) {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes: {
        key1: 'value3',
        key2: 'value2',
      },
    }

    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    throw new Error('Failed to create payment order')
  }
}

// Verify Razorpay payment signature
export async function verifyPaymentSignature(orderId, paymentId, signature) {
  try {
    const crypto = await import('crypto')
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex')

    return generatedSignature === signature
  } catch (error) {
    console.error('Signature verification error:', error)
    throw new Error('Payment verification failed')
  }
}

// Process successful Razorpay payment
export async function processSuccessfulPayment(orderId, paymentId, signature) {
  try {
    // Verify signature
    const isValid = await verifyPaymentSignature(orderId, paymentId, signature)
    if (!isValid) {
      throw new Error('Invalid payment signature')
    }

    // Find payment by Razorpay order ID
    const payment = await Payment.findOne({ gatewayOrderId: orderId })
    if (!payment) {
      throw new Error('Payment record not found')
    }

    // Update payment status
    const updatedPayment = await updatePaymentStatus(payment._id, 'Completed', {
      transactionId: paymentId,
      gatewayPaymentId: paymentId,
      gatewaySignature: signature,
    })

    // Update order status
    if (payment.order) {
      const order = await Order.findById(payment.order)
      if (order) {
        order.status = 'Processing'
        await order.save()
      }
    }

    return updatedPayment
  } catch (error) {
    console.error('Payment processing error:', error)
    throw error
  }
}

// Process failed Razorpay payment
export async function processFailedPayment(orderId, reason) {
  try {
    const payment = await Payment.findOne({ gatewayOrderId: orderId })
    if (!payment) {
      throw new Error('Payment record not found')
    }

    await handlePaymentFailure(payment._id, reason)
    return payment
  } catch (error) {
    console.error('Failed payment processing error:', error)
    throw error
  }
}

// Get Razorpay key ID for frontend
export function getRazorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID
}

// Fetch payment details from Razorpay
export async function fetchPaymentDetails(paymentId) {
  try {
    const payment = await razorpay.payments.fetch(paymentId)
    return payment
  } catch (error) {
    console.error('Fetch payment details error:', error)
    throw new Error('Failed to fetch payment details')
  }
}
