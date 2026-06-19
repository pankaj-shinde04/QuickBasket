import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import User from '../models/User.js'
import { ROLES } from '../constants/roles.js'
import logger from '../utils/logger.js'

dotenv.config()

const admin = {
  firstName: process.env.ADMIN_FIRST_NAME || 'Alex',
  lastName: process.env.ADMIN_LAST_NAME || 'Admin',
  email: process.env.ADMIN_EMAIL || 'admin@quickbasket.com',
  password: process.env.ADMIN_PASSWORD || 'Test@1234',
}

async function createAdmin() {
  await connectDB()

  const existing = await User.findOne({ email: admin.email.toLowerCase() })

  if (existing) {
    logger.info(`Admin already exists: ${admin.email}`)
    await mongoose.disconnect()
    return
  }

  const hashedPassword = await bcrypt.hash(admin.password, 12)

  await User.create({
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email.toLowerCase(),
    password: hashedPassword,
    role: ROLES.ADMIN,
  })

  logger.info(`Created admin: ${admin.email}`)
  await mongoose.disconnect()
}

createAdmin().catch((error) => {
  logger.error(`Create admin failed: ${error.message}`)
  process.exit(1)
})
