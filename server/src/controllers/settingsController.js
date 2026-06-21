import { asyncHandler } from '../middleware/asyncHandler.js'
import * as settingsService from '../services/settingsService.js'

// PATCH /api/settings/profile  — update firstName / lastName
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await settingsService.updateProfile(req.user._id, req.body)
  res.json({ success: true, message: 'Profile updated successfully.', data: { user } })
})

// PATCH /api/settings/password  — change password
export const changePassword = asyncHandler(async (req, res) => {
  await settingsService.changePassword(req.user._id, req.body)
  res.json({ success: true, message: 'Password changed successfully.' })
})

// PATCH /api/settings/shop  — update shop name, address, logo, etc.
export const updateShop = asyncHandler(async (req, res) => {
  const shop = await settingsService.updateShopSettings(req.user._id, req.body, req.file || null)
  res.json({ success: true, message: 'Shop settings updated successfully.', data: { shop } })
})
