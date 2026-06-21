import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getAuthToken, apiFormRequest, apiRequest } from '../services/api'
import { fetchMyShop } from '../services/shopService'

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadShop = useCallback(async () => {
    try {
      const res = await fetchMyShop()
      setShop(res.data.shop)
    } catch {
      setShop(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadShop()
  }, [loadShop])

  // Update shop settings (name, address, logo, etc.)
  const updateShop = useCallback(async (formData) => {
    const token = getAuthToken()
    const res = await apiFormRequest('/settings/shop', formData, 'PATCH', token)
    setShop(res.data.shop)
    return res.data.shop
  }, [])

  // Update user profile (name)
  const updateProfile = useCallback(async (payload) => {
    const token = getAuthToken()
    const res = await apiRequest('/settings/profile', { method: 'PATCH', token, body: payload })
    return res.data.user
  }, [])

  // Change password
  const changePassword = useCallback(async (payload) => {
    const token = getAuthToken()
    await apiRequest('/settings/password', { method: 'PATCH', token, body: payload })
  }, [])

  const value = useMemo(() => ({
    shop,
    loading,
    refresh: loadShop,
    updateShop,
    updateProfile,
    changePassword,
  }), [shop, loading, loadShop, updateShop, updateProfile, changePassword])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
