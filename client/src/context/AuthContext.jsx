import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getDashboardPath, getRoleLabel } from '../constants/roles'
import { DUMMY_USERS } from '../data/dummyUsers'

const AuthContext = createContext(null)
const USERS_KEY = 'quickbasket_users'
const SESSION_KEY = 'quickbasket_session'
const SEED_KEY = 'quickbasket_users_seeded'

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function seedDummyUsers() {
  const users = loadUsers()
  const existingEmails = new Set(users.map((u) => u.email))
  const toAdd = DUMMY_USERS.filter((u) => !existingEmails.has(u.email))

  if (toAdd.length > 0) {
    saveUsers([...users, ...toAdd])
  }

  localStorage.setItem(SEED_KEY, 'true')
}

// Ensure test accounts exist on every app load
seedDummyUsers()

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

  const signup = useCallback(({ firstName, lastName, email, password, role }) => {
    const users = loadUsers()
    const normalizedEmail = email.trim().toLowerCase()

    if (users.some((u) => u.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.')
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters.')
    }

    const newUser = {
      id: crypto.randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password,
      role,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    const session = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    }

    saveSession(session)
    setUser(session)
    return session
  }, [])

  const login = useCallback(({ email, password, role }) => {
    const users = loadUsers()
    const normalizedEmail = email.trim().toLowerCase()
    const found = users.find(
      (u) => u.email === normalizedEmail && u.password === password,
    )

    if (!found) {
      throw new Error('Invalid email or password.')
    }

    if (found.role !== role) {
      throw new Error(
        `This account is registered as ${getRoleLabel(found.role)}. Please select the correct role.`,
      )
    }

    const session = {
      id: found.id,
      firstName: found.firstName,
      lastName: found.lastName,
      email: found.email,
      role: found.role,
    }

    saveSession(session)
    setUser(session)
    return session
  }, [])

  const logout = useCallback(() => {
    saveSession(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      getRedirectPath: (role) => getDashboardPath(role ?? user?.role),
    }),
    [user, login, signup, logout],
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
