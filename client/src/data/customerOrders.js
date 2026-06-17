export const ACTIVE_TRACKING_ORDER_ID = 'FR-88291'

export const orderFilters = ['All Orders', 'Last 3 Months', '2023']

export const customerOrderStatusStyles = {
  Delivered: 'bg-tertiary-light text-tertiary',
  Cancelled: 'bg-red-100 text-red-600',
  Processing: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-700',
}

export const customerOrders = [
  {
    id: 'ORD-7742',
    displayId: 'FR-77420',
    placedDate: 'Oct 12, 2023',
    total: 89.4,
    status: 'Delivered',
    trackable: false,
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1563636619-e91424eaafc3?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop',
    ],
    moreCount: 4,
  },
  {
    id: 'ORD-7610',
    displayId: 'FR-76108',
    placedDate: 'Sep 28, 2023',
    total: 124.99,
    status: 'Cancelled',
    trackable: false,
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=80&h=80&fit=crop',
    ],
    moreCount: 0,
  },
  {
    id: 'ORD-88291',
    displayId: 'FR-88291',
    placedDate: 'Just Now',
    total: 210.15,
    status: 'Processing',
    trackable: true,
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1563636619-e91424eaafc3?w=80&h=80&fit=crop',
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80&h=80&fit=crop',
    ],
    moreCount: 12,
  },
]

export const trackingTimeline = [
  { key: 'placed', label: 'Order Placed', icon: 'check', done: true },
  { key: 'accepted', label: 'Accepted', icon: 'check', done: true },
  { key: 'preparing', label: 'Preparing', icon: 'pot', done: true, active: true },
  { key: 'delivery', label: 'Out for Delivery', icon: 'bike', done: false },
  { key: 'delivered', label: 'Delivered', icon: 'check', done: false },
]

export const trackingOrder = {
  id: 'FR-88291',
  eta: '15 mins',
  expectedBy: '5:45 PM',
  courier: {
    name: 'Marcus Chen',
    rating: 4.9,
    deliveries: '1,200+',
    avatar: 'https://i.pravatar.cc/150?img=12',
    phone: '+1 (555) 234-5678',
  },
  mapMessage: 'Almost there! Your courier is 1.2 miles away.',
  items: [
    {
      name: 'Organic Hass Avocados',
      qty: 'Qty: 2',
      price: 4.0,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=60&h=60&fit=crop',
    },
    {
      name: 'Whole Grass-Fed Milk',
      qty: 'Qty: 1',
      price: 5.5,
      image: 'https://images.unsplash.com/photo-1563636619-e91424eaafc3?w=60&h=60&fit=crop',
    },
    {
      name: 'Organic Fairtrade Bananas',
      qty: 'Qty: 1 bunch',
      price: 3.2,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=60&h=60&fit=crop',
    },
  ],
  itemCount: 8,
  subtotal: 58.5,
  deliveryFee: 0,
  total: 64.5,
}

export function getCustomerOrder(id) {
  return customerOrders.find((o) => o.displayId === id || o.id === id)
}

export function getTrackingPath(orderId = ACTIVE_TRACKING_ORDER_ID) {
  return `/dashboard/customer/orders/${orderId}/track`
}
