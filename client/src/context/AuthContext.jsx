import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getDashboardPath, ROLES } from '../constants/roles'
import * as authApi from '../services/authService'

const AuthContext = createContext(null)
const TOKEN_KEY = 'quickbasket_token'
const SESSION_KEY = 'quickbasket_session'

function loadToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function saveToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')
  } catch {
    return null
  }
}

function saveSession(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      const token = loadToken()

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await authApi.fetchCurrentUser(token)
        if (!cancelled) {
          setUser(response.data.user)
          saveSession(response.data.user)
        }
      } catch {
        if (!cancelled) {
          saveToken(null)
          saveSession(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [])

  const signup = useCallback(async ({ firstName, lastName, email, password, role }) => {
    if (role === ROLES.ADMIN) {
      throw new Error('Admin accounts cannot be created through registration.')
    }

    const response = await authApi.registerUser({
      firstName,
      lastName,
      email,
      password,
      role,
    })

    const { user: newUser, token } = response.data

    saveToken(token)
    saveSession(newUser)
    setUser(newUser)

    return newUser
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const response = await authApi.loginUser({ email, password })
    const { user: loggedInUser, token } = response.data

    saveToken(token)
    saveSession(loggedInUser)
    setUser(loggedInUser)

    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    const token = loadToken()

    if (token) {
      try {
        await authApi.logoutUser(token)
      } catch {
        // Clear local session even if the server call fails
      }
    }

    saveToken(null)
    saveSession(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      getRedirectPath: (role) => getDashboardPath(role ?? user?.role),
    }),
    [user, loading, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
