import { featuredProducts, trendingProducts, bestSellerFeatured } from './mockData'

const aptamilImages = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1579682812-545fd2d04b0e?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1587854692152-cf660fab692a?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1550572017-edd951aaee15?w=600&h=600&fit=crop',
]

export const productCatalog = {
  'aptamil-gold': {
    id: 'aptamil-gold',
    name: 'Aptamil Gold+ ProNutra Biotik Stage 1 Infant Formula',
    shortName: 'Aptamil Gold+ ProNutra Biotik Stage',
    category: 'Baby Care',
    productType: 'Instant Formula',
    price: 9.99,
    originalPrice: 13.0,
    rating: 3,
    reviewCount: 1,
    stockLeft: 33,
    stockPercent: 28,
    images: aptamilImages,
    weights: ['100gm', '215gm', '400gm'],
    defaultWeight: '400gm',
    description:
      'Aptamil Gold+ ProNutra Biotik Stage 1 is a premium infant formula designed to support your baby\'s immune system and healthy development. Enriched with ProNutra Biotik blend, it provides essential nutrients for newborns from birth.',
    longDescription:
      'Our scientifically formulated infant formula combines the latest nutritional research with high-quality ingredients. Each serving delivers balanced proteins, vitamins, and minerals to support growth, brain development, and digestive health. Suitable for bottle-fed babies from birth when breastfeeding is not possible.',
    additionalInfo: {
      Weight: '400gm',
      Dimensions: '12 × 8 × 8 cm',
      Brand: 'Aptamil',
      'Country of Origin': 'Australia',
      SKU: 'APT-GOLD-400',
    },
    reviews: [
      {
        id: 1,
        author: 'Sarah M.',
        rating: 3,
        date: 'March 12, 2024',
        text: 'Good quality formula. My baby took to it well. Delivery was fast and packaging was secure.',
      },
    ],
    dispatchNote: 'Order in the next 2 hours for same-day dispatch',
    returnsNote: '30 days easy returns',
  },
}

function buildFromListItem(item) {
  const priceNum = parseFloat(String(item.price).replace('$', ''))
  const priceMaxNum = item.priceMax
    ? parseFloat(String(item.priceMax).replace('$', ''))
    : null

  return {
    id: String(item.id),
    name: item.name,
    shortName: item.name,
    category: item.category,
    productType: item.category,
    price: priceNum,
    originalPrice: priceMaxNum ?? priceNum * 1.2,
    rating: item.rating ?? 4,
    reviewCount: Math.floor(Math.random() * 20) + 1,
    stockLeft: Math.floor(Math.random() * 80) + 10,
    stockPercent: Math.floor(Math.random() * 60) + 20,
    images: [item.image, item.image, item.image, item.image],
    weights: ['100gm', '215gm', '400gm'],
    defaultWeight: '215gm',
    description: `Premium ${item.name.toLowerCase()} sourced from trusted suppliers. Fresh, high-quality, and delivered to your door.`,
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    additionalInfo: {
      Weight: '215gm',
      Dimensions: '10 × 6 × 6 cm',
      Brand: 'QuickBasket',
      SKU: `QB-${item.id}`,
    },
    reviews: [],
    dispatchNote: 'Order in the next 2 hours for same-day dispatch',
    returnsNote: '30 days easy returns',
  }
}

;[...featuredProducts, ...trendingProducts].forEach((item) => {
  const key = String(item.id)
  if (!productCatalog[key]) {
    productCatalog[key] = buildFromListItem(item)
  }
})

productCatalog['aptamil-gold'] = {
  ...productCatalog['aptamil-gold'],
  name: bestSellerFeatured.name,
  shortName: 'Aptamil Gold+ ProNutra Biotik Stage',
  description: bestSellerFeatured.description,
  price: parseFloat(bestSellerFeatured.price.replace('$', '')),
  stockLeft: bestSellerFeatured.stockLeft,
  stockPercent: bestSellerFeatured.stockPercent,
  rating: bestSellerFeatured.rating,
  images: [bestSellerFeatured.image, ...aptamilImages.slice(1)],
}

export function getProductById(id) {
  return productCatalog[String(id)] ?? null
}

export const productDetailTabs = ['Description', 'Additional information', 'Reviews']
