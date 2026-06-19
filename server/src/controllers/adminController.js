import * as adminService from '../services/adminService.js'

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
