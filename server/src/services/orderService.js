import Order from '../models/Order.js'
import Payment from '../models/Payment.js'

// Place a new order
export async function placeOrder(customerId, body) {
  const { items, deliveryAddress, deliveryInstructions, subtotal, deliveryFee, serviceFee, total, paymentMethod, paymentDetails } = body

  if (!items || items.length === 0) throw new Error('Order must have at least one item.')

  if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.postal) {
    throw new Error('Delivery address is required with all required fields.')
  }

  const orderData = {
    customer: customerId,
    items,
    deliveryAddress,
    deliveryInstructions: deliveryInstructions || '',
    subtotal,
    deliveryFee: deliveryFee || 0,
    serviceFee: serviceFee || 0,
    total,
    paymentMethod: paymentMethod || 'COD',
  }

  // If payment method is online, create payment record
  if (paymentMethod !== 'COD') {
    const payment = await Payment.create({
      customer: customerId,
      amount: total,
      paymentMethod: paymentMethod === 'Online' ? 'UPI' : paymentMethod,
      status: 'Pending',
      paymentDetails: paymentDetails || {},
    })
    orderData.payment = payment._id
  }

  const order = await Order.create(orderData)
  
  // Populate payment if exists
  if (order.payment) {
    await order.populate('payment')
  }
  
  return order
}

// Get all orders for a customer (newest first)
export async function getCustomerOrders(customerId) {
  return Order.find({ customer: customerId }).sort({ createdAt: -1 }).lean()
}

// Get single order by displayId (owned by customer)
export async function getOrderByDisplayId(customerId, displayId) {
  const order = await Order.findOne({ customer: customerId, displayId }).lean()
  return order
}

// Cancel an order
export async function cancelOrder(customerId, displayId) {
  const order = await Order.findOne({ customer: customerId, displayId })
  if (!order) throw new Error('Order not found.')
  if (['Delivered', 'Shipped'].includes(order.status)) {
    throw new Error('Cannot cancel an order that is already shipped or delivered.')
  }
  order.status = 'Cancelled'
  await order.save()
  return order
}

// Get all orders (for admin/shop-owner)
export async function getAllOrders() {
  return Order.find().sort({ createdAt: -1 }).populate('customer', 'firstName lastName email').lean()
}

// Get single order by ID (for admin/shop-owner)
export async function getOrderById(orderId) {
  const order = await Order.findById(orderId).populate('customer', 'firstName lastName email').lean()
  if (!order) throw new Error('Order not found.')
  return order
}

// Update order status (for admin/shop-owner)
export async function updateOrderStatus(orderId, status) {
  const order = await Order.findById(orderId)
  if (!order) throw new Error('Order not found.')
  
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status.')
  }
  
  order.status = status
  await order.save()
  return order
}
