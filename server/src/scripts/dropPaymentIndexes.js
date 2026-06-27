import mongoose from 'mongoose'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '../../.env') })

const dropIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const db = mongoose.connection.db
    const collection = db.collection('payments')

    // List all indexes
    const indexes = await collection.indexes()
    console.log('Current indexes:', indexes.map(i => i.name))

    // Drop the problematic indexes
    if (indexes.find(i => i.name === 'order_1')) {
      await collection.dropIndex('order_1')
      console.log('Dropped order_1 index')
    }

    if (indexes.find(i => i.name === 'transactionId_1')) {
      await collection.dropIndex('transactionId_1')
      console.log('Dropped transactionId_1 index')
    }

    console.log('Index drop completed')
    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

dropIndexes()
