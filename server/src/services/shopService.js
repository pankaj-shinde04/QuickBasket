import Shop from '../models/Shop.js'
import ApiError from '../utils/ApiError.js'
import { ROLES } from '../constants/roles.js'
import { uploadImageBuffer } from './cloudinaryService.js'

function formatShop(shop) {
  return {
    id: shop._id.toString(),
    name: shop.name,
    email: shop.email,
    address: shop.address,
    contactNumber: shop.contactNumber,
    logo: shop.logo,
    openingTime: shop.openingTime,
    closingTime: shop.closingTime,
    profileComplete: shop.profileComplete,
    status: shop.status,
    createdAt: shop.createdAt,
    updatedAt: shop.updatedAt,
  }
}

export async function getShopByOwner(ownerId) {
  const shop = await Shop.findOne({ owner: ownerId })

  if (!shop) {
    throw new ApiError(404, 'Shop not found.')
  }

  return formatShop(shop)
}

export async function registerShopProfile(ownerId, payload, logoFile) {
  const shop = await Shop.findOne({ owner: ownerId })

  if (!shop) {
    throw new ApiError(404, 'Shop not found.')
  }

  const isDraft = payload.draft === true || payload.draft === 'true'

  if (payload.name?.trim()) shop.name = payload.name.trim()
  if (payload.address !== undefined) shop.address = payload.address.trim()
  if (payload.contactNumber !== undefined) shop.contactNumber = payload.contactNumber.trim()
  if (payload.openingTime !== undefined) shop.openingTime = payload.openingTime
  if (payload.closingTime !== undefined) shop.closingTime = payload.closingTime

  if (logoFile) {
    if (logoFile.size > 2 * 1024 * 1024) {
      throw new ApiError(400, 'Shop logo must be 2MB or smaller.')
    }

    const logoUrl = await uploadImageBuffer(logoFile.buffer)

    if (!logoUrl) {
      throw new ApiError(500, 'Failed to upload shop logo. Please try again later.')
    }

    shop.logo = logoUrl
  }

  if (!isDraft) {
    if (!shop.name?.trim()) throw new ApiError(400, 'Shop name is required.')
    if (!shop.address?.trim()) throw new ApiError(400, 'Shop address is required.')
    if (!shop.contactNumber?.trim()) throw new ApiError(400, 'Contact number is required.')
    if (!shop.openingTime) throw new ApiError(400, 'Opening time is required.')
    if (!shop.closingTime) throw new ApiError(400, 'Closing time is required.')
    if (!shop.logo && !logoFile) throw new ApiError(400, 'Shop logo is required.')

    shop.profileComplete = true
  }

  await shop.save()
  return formatShop(shop)
}

export async function assertShopOwner(user) {
  if (user.role !== ROLES.SHOP_OWNER) {
    throw new ApiError(403, 'Only shop owners can access this resource.')
  }
}
