const API_BASE = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'quickbasket_token'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export async function apiRequest(path, options = {}) {
  const { token, body, headers = {}, ...rest } = options

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      data.message || 'Something went wrong.',
      response.status,
      data.errors ?? null,
    )
  }

  return data
}

// For multipart/form-data (file uploads) — do NOT set Content-Type manually
// so the browser can set the correct boundary automatically
export async function apiFormRequest(path, formData, method = 'POST', token = null) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      data.message || 'Something went wrong.',
      response.status,
      data.errors ?? null,
    )
  }

  return data
}
