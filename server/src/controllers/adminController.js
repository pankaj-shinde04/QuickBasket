import * as adminService from '../services/adminService.js'
import * as vendorService from '../services/vendorService.js'

export async function createAdmin(req, res) {
  const admin = await adminService.createAdmin(req.body)

  res.status(201).json({
    success: true,
    message: 'Admin account created successfully.',
    data: { admin },
  })
}

export async function listAdmins(_req, res) {
  const admins = await adminService.listAdmins()

  res.json({
    success: true,
    data: { admins },
  })
}

export async function listUsers(req, res) {
  const result = await adminService.listUsers(req.query)

  res.json({
    success: true,
    data: result,
  })
}

export async function getUserStats(_req, res) {
  const stats = await adminService.getUserStats()

  res.json({
    success: true,
    data: { stats },
  })
}

export async function updateUserStatus(req, res) {
  const user = await adminService.updateUserStatus(req.params.id, req.body.status)

  res.json({
    success: true,
    message: 'User status updated successfully.',
    data: { user },
  })
}

export async function listVendors(req, res) {
  const result = await vendorService.listVendors(req.query)

  res.json({
    success: true,
    data: result,
  })
}

export async function getVendorStats(_req, res) {
  const stats = await vendorService.getVendorStats()

  res.json({
    success: true,
    data: { stats },
  })
}

export async function approveVendor(req, res) {
  const vendor = await vendorService.approveVendor(req.params.id)

  res.json({
    success: true,
    message: 'Vendor approved successfully.',
    data: { vendor },
  })
}

export async function rejectVendor(req, res) {
  const vendor = await vendorService.rejectVendor(req.params.id)

  res.json({
    success: true,
    message: 'Vendor rejected successfully.',
    data: { vendor },
  })
}
