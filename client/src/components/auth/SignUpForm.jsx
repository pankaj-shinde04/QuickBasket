import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'
import { getPostAuthPath, ROLES, SHOP_REGISTER_PATH } from '../../constants/roles'

export default function SignUpForm({ role }) {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const session = await signup({ firstName, lastName, email, password, role })

      if (session.pending) {
        if (session.needsShopRegistration) {
          navigate(SHOP_REGISTER_PATH, { replace: true })
          return
        }

        setSuccess(
          session.message ||
            'Your account is pending admin verification. Check your email for updates before logging in.',
        )
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        return
      }

      navigate(getPostAuthPath(session.role), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-tertiary-light px-4 py-3 text-sm text-tertiary">{success}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="first-name" className="mb-1.5 block text-sm font-medium text-text-muted">
            First Name
          </label>
          <input
            id="first-name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jane"
            className="w-full rounded-xl border border-neutral-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label htmlFor="last-name" className="mb-1.5 block text-sm font-medium text-text-muted">
            Last Name
          </label>
          <input
            id="last-name"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="w-full rounded-xl border border-neutral-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-text-muted">
          Email Address
        </label>
        <div className="relative">
          <HiOutlineEnvelope className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-neutral-border bg-white py-3 pl-12 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-text-muted">
          Create Password
        </label>
        <div className="relative">
          <HiOutlineLockClosed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-neutral-border bg-white py-3 pl-12 pr-12 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <HiOutlineEyeSlash className="h-5 w-5" />
            ) : (
              <HiOutlineEye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {role === ROLES.SHOP_OWNER && (
        <p className="rounded-lg bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
          Shop owner accounts require admin approval. You will receive an email when your application
          is reviewed.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary py-3.5 text-base font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {loading
          ? role === ROLES.SHOP_OWNER
            ? 'Submitting application...'
            : 'Creating account...'
          : role === ROLES.SHOP_OWNER
            ? 'Submit Application'
            : 'Create Account'}
      </button>

      <p className="text-center text-xs text-text-muted">
        By signing up, you agree to our{' '}
        <a href="#" className="font-medium text-primary hover:text-primary-dark">
          Terms
        </a>{' '}
        &amp;{' '}
        <a href="#" className="font-medium text-primary hover:text-primary-dark">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  )
}
