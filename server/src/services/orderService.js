import Order from '../models/Order.js'
import Payment from '../models/Payment.js'
import User from '../models/User.js'
import Product from '../models/Product.js'

// Place a new order
export async function placeOrder(customerId, body) {
  const { items, deliveryAddress, deliveryInstructions, subtotal, deliveryFee, serviceFee, total, paymentMethod, paymentDetails } = body

  if (!items || items.length === 0) throw new Error('Order must have at least one item.')

  if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.postal) {
    throw new Error('Delivery address is required with all required fields.')
  }

  // Get shop ID from the first product (all products should belong to the same shop)
  const firstProduct = await Product.findById(items[0].productId)
  if (!firstProduct) throw new Error('Product not found.')
  const shopId = firstProduct.shop

  // Verify all products belong to the same shop
  for (const item of items) {
    const product = await Product.findById(item.productId)
    if (!product) throw new Error(`Product ${item.productId} not found.`)
    if (product.shop.toString() !== shopId.toString()) {
      throw new Error('All products in an order must belong to the same shop.')
    }
  }

  const orderData = {
    customer: customerId,
    shop: shopId,
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

  // Increment salesCount for each ordered product (fire-and-forget)
  const bulkOps = items
    .filter((item) => item.productId && /^[0-9a-fA-F]{24}$/.test(item.productId))
    .map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { salesCount: item.qty || 1 } },
      },
    }))
  if (bulkOps.length > 0) {
    Product.bulkWrite(bulkOps).catch((err) =>
      console.error('Failed to update salesCount:', err)
    )
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

// Shop Owner: Get all orders for their shop (newest first) with customer details
export async function getAllOrders(shopId) {
  return Order.find({ shop: shopId })
    .populate('customer', 'name email phone')
    .populate('payment')
    .sort({ createdAt: -1 })
    .lean()
}

// Shop Owner: Get order by displayId (must belong to their shop)
export async function getOrderByDisplayIdForShopOwner(displayId, shopId) {
  const order = await Order.findOne({ displayId, shop: shopId })
    .populate('customer', 'name email phone')
    .populate('payment')
    .lean()
  return order
}

// Shop Owner: Update order status (must belong to their shop)
export async function updateOrderStatus(displayId, status, shopId) {
  const order = await Order.findOne({ displayId, shop: shopId })
  if (!order) throw new Error('Order not found.')
  order.status = status
  await order.save()
  return order
}

// Shop Owner: Get orders by status for their shop
export async function getOrdersByStatus(status, shopId) {
  return Order.find({ status, shop: shopId })
    .populate('customer', 'name email phone')
    .populate('payment')
    .sort({ createdAt: -1 })
    .lean()
}
