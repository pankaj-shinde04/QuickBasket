import { apiRequest, getAuthToken } from './api.js'

function shopFormRequest(path, formData, method = 'POST') {
  const token = getAuthToken()

  return fetch(`${import.meta.env.VITE_API_URL || '/api'}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong.')
    }

    return data
  })
}

export function fetchMyShop() {
  return apiRequest('/shops/me', {
    method: 'GET',
    token: getAuthToken(),
  })
}

export function registerShop(formData) {
  return shopFormRequest('/shops/register', formData, 'POST')
}

export function saveShopDraft(formData) {
  formData.append('draft', 'true')
  return shopFormRequest('/shops/register', formData, 'PATCH')
}
