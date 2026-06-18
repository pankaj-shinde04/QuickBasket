import config from '../config/index.js'
import logger from '../utils/logger.js'

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  if (config.env === 'development') {
    logger.error(`${statusCode} — ${message}`)
    if (err.stack) logger.error(err.stack)
  } else if (!err.isOperational) {
    logger.error(err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
    ...(config.env === 'development' && err.stack && { stack: err.stack }),
  })
}
