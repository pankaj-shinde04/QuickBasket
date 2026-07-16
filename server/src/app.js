import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config/index.js'
import routes from './routes/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(helmet())

// Build allowed origins list from CLIENT_URL + optional regex pattern
const allowedOrigins = config.clientUrl // already an array from config
const originPattern = process.env.CORS_PATTERN
  ? new RegExp(process.env.CORS_PATTERN)
  : null

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, mobile, server-to-server)
      if (!origin) return callback(null, true)
      // Check exact match
      if (allowedOrigins.includes(origin)) return callback(null, true)
      // Check regex pattern (e.g. all Vercel preview URLs)
      if (originPattern && originPattern.test(origin)) return callback(null, true)
      // Reject — return false, NOT an Error, so Express still sends CORS headers
      return callback(null, false)
    },
    credentials: true,
  })
)

app.use(morgan(config.env === 'development' ? 'dev' : 'combined'))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/uploads', express.static(path.join(__dirname, '..', config.upload.dir)))

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
