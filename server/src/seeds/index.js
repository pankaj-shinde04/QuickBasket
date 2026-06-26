import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import User, { USER_STATUS } from '../models/User.js'
import Shop, { SHOP_STATUS } from '../models/Shop.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import { ROLES } from '../constants/roles.js'
import { buildDefaultShopName } from '../services/vendorService.js'
import logger from '../utils/logger.js'

const DEMO_USERS = [
  {
    firstName: 'Jane',
    lastName: 'Customer',
    email: 'customer@quickbasket.com',
    password: 'Test@1234',
    role: ROLES.CUSTOMER,
    status: USER_STATUS.ACTIVE,
  },
  {
    firstName: 'John',
    lastName: 'Store',
    email: 'owner@quickbasket.com',
    password: 'Test@1234',
    role: ROLES.SHOP_OWNER,
    status: USER_STATUS.ACTIVE,
  },
  {
    firstName: 'Alex',
    lastName: 'Admin',
    email: 'admin@quickbasket.com',
    password: 'Test@1234',
    role: ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
  },
  {
    firstName: 'Pankaj',
    lastName: 'Shinde',
    email: 'pankajshinde2434@gmail.com',
    password: 'Test@1234',
    role: ROLES.SHOP_OWNER,
    status: USER_STATUS.ACTIVE,
  },
]

