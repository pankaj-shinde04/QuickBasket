import { useState } from 'react'
import {
  HiOutlineEnvelope,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2'
import { apiRequest } from '../../services/api'

export default function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      })
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <HiOutlineCheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-dark">Check your email</h2>
          <p className="mt-2 text-sm text-text-muted">
            If <span className="font-semibold text-text-dark">{email}</span> is registered, we've
            sent a password reset link. It expires in <strong>1 hour</strong>.
          </p>
          <p className="mt-3 text-xs text-text-muted">
            Didn't receive it? Check your spam folder or{' '}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-semibold text-primary hover:text-primary-dark"
            >
              try again
            </button>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-border py-3 text-sm font-semibold text-text-muted hover:bg-neutral"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Sign In
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-text-dark">Forgot your password?</h2>
        <p className="mt-1 text-sm text-text-muted">
          Enter your email and we'll send you a link to reset it.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div>
        <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium text-text-muted">
          Email Address
        </label>
        <div className="relative">
          <HiOutlineEnvelope className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
          <input
            id="forgot-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-neutral-border bg-white py-3 pl-12 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary py-3.5 text-base font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <HiOutlineArrowPath className="h-5 w-5 animate-spin" />
            Sending...
          </span>
        ) : (
          'Send Reset Link'
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-border py-3 text-sm font-semibold text-text-muted hover:bg-neutral"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to Sign In
      </button>
    </form>
  )
}
