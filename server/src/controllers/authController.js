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