async function seed() {
  await connectDB()

  for (const user of DEMO_USERS) {
    const existing = await User.findOne({ email: user.email })

    let createdUser
    if (existing) {
      logger.info(`Skipped existing user: ${user.email}`)
      createdUser = existing
    } else {
      const hashedPassword = await bcrypt.hash(user.password, 12)
      createdUser = await User.create({ ...user, password: hashedPassword })
      logger.info(`Created demo user: ${user.email} (${user.role})`)
    }

    if (user.role === ROLES.SHOP_OWNER) {
      let shop = await Shop.findOne({ owner: createdUser._id })

      if (!shop) {
        shop = await Shop.create({
          owner: createdUser._id,
          name: buildDefaultShopName(user.firstName, user.lastName),
          email: user.email,
          address: '123 Market Street',
          contactNumber: '+1 (800) 123-4567',
          openingTime: '08:00',
          closingTime: '20:00',
          profileComplete: true,
          status: SHOP_STATUS.ACTIVE,
        })
        logger.info(`Created demo shop for: ${user.email}`)
      } else {
        logger.info(`Shop already exists for: ${user.email}`)
      }

      // Add default categories
      const defaultCategories = [
        { name: 'Vegetables', icon: '🥬', color: 'bg-green-100 text-green-800' },
        { name: 'Fresh Fruits', icon: '🍎', color: 'bg-red-100 text-red-800' },
        { name: 'Desserts', icon: '🍰', color: 'bg-pink-100 text-pink-800' },
        { name: 'Drinks', icon: '🥤', color: 'bg-blue-100 text-blue-800' },
        { name: 'Snacks', icon: '🍿', color: 'bg-yellow-100 text-yellow-800' },
        { name: 'Bakery', icon: '🍞', color: 'bg-amber-100 text-amber-800' },
        { name: 'Dairy', icon: '🥛', color: 'bg-sky-100 text-sky-800' },
        { name: 'Meat', icon: '🥩', color: 'bg-rose-100 text-rose-800' },
      ]

      for (const cat of defaultCategories) {
        const existingCategory = await Category.findOne({ shop: shop._id, name: cat.name })
        if (!existingCategory) {
          try {
            await Category.create({ shop: shop._id, ...cat })
            logger.info(`Created default category: ${cat.name}`)
          } catch (err) {
            if (err.code === 11000) {
              logger.info(`Category ${cat.name} already exists (duplicate key)`)
            } else {
              throw err
            }
          }
        }
      }

      // Add demo products
      const demoProducts = [
        {
          name: 'Fresh Red Apple',
          description: 'Crisp and sweet red apples, perfect for snacking or baking.',
          category: 'Fresh Fruits',
          brand: 'Fresh Farms',
          price: 248,
          stock: 50,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
        },
        {
          name: 'Organic Banana',
          description: 'Naturally sweet organic bananas, rich in potassium.',
          category: 'Fresh Fruits',
          brand: 'Fresh Farms',
          price: 165,
          stock: 75,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
        },
        {
          name: 'Sweet Mango',
          description: 'Juicy and aromatic mangoes, perfect for smoothies and desserts.',
          category: 'Fresh Fruits',
          brand: 'Tropical Farms',
          price: 414,
          stock: 30,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1553279768-865489fa8a7a?w=400&h=400&fit=crop',
        },
        {
          name: 'Fresh Orange',
          description: 'Vitamin C rich oranges, perfect for fresh juice.',
          category: 'Fresh Fruits',
          brand: 'Citrus Grove',
          price: 290,
          stock: 60,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop',
        },
        // Dairy Products
        {
          name: 'Milk 500ml',
          description: 'Fresh whole milk, rich in calcium and vitamins.',
          category: 'Dairy',
          brand: 'Amul',
          price: 30,
          stock: 100,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1563636619-e91424eaafc3?w=400&h=400&fit=crop',
        },
        {
          name: 'Milk 1L',
          description: 'Fresh whole milk, perfect for daily use.',
          category: 'Dairy',
          brand: 'Amul',
          price: 54,
          stock: 80,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
        },
        {
          name: 'Curd 500g',
          description: 'Fresh and creamy curd, perfect for meals.',
          category: 'Dairy',
          brand: 'Amul',
          price: 35,
          stock: 60,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
        },
        {
          name: 'Butter 100g',
          description: 'Pure butter, rich and creamy for cooking.',
          category: 'Dairy',
          brand: 'Amul',
          price: 56,
          stock: 50,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&h=400&fit=crop',
        },
        // Grains
        {
          name: 'Basmati Rice 1kg',
          description: 'Premium long-grain basmati rice, aromatic and fluffy.',
          category: 'Vegetables',
          brand: 'India Gate',
          price: 95,
          stock: 40,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
        },
        {
          name: 'Basmati Rice 5kg',
          description: 'Premium long-grain basmati rice, aromatic and fluffy.',
          category: 'Vegetables',
          brand: 'India Gate',
          price: 450,
          stock: 25,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop',
        },
        {
          name: 'Kolam Rice 5kg',
          description: 'Premium kolam rice, perfect for daily meals.',
          category: 'Vegetables',
          brand: 'India Gate',
          price: 380,
          stock: 30,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
        },
        {
          name: 'Wheat Flour 1kg',
          description: 'Whole wheat flour, perfect for rotis and breads.',
          category: 'Vegetables',
          brand: 'Aashirvaad',
          price: 42,
          stock: 50,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
        },
        // Biscuits
        {
          name: 'Marie Gold',
          description: 'Classic tea-time biscuits, light and crispy.',
          category: 'Snacks',
          brand: 'Britannia',
          price: 25,
          stock: 100,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
        },
        {
          name: 'Good Day',
          description: 'Butter cookies with cashews, rich and delicious.',
          category: 'Snacks',
          brand: 'Britannia',
          price: 30,
          stock: 90,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
        },
        {
          name: 'Oreo',
          description: 'Classic chocolate sandwich cookies.',
          category: 'Snacks',
          brand: 'Oreo',
          price: 35,
          stock: 80,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop',
        },
        {
          name: 'Hide & Seek',
          description: 'Chocolate chip cookies, crunchy and sweet.',
          category: 'Snacks',
          brand: 'Britannia',
          price: 28,
          stock: 85,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
        },
        // Chocolates
        {
          name: 'Dairy Milk',
          description: 'Classic milk chocolate bar, creamy and delicious.',
          category: 'Snacks',
          brand: 'Cadbury',
          price: 50,
          stock: 120,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1548907040-4d61b257bc88?w=400&h=400&fit=crop',
        },
        {
          name: 'KitKat',
          description: 'Crispy wafer coated in milk chocolate.',
          category: 'Snacks',
          brand: 'Nestle',
          price: 40,
          stock: 110,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1568472983244-6131d6b818b9?w=400&h=400&fit=crop',
        },
        {
          name: 'Five Star',
          description: 'Caramel and chocolate bar, rich and chewy.',
          category: 'Snacks',
          brand: 'Cadbury',
          price: 35,
          stock: 100,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1548907040-4d61b257bc88?w=400&h=400&fit=crop',
        },
        {
          name: 'Munch',
          description: 'Chocolate coated wafer, crispy and chocolaty.',
          category: 'Snacks',
          brand: 'Nestle',
          price: 20,
          stock: 130,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1568472983244-6131d6b818b9?w=400&h=400&fit=crop',
        },
        {
          name: 'Perk',
          description: 'Chocolate coated wafer, light and crispy.',
          category: 'Snacks',
          brand: 'Cadbury',
          price: 15,
          stock: 140,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1568472983244-6131d6b818b9?w=400&h=400&fit=crop',
        },
        // Beverages
        {
          name: 'Coca-Cola 750ml',
          description: 'Classic carbonated soft drink, refreshing taste.',
          category: 'Drinks',
          brand: 'Coca-Cola',
          price: 45,
          stock: 80,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop',
        },
        {
          name: 'Pepsi 750ml',
          description: 'Refreshing carbonated soft drink.',
          category: 'Drinks',
          brand: 'Pepsi',
          price: 45,
          stock: 75,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
        },
        {
          name: 'Sprite 750ml',
          description: 'Lemon-lime flavored soft drink, crisp and refreshing.',
          category: 'Drinks',
          brand: 'Coca-Cola',
          price: 45,
          stock: 70,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop',
        },
        {
          name: 'Fanta 750ml',
          description: 'Orange flavored soft drink, fruity and refreshing.',
          category: 'Drinks',
          brand: 'Coca-Cola',
          price: 45,
          stock: 65,
          unit: 'Piece',
          taxable: true,
          shop: shop._id,
          image: 'https://images.unsplash.com/photo-1563822249366-3efb23b5e0c3?w=400&h=400&fit=crop',
        },
      ]

      for (const product of demoProducts) {
        const existingProduct = await Product.findOne({ name: product.name, shop: shop._id })
        if (!existingProduct) {
          await Product.create(product)
          logger.info(`Created demo product: ${product.name}`)
        } else {
          // Update existing product with new image and other fields
          await Product.updateOne(
            { _id: existingProduct._id },
            { $set: { image: product.image, description: product.description, price: product.price, stock: product.stock } }
          )
          logger.info(`Updated demo product: ${product.name}`)
        }
      }
    }
  }

  logger.info('Seed completed')
  await mongoose.disconnect()
}

seed().catch((error) => {
  logger.error(`Seed failed: ${error.message}`)
  process.exit(1)
})
