import * as authService from '../services/authService.js'

export async function register(req, res) {
  const result = await authService.registerUser(req.body)

  if (result.pending) {
    return res.status(201).json({
      success: true,
      message:
        'Account created. Please complete your shop registration. We sent you an email about admin verification.',
      data: result,
    })
  }

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: result,
  })
}

export async function login(req, res) {
  const result = await authService.loginUser(req.body)

  res.json({
    success: true,
    message: 'Logged in successfully.',
    data: result,
  })
}

export async function me(req, res) {
  const user = await authService.getUserById(req.user._id)

  res.json({
    success: true,
    data: { user },
  })
}

export function logout(_req, res) {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  })
}

// POST /api/auth/forgot-password
export async function forgotPassword(req, res) {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' })
  }
  // Always returns success — never reveals whether the email exists (anti-enumeration)
  await authService.forgotPassword(email)
  res.json({
    success: true,
    message: 'If an account with that email exists, a reset link has been sent.',
  })
}

// POST /api/auth/reset-password
export async function resetPassword(req, res) {
  const { token, password } = req.body
  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Token and new password are required.' })
  }
  const result = await authService.resetPassword(token, password)
  res.json({
    success: true,
    message: 'Password reset successfully. You are now logged in.',
    data: result,
  })
}
