const DEFAULT_DELIVERY_FEE = 2.99
const DEFAULT_SERVICE_FEE_RATE = 0.05
const DEFAULT_TAX_RATE = 0.08

export function deriveStockStatus(quantity, lowStockThreshold = 10) {
  if (quantity <= 0) return 'out_of_stock'
  if (quantity <= lowStockThreshold) return 'low_stock'
  return 'in_stock'
}

export function calculateOrderTotals({
  items = [],
  deliveryFee = DEFAULT_DELIVERY_FEE,
  serviceFeeRate = DEFAULT_SERVICE_FEE_RATE,
  taxRate = DEFAULT_TAX_RATE,
  discount = 0,
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const serviceFee = subtotal * serviceFeeRate
  const taxableAmount = Math.max(0, subtotal + deliveryFee + serviceFee - discount)
  const tax = taxableAmount * taxRate
  const total = taxableAmount + tax

  return {
    subtotal: roundMoney(subtotal),
    deliveryFee: roundMoney(deliveryFee),
    serviceFee: roundMoney(serviceFee),
    discount: roundMoney(discount),
    tax: roundMoney(tax),
    total: roundMoney(total),
  }
}

function roundMoney(value) {
  return Math.round(value * 100) / 100
}
