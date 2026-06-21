import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Shop from '../models/Shop.js'
import ApiError from '../utils/ApiError.js'
import { uploadImageBuffer } from './cloudinaryService.js'
import { formatPublicUser } from '../utils/userFormatter.js'

/**
 * Update user's first and last name.
 */
export async function updateProfile(userId, { firstName, lastName }) {
  const user = await User.findById(userId)
  if (!user) throw new ApiError(404, 'User not found.')

  if (firstName?.trim()) user.firstName = firstName.trim()
  if (lastName?.trim()) user.lastName = lastName.trim()

  await user.save()
  return formatPublicUser(user)
}

/**
 * Change password — verifies current password before updating.
 */
export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select('+password')
  if (!user) throw new ApiError(404, 'User not found.')

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect.')

  if (newPassword.length < 8) {
    throw new ApiError(400, 'New password must be at least 8 characters.')
  }

  user.password = await bcrypt.hash(newPassword, 12)
  await user.save()
}

/**
 * Update shop settings — name, address, contactNumber, logo.
 */
export async function updateShopSettings(ownerId, payload, logoFile) {
  const shop = await Shop.findOne({ owner: ownerId })
  if (!shop) throw new ApiError(404, 'Shop not found.')

  if (payload.name?.trim()) shop.name = payload.name.trim()
  if (payload.address !== undefined) shop.address = payload.address.trim()
  if (payload.contactNumber !== undefined) shop.contactNumber = payload.contactNumber.trim()
  if (payload.openingTime !== undefined) shop.openingTime = payload.openingTime
  if (payload.closingTime !== undefined) shop.closingTime = payload.closingTime

  if (logoFile) {
    if (logoFile.size > 2 * 1024 * 1024) {
      throw new ApiError(400, 'Logo must be 2MB or smaller.')
    }
    const logoUrl = await uploadImageBuffer(logoFile.buffer, 'quickbasket/shops')
    if (!logoUrl) throw new ApiError(500, 'Failed to upload logo. Please try again.')
    shop.logo = logoUrl
  }

  await shop.save()

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
  }
}
