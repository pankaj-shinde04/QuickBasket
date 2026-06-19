import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import User, { USER_STATUS } from '../models/User.js'
import Shop, { SHOP_STATUS } from '../models/Shop.js'
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
]

async function seed() {
  await connectDB()

  for (const user of DEMO_USERS) {
    const existing = await User.findOne({ email: user.email })

    if (existing) {
      logger.info(`Skipped existing user: ${user.email}`)
      continue
    }

    const hashedPassword = await bcrypt.hash(user.password, 12)
    const createdUser = await User.create({ ...user, password: hashedPassword })
    logger.info(`Created demo user: ${user.email} (${user.role})`)

    if (user.role === ROLES.SHOP_OWNER) {
      await Shop.create({
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
    }
  }

  logger.info('Seed completed')
  await mongoose.disconnect()
}

seed().catch((error) => {
  logger.error(`Seed failed: ${error.message}`)
  process.exit(1)
})
