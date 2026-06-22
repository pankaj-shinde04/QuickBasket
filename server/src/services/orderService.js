import Order from '../models/Order.js'

// Place a new order
export async function placeOrder(customerId, body) {
  const { items, deliveryAddress, phone, notes, subtotal, deliveryFee, serviceFee, total, paymentMethod } = body

  if (!items || items.length === 0) throw new Error('Order must have at least one item.')

  const order = await Order.create({
    customer: customerId,
    items,
    deliveryAddress: deliveryAddress || {},
    phone: phone || '',
    notes: notes || '',
    subtotal,
    deliveryFee: deliveryFee || 0,
    serviceFee: serviceFee || 0,
    total,
    paymentMethod: paymentMethod || 'COD',
  })
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
