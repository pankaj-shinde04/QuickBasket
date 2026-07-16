import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import User from '../models/User.js'
import { ROLES } from '../constants/roles.js'
import logger from '../utils/logger.js'

dotenv.config()

const { ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

if (!ADMIN_FIRST_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('[createAdmin] ERROR: ADMIN_FIRST_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in .env')
  process.exit(1)
}

const admin = {
  firstName: ADMIN_FIRST_NAME,
  lastName: ADMIN_LAST_NAME || '',
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
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
