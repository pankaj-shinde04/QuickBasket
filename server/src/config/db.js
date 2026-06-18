import mongoose from 'mongoose'
import config from './index.js'
import logger from '../utils/logger.js'

export async function connectDB() {
  try {
    const conn = await mongoose.connect(config.mongodbUri)
    logger.info(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
