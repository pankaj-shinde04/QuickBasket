import { apiRequest, apiFormRequest } from './api'

export function getCategories(token) {
  return apiRequest('/categories', { method: 'GET', token })
}

export function createCategory(token, data) {
  return apiRequest('/categories', { method: 'POST', token, body: data })
}

export function updateCategory(token, id, data) {
  return apiRequest(`/categories/${id}`, { method: 'PATCH', token, body: data })
}

export function deleteCategory(token, id) {
  return apiRequest(`/categories/${id}`, { method: 'DELETE', token })
}

export function getPublicCategories() {
  return apiRequest('/public/categories', { method: 'GET' })
}
