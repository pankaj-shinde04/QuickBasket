import { apiRequest } from './api.js'

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function fetchCurrentUser(token) {
  return apiRequest('/auth/me', {
    method: 'GET',
    token,
  })
}

export function logoutUser(token) {
  return apiRequest('/auth/logout', {
    method: 'POST',
    token,
  })
}
