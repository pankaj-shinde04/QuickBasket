export const wishlistItems = [
  {
    id: 1,
    name: 'Organic Bananas',
    category: 'Produce',
    price: 2.49,
    unit: '/ lb',
    rating: 4.8,
    reviews: 124,
    badge: 'ORGANIC',
    badgeColor: 'bg-tertiary-light text-tertiary',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Whole Milk (1L)',
    category: 'Dairy',
    price: 3.99,
    unit: '',
    rating: 4.6,
    reviews: 89,
    badge: null,
    image: 'https://images.unsplash.com/photo-1563636619-e91424eaafc3?w=300&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Hass Avocados',
    category: 'Produce',
    price: 4.99,
    unit: '/ pack',
    rating: 4.9,
    reviews: 210,
    badge: 'TOP RATED',
    badgeColor: 'bg-secondary/30 text-yellow-800',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop',
  },
  {
    id: 4,
    name: 'Artisan Sourdough',
    category: 'Bakery',
    price: 5.49,
    unit: '/ loaf',
    rating: 4.7,
    reviews: 56,
    badge: 'ORGANIC',
    badgeColor: 'bg-tertiary-light text-tertiary',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop',
  },
]

export const cartItems = [
  {
    id: 1,
    name: 'Fresh Organic Broccolini',
    description: 'Bunch (approx. 1lb)',
    category: 'ORGANIC',
    categoryColor: 'bg-tertiary-light text-tertiary',
    price: 3.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: 'Sourdough Loaf',
    description: 'Fresh baked daily',
    category: 'BAKERY',
    categoryColor: 'bg-orange-100 text-orange-700',
    price: 4.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop',
  },
  {
    id: 3,
    name: 'Organic Blueberries',
    description: 'Pint container',
    category: 'LOCAL',
    categoryColor: 'bg-tertiary-light text-tertiary',
    price: 5.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=100&h=100&fit=crop',
  },
]

export const savedForLater = [
  {
    id: 4,
    name: 'Honeycrisp Apples',
    description: '3 lb bag',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=80&h=80&fit=crop',
  },
  {
    id: 5,
    name: 'Greek Yogurt',
    description: '32 oz tub',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop',
  },
]

export const checkoutItems = [
  {
    name: 'Organic Bananas',
    qty: 1,
    unitPrice: 4.99,
    total: 4.99,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=60&h=60&fit=crop',
  },
  {
    name: 'Whole Milk (1L)',
    qty: 2,
    unitPrice: 3.5,
    total: 7.0,
    image: 'https://images.unsplash.com/photo-1563636619-e91424eaafc3?w=60&h=60&fit=crop',
  },
  {
    name: 'Spring Salad Mix',
    qty: 1,
    unitPrice: 6.45,
    total: 6.45,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=60&h=60&fit=crop',
  },
]

export const cartSummary = {
  subtotal: 18.96,
  itemCount: 4,
  deliveryFee: 0,
  serviceFee: 3.01,
  total: 21.97,
}

export const checkoutSummary = {
  subtotal: 18.44,
  deliveryFee: 0,
  serviceFee: 1.5,
  total: 19.94,
}

export const CART_ITEM_COUNT = 3
