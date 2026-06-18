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
app.use(
  cors({
    origin: config.clientUrl,
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
