import { apiRequest, apiFormRequest } from './api.js'

export function getProducts(token, params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  if (params.search) query.set('search', params.search)
  if (params.category) query.set('category', params.category)
  const qs = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/products${qs}`, { method: 'GET', token })
}

export function getProductById(token, id) {
  return apiRequest(`/products/${id}`, { method: 'GET', token })
}

export function createProduct(token, formData) {
  return apiFormRequest('/products', formData, 'POST', token)
}

export function updateProduct(token, id, formData) {
  return apiFormRequest(`/products/${id}`, formData, 'PATCH', token)
}

export function deleteProduct(token, id) {
  return apiRequest(`/products/${id}`, { method: 'DELETE', token })
}
