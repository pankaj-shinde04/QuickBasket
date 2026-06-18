import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DUMMY_USERS, DUMMY_PASSWORD } from '../../data/dummyUsers'
import { getPostAuthPath, getRoleLabel } from '../../constants/roles'
import { useAuth } from '../../context/AuthContext'

export default function DemoAccounts() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  const quickLogin = async (account) => {
    setError('')
    setLoading(account.email)

    try {
      const session = await login({
        email: account.email,
        password: account.password,
      })
      navigate(getPostAuthPath(session.role), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-dashed border-primary/40 bg-primary-light/50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">
        Demo Test Accounts
      </p>
      <p className="mt-1 text-xs text-text-muted">
        Password for all: <strong className="text-text-dark">{DUMMY_PASSWORD}</strong>
      </p>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      <div className="mt-3 space-y-2">
        {DUMMY_USERS.map((account) => (
          <button
            key={account.email}
            type="button"
            disabled={!!loading}
            onClick={() => quickLogin(account)}
            className="flex w-full items-center justify-between rounded-lg border border-neutral-border bg-white px-3 py-2.5 text-left text-sm transition-colors hover:border-primary hover:bg-white disabled:opacity-60"
          >
            <div>
              <span className="font-semibold text-text-dark">
                {getRoleLabel(account.role)}
              </span>
              <span className="mt-0.5 block text-xs text-text-muted">{account.email}</span>
            </div>
            <span className="shrink-0 text-xs font-semibold text-primary">
              {loading === account.email ? 'Signing in...' : 'Quick Login →'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
