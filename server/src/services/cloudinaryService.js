import { v2 as cloudinary } from 'cloudinary'
import config from '../config/index.js'
import logger from '../utils/logger.js'

let configured = false

function ensureConfigured() {
  if (configured) return true

  const { cloudName, apiKey, apiSecret } = config.cloudinary

  if (!cloudName || !apiKey || !apiSecret) {
    return false
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })

  configured = true
  return true
}

export async function uploadImageBuffer(buffer, folder = 'quickbasket/shops') {
  if (!ensureConfigured()) {
    logger.warn('Cloudinary upload skipped (not configured)')
    return null
  }

  logger.info(`Cloudinary config — cloud_name: ${config.cloudinary.cloudName}, api_key: ${config.cloudinary.apiKey}`)

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, uploadResult) => {
        if (error) {
          logger.error(`Cloudinary upload error: ${JSON.stringify(error)}`)
          reject(error)
        } else {
          resolve(uploadResult)
        }
      }
    )
    stream.end(buffer)
  })

  return result.secure_url
}
