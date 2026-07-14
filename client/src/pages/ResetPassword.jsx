import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlineShieldCheck,
} from 'react-icons/hi2'
import { apiRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/auth', { replace: true })
    }
  }, [token, navigate])

  const strength = (() => {
    if (password.length === 0) return 0
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'][strength]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: { token, password },
      })
      // Auto-login the user with the returned JWT
      if (res.data?.token) {
        localStorage.setItem('quickbasket_token', res.data.token)
        localStorage.setItem('quickbasket_session', JSON.stringify(res.data.user))
      }
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return null

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-100/80 via-yellow-50/60 to-primary-light/70" />
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-tertiary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-extrabold italic text-primary sm:text-4xl">QuickBasket</h1>
          </Link>
          <p className="mt-2 text-sm text-text-muted">Your neighborhood grocery, elevated.</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          {success ? (
            /* ── Success state ──────────────────────────────────────── */
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <HiOutlineCheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-dark">Password Reset!</h2>
                <p className="mt-2 text-sm text-text-muted">
                  Your password has been updated successfully. You're now logged in.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard/customer', { replace: true })}
                className="w-full rounded-xl bg-primary py-3.5 text-base font-bold text-white hover:bg-primary-dark"
              >
                Go to Dashboard
              </button>
              <Link
                to="/"
                className="block text-center text-sm font-semibold text-text-muted hover:text-text-dark"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            /* ── Reset form ─────────────────────────────────────────── */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-text-dark">Set a new password</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Choose a strong password for your account.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  <HiOutlineExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* New Password */}
              <div>
                <label
                  htmlFor="reset-password"
                  className="mb-1.5 block text-sm font-medium text-text-muted"
                >
                  New Password
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-neutral-border bg-white py-3 pl-12 pr-12 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <HiOutlineEyeSlash className="h-5 w-5" />
                    ) : (
                      <HiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Strength meter */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            n <= strength ? strengthColor : 'bg-neutral-border'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-text-muted">
                      Strength:{' '}
                      <span
                        className={`font-semibold ${
                          strength <= 1
                            ? 'text-red-500'
                            : strength === 2
                              ? 'text-yellow-600'
                              : strength === 3
                                ? 'text-blue-600'
                                : 'text-green-600'
                        }`}
                      >
                        {strengthLabel}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="reset-confirm"
                  className="mb-1.5 block text-sm font-medium text-text-muted"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                  <input
                    id="reset-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full rounded-xl border py-3 pl-12 pr-12 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${
                      confirm && confirm !== password
                        ? 'border-red-400 bg-red-50 focus:border-red-400'
                        : 'border-neutral-border bg-white focus:border-primary'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? (
                      <HiOutlineEyeSlash className="h-5 w-5" />
                    ) : (
                      <HiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary py-3.5 text-base font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <HiOutlineArrowPath className="h-5 w-5 animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>

              <Link
                to="/auth"
                className="block text-center text-sm font-semibold text-text-muted hover:text-text-dark"
              >
                ← Back to Sign In
              </Link>
            </form>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <HiOutlineShieldCheck className="h-4 w-4" />
          Secure Reset
        </div>
      </div>
    </div>
  )
}
