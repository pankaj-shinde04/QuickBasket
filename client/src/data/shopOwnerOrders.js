export const orderStats = [
  {
    label: 'New Orders',
    value: '24',
    trend: '+12%',
    trendUp: true,
    icon: 'new',
    iconBg: 'bg-primary-light',
    iconColor: 'text-primary',
  },
  {
    label: 'In Delivery',
    value: '8',
    trend: 'Stable',
    trendUp: null,
    icon: 'delivery',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    label: 'Completed',
    value: '142',
    trend: '+5%',
    trendUp: true,
    icon: 'completed',
    iconBg: 'bg-tertiary-light',
    iconColor: 'text-tertiary',
  },
  {
    label: 'Returns',
    value: '3',
    trend: '-2%',
    trendUp: false,
    icon: 'returns',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
  },
]

export const statusStyles = {
  New: 'bg-primary-light text-primary',
  Preparing: 'bg-yellow-100 text-yellow-800',
  Ready: 'bg-tertiary-light text-tertiary',
  Shipping: 'bg-neutral text-text-muted',
  Delivered: 'bg-gray-100 text-gray-500',
}

export const ORDER_ACTIONS = [
  { key: 'Accepted', label: 'Accept', icon: 'check' },
  { key: 'Preparing', label: 'Mark as Preparing', icon: 'preparing' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: 'delivery' },
  { key: 'Delivered', label: 'Delivered', icon: 'delivered' },
]

export const orders = [
  {
    id: 'ORD-8821',
    displayId: 'FR-8924',
    customer: {
      name: 'Sarah J. Miller',
      email: 'sarah.m@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      initials: 'SM',
    },
    date: 'Oct 24, 2:45 PM',
    orderedOn: 'Oct 24, 2023 • 02:45 PM',
    amount: 142.5,
    amountLabel: '$142.50',
    status: 'New',
    currentStatus: 'Accepted',
    tab: 'new',
    phone: '+1 (770) 900-2480',
    deliveryAddress: '452 Organic Valley, Greenwich District, London, SE10 9NF',
    customerNote:
      'Please leave the parcel in the wooden porch if no one is home. Thank you!',
    items: [
      {
        name: 'Organic Strawberries',
        category: 'Fruits',
        quantity: '2 x 500g',
        price: 4.5,
        total: 9.0,
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=80&h=80&fit=crop',
      },
      {
        name: 'Unsweetened Almond Milk',
        category: 'Dairy Free',
        quantity: '1 x 1L',
        price: 2.75,
        total: 2.75,
        image: 'https://images.unsplash.com/photo-1563636619-e91424eaafc3?w=80&h=80&fit=crop',
      },
      {
        name: 'Baby Spinach (Organic)',
        category: 'Vegetables',
        quantity: '3 x 200g',
        price: 1.8,
        total: 5.4,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80&h=80&fit=crop',
      },
      {
        name: 'Whole Grain Bread',
        category: 'Bakery',
        quantity: '1 x loaf',
        price: 3.25,
        total: 3.25,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop',
      },
    ],
    subtotal: 17.15,
    deliveryFee: 3.99,
    tax: 1.42,
    total: 22.56,
  },
  {
    id: 'ORD-8820',
    customer: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?img=1', initials: 'SJ' },
    date: 'Oct 24, 1:30 PM',
    amount: 84.5,
    amountLabel: '$84.50',
    status: 'Preparing',
    tab: 'new',
  },
  {
    id: 'ORD-8819',
    customer: { name: 'Mike Chen', avatar: 'https://i.pravatar.cc/150?img=3', initials: 'MC' },
    date: 'Oct 24, 12:15 PM',
    amount: 56.2,
    amountLabel: '$56.20',
    status: 'Ready',
    tab: 'new',
  },
  {
    id: 'ORD-8818',
    customer: { name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=5', initials: 'EW' },
    date: 'Oct 24, 11:00 AM',
    amount: 128.75,
    amountLabel: '$128.75',
    status: 'New',
    tab: 'new',
  },
  {
    id: 'ORD-8817',
    customer: { name: 'James Brown', avatar: 'https://i.pravatar.cc/150?img=8', initials: 'JB' },
    date: 'Oct 24, 10:20 AM',
    amount: 42.0,
    amountLabel: '$42.00',
    status: 'Preparing',
    tab: 'new',
  },
  {
    id: 'ORD-8810',
    customer: { name: 'Lisa Park', avatar: 'https://i.pravatar.cc/150?img=9', initials: 'LP' },
    date: 'Oct 23, 4:50 PM',
    amount: 91.3,
    amountLabel: '$91.30',
    status: 'Shipping',
    tab: 'active',
  },
  {
    id: 'ORD-8809',
    customer: { name: 'David Lee', avatar: 'https://i.pravatar.cc/150?img=12', initials: 'DL' },
    date: 'Oct 23, 3:30 PM',
    amount: 67.8,
    amountLabel: '$67.80',
    status: 'Shipping',
    tab: 'active',
  },
  {
    id: 'ORD-8800',
    customer: { name: 'Anna Smith', avatar: 'https://i.pravatar.cc/150?img=20', initials: 'AS' },
    date: 'Oct 22, 6:00 PM',
    amount: 55.0,
    amountLabel: '$55.00',
    status: 'Delivered',
    tab: 'completed',
  },
  {
    id: 'ORD-8799',
    customer: { name: 'Tom Harris', avatar: 'https://i.pravatar.cc/150?img=15', initials: 'TH' },
    date: 'Oct 22, 2:15 PM',
    amount: 112.4,
    amountLabel: '$112.40',
    status: 'Delivered',
    tab: 'completed',
  },
]

export function getOrderById(id) {
  return orders.find((o) => o.id === id || o.displayId === id)
}

export function getOrdersByTab(tab) {
  if (tab === 'all') return orders
  return orders.filter((o) => o.tab === tab)
}
