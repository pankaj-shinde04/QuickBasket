import { apiRequest, getAuthToken } from './api.js'

function withAuth(options = {}) {
  return {
    ...options,
    token: getAuthToken(),
  }
}

export function createAdmin(payload) {
  return apiRequest('/admin/admins', withAuth({
    method: 'POST',
    body: payload,
  }))
}

export function fetchAdmins() {
  return apiRequest('/admin/admins', withAuth({ method: 'GET' }))
}

export function fetchUsers(params = {}) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value)
    }
  })

  const queryString = query.toString()
  const path = queryString ? `/admin/users?${queryString}` : '/admin/users'

  return apiRequest(path, withAuth({ method: 'GET' }))
}

export function fetchUserStats() {
  return apiRequest('/admin/users/stats', withAuth({ method: 'GET' }))
}

export function updateUserStatus(userId, status) {
  return apiRequest(`/admin/users/${userId}/status`, withAuth({
    method: 'PATCH',
    body: { status },
  }))
}
