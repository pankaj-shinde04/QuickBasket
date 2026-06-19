import multer from 'multer'
import config from '../config/index.js'
import ApiError from '../utils/ApiError.js'

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSizeMb * 1024 * 1024,
  },
  fileFilter(_req, file, cb) {
    if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new ApiError(400, 'Only PNG, JPG, WEBP, or SVG images are allowed.'))
    }
  },
})

export const uploadShopLogo = upload.single('logo')
export const uploadProductImage = upload.single('image')

export function handleMulterError(err, _req, _res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(400, `Logo must be under ${config.upload.maxFileSizeMb}MB.`))
    }
    return next(new ApiError(400, err.message))
  }

  return next(err)
}
