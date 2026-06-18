import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'
import config from './config/index.js'
import connectDB from './config/db.js'
import logger from './utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, '..', config.upload.dir)

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

async function startServer() {
  await connectDB()

  app.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`)
    logger.info(`Health check: http://localhost:${config.port}/api/health`)
  })
}

startServer().catch((error) => {
  logger.error(`Failed to start server: ${error.message}`)
  process.exit(1)
})
