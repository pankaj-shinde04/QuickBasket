export const platformStats = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$124.5k',
    trend: '+12.5% from last month',
    trendUp: true,
    iconBg: 'bg-primary-light',
    iconColor: 'text-primary',
  },
  {
    id: 'users',
    label: 'Active Users',
    value: '8,240',
    trend: '+4.2% from last month',
    trendUp: true,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-700',
  },
  {
    id: 'performance',
    label: 'Shop Performance',
    value: '94.2%',
    trend: 'Stable metrics',
    trendUp: null,
    iconBg: 'bg-tertiary-light',
    iconColor: 'text-tertiary',
  },
]

export const analyticsStats = [
  { id: 'users', label: 'Total Users', value: '24,512', trend: '+12%', icon: 'users' },
  { id: 'shops', label: 'Total Shops', value: '1,204', trend: '+5%', icon: 'shops' },
  { id: 'orders', label: 'Total Orders', value: '85,932', trend: '+28%', icon: 'orders' },
  { id: 'revenue', label: 'Total Revenue', value: '$1.2M', trend: '+18%', icon: 'revenue', highlight: true },
  { id: 'active', label: 'Active Now', value: '4,129', trend: 'Live', icon: 'active', live: true },
]

export const growthData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 61 },
  { month: 'May', value: 58 },
  { month: 'Jun', value: 72 },
]

export const recentUsers = [
  {
    id: 1,
    initials: 'JD',
    name: 'James Davis',
    email: 'james.d@email.com',
    status: 'ACTIVE',
    lastActive: '2 mins ago',
    avatarColor: 'bg-primary-light text-primary',
  },
  {
    id: 2,
    initials: 'SM',
    name: 'Sarah Mitchell',
    email: 'sarah.m@email.com',
    status: 'ACTIVE',
    lastActive: '15 mins ago',
    avatarColor: 'bg-tertiary-light text-tertiary',
  },
  {
    id: 3,
    initials: 'RL',
    name: 'Robert Lane',
    email: 'robert.l@email.com',
    status: 'INACTIVE',
    lastActive: '3 days ago',
    avatarColor: 'bg-orange-100 text-orange-700',
  },
  {
    id: 4,
    initials: 'EK',
    name: 'Emily Kim',
    email: 'emily.k@email.com',
    status: 'ACTIVE',
    lastActive: '1 hour ago',
    avatarColor: 'bg-purple-100 text-purple-700',
  },
]

export const systemEvents = [
  {
    id: 1,
    title: 'New Vendor Approved',
    description: 'Organic Valley shop verified and activated.',
    time: '2 mins ago',
    color: 'bg-primary',
  },
  {
    id: 2,
    title: 'Account Flagged',
    description: 'User reported suspicious activity on order #8821.',
    time: '18 mins ago',
    color: 'bg-red-500',
  },
  {
    id: 3,
    title: 'Vendor Application',
    description: 'Fresh Farms Co. submitted registration request.',
    time: '45 mins ago',
    color: 'bg-tertiary',
  },
  {
    id: 4,
    title: 'User Banned',
    description: 'Robert Lane account suspended per policy.',
    time: '2 hours ago',
    color: 'bg-orange-500',
  },
]

export const recentActivities = [
  {
    id: 1,
    title: 'New Store Approved',
    description: 'Organic Valley shop verified',
    time: '2 mins ago',
    color: 'bg-tertiary',
  },
  {
    id: 2,
    title: 'Spike in Registrations',
    description: '+500 new users today',
    time: '45 mins ago',
    color: 'bg-primary',
  },
  {
    id: 3,
    title: 'Campaign Success',
    description: '"Fresh Summer" reached 50k views',
    time: '2 hours ago',
    color: 'bg-secondary',
  },
  {
    id: 4,
    title: 'Vendor Review Needed',
    description: '3 shops awaiting approval',
    time: '5 hours ago',
    color: 'bg-orange-500',
  },
]

export const vendors = [
  {
    id: 'SHOP-8821',
    name: 'Green Earth Organic',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=48&h=48&fit=crop',
    owner: 'Maria Santos',
    email: 'maria@greenearth.com',
    registered: 'Mar 12, 2024',
    status: 'Active',
  },
  {
    id: 'SHOP-7742',
    name: 'Urban Fresh Market',
    logo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=48&h=48&fit=crop',
    owner: 'David Chen',
    email: 'david@urbanfresh.com',
    registered: 'Apr 03, 2024',
    status: 'Pending',
  },
  {
    id: 'SHOP-6610',
    name: 'Valley Dairy Co.',
    logo: 'https://images.unsplash.com/photo-1563636619-e91424eaafc3?w=48&h=48&fit=crop',
    owner: 'Lisa Park',
    email: 'lisa@valleydairy.com',
    registered: 'Jan 28, 2024',
    status: 'Active',
  },
  {
    id: 'SHOP-5593',
    name: 'Metro Grocers',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=48&h=48&fit=crop',
    owner: 'Tom Bradley',
    email: 'tom@metrogrocers.com',
    registered: 'Feb 15, 2024',
    status: 'Suspended',
  },
]

export const vendorSummary = {
  pendingRequests: 24,
  totalActive: 1042,
  activeToday: 12,
  suspended: 18,
  registrationTrend: 'New shop registrations have increased by 22% this quarter.',
}

export const userStats = {
  totalCustomers: '12,482',
  totalTrend: '+14% this month',
  activeNow: '842',
  pendingVerifications: 45,
}

export const platformUsers = [
  {
    id: 1,
    name: 'James Wilson',
    email: 'james.w@email.com',
    joinDate: 'Jan 15, 2024',
    status: 'Active',
    totalOrders: 24,
    avatar: 'https://i.pravatar.cc/150?u=james-w',
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    email: 'sarah.m@email.com',
    joinDate: 'Feb 03, 2024',
    status: 'Active',
    totalOrders: 18,
    avatar: 'https://i.pravatar.cc/150?u=sarah-m',
  },
  {
    id: 3,
    name: 'Robert Lane',
    email: 'robert.l@email.com',
    joinDate: 'Dec 20, 2023',
    status: 'Banned',
    totalOrders: 3,
    avatar: 'https://i.pravatar.cc/150?u=robert-l',
  },
  {
    id: 4,
    name: 'Emily Kim',
    email: 'emily.k@email.com',
    joinDate: 'Mar 08, 2024',
    status: 'Active',
    totalOrders: 31,
    avatar: 'https://i.pravatar.cc/150?u=emily-k',
  },
  {
    id: 5,
    name: 'Michael Torres',
    email: 'm.torres@email.com',
    joinDate: 'Apr 01, 2024',
    status: 'Active',
    totalOrders: 7,
    avatar: 'https://i.pravatar.cc/150?u=michael-t',
  },
]

export const userStatusStyles = {
  ACTIVE: 'bg-tertiary-light text-tertiary',
  INACTIVE: 'bg-red-100 text-red-600',
  Active: 'bg-tertiary-light text-tertiary',
  Banned: 'bg-red-100 text-red-600',
}

export const vendorStatusStyles = {
  Active: 'bg-tertiary-light text-tertiary',
  Pending: 'bg-yellow-100 text-yellow-800',
  Suspended: 'bg-red-100 text-red-600',
  Rejected: 'bg-red-100 text-red-600',
}

export const userFilters = ['All Users', 'Active', 'Banned']

export const vendorFilters = ['All Statuses', 'Active', 'Pending', 'Suspended', 'Rejected']
