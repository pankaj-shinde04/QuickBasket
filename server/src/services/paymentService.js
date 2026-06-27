import Payment from '../models/Payment.js'
import Order from '../models/Order.js'

// Create a payment record for an order
export async function createPayment(customerId, orderData) {
  const { amount, paymentMethod, paymentDetails } = orderData
  
  const payment = await Payment.create({
    customer: customerId,
    amount,
    paymentMethod: paymentMethod === 'Online' ? 'UPI' : paymentMethod,
    status: 'Pending',
    paymentDetails: paymentDetails || {},
  })
  
  return payment
}

// Update payment status after successful payment
export async function updatePaymentStatus(paymentId, status, gatewayData = {}) {
  const payment = await Payment.findById(paymentId)
  if (!payment) throw new Error('Payment not found')
  
  payment.status = status
  
  if (gatewayData.transactionId) payment.transactionId = gatewayData.transactionId
  if (gatewayData.gatewayOrderId) payment.gatewayOrderId = gatewayData.gatewayOrderId
  if (gatewayData.gatewayPaymentId) payment.gatewayPaymentId = gatewayData.gatewayPaymentId
  if (gatewayData.gatewaySignature) payment.gatewaySignature = gatewayData.gatewaySignature
  
  await payment.save()
  return payment
}

// Process payment failure
export async function handlePaymentFailure(paymentId, reason) {
  const payment = await Payment.findById(paymentId)
  if (!payment) throw new Error('Payment not found')
  
  payment.status = 'Failed'
  payment.failureReason = reason
  await payment.save()
  
  // Update order status to cancelled if payment fails
  if (payment.order) {
    const order = await Order.findById(payment.order)
    if (order && order.status === 'Pending') {
      order.status = 'Cancelled'
      await order.save()
    }
  }
  
  return payment
}

// Get payment by order ID
export async function getPaymentByOrderId(orderId) {
  return Payment.findOne({ order: orderId }).lean()
}

// Get payment by transaction ID
export async function getPaymentByTransactionId(transactionId) {
  return Payment.findOne({ transactionId }).lean()
}

// Process refund
export async function processRefund(paymentId, refundAmount, refundId) {
  const payment = await Payment.findById(paymentId)
  if (!payment) throw new Error('Payment not found')
  
  if (payment.status !== 'Completed') {
    throw new Error('Can only refund completed payments')
  }
  
  payment.refundAmount = refundAmount
  payment.refundStatus = 'Completed'
  payment.refundId = refundId
  await payment.save()
  
  return payment
}

// Link payment to order
export async function linkPaymentToOrder(paymentId, orderId) {
  const payment = await Payment.findById(paymentId)
  if (!payment) throw new Error('Payment not found')
  
  const order = await Order.findById(orderId)
  if (!order) throw new Error('Order not found')
  
  payment.order = orderId
  await payment.save()
  
  order.payment = paymentId
  await order.save()
  
  return { payment, order }
}
