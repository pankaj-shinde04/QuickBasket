import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineCheckCircle,
  HiOutlineEnvelopeOpen,
} from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getPostAuthPath, ROLES } from '../../constants/roles'

export default function SignUpForm({ role, onSwitchToLogin }) {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const session = await signup({ firstName, lastName, email, password, role })

      if (session.pending) {
        // Shop owner application submitted — admin must approve before they can log in.
        // Do NOT navigate; stay on the auth page and show the confirmation message.
        setSuccess(
          'Your shop owner application has been submitted! Our admin team will review it shortly. You will receive an email once your account is approved — then you can log in.'
        )
        setSubmitted(true)
        toastSuccess('Application submitted!', 'Check your email')
        return
      }

      toastSuccess('Welcome to QuickBasket!', 'Account created')
      navigate(getPostAuthPath(session.role), { replace: true })
    } catch (err) {
      setError(err.message)
      toastError(err.message, 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Pending approval confirmation screen ─────────────────────────────────
  if (submitted) {
    return (
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <HiOutlineCheckCircle className="h-9 w-9 text-green-600" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-dark">Application Submitted!</h3>
          <p className="mt-1 text-sm text-text-muted">Your shop owner application is under review.</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-4 text-left">
          <div className="flex gap-3">
            <HiOutlineEnvelopeOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold">What happens next?</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                <li>Our admin team will review your application</li>
                <li>You'll receive an <strong>approval email</strong> once reviewed</li>
                <li>After approval, log in and complete your shop profile</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-xs text-text-muted">
          Already approved?{' '}
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="font-medium text-primary hover:text-primary-dark"
          >
            Back to Sign Up
          </button>
          {' '}or{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-primary hover:text-primary-dark"
          >
            switch to Log In
          </button>
          {' '}to sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
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
