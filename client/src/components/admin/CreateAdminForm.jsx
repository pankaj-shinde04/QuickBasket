import { useState } from 'react'
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2'
import * as adminApi from '../../services/adminService'

export default function CreateAdminForm({ onCreated }) {
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
      await adminApi.createAdmin({ firstName, lastName, email, password })
      setSuccess('Admin account created successfully.')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      onCreated?.()
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
          <label htmlFor="admin-first-name" className="mb-1.5 block text-sm font-medium text-text-muted">
            First Name
          </label>
          <input
            id="admin-first-name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Alex"
            className="w-full rounded-xl border border-neutral-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label htmlFor="admin-last-name" className="mb-1.5 block text-sm font-medium text-text-muted">
            Last Name
          </label>
          <input
            id="admin-last-name"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Admin"
            className="w-full rounded-xl border border-neutral-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-text-muted">
          Email Address
        </label>
        <div className="relative">
          <HiOutlineEnvelope className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
          <input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@quickbasket.com"
            className="w-full rounded-xl border border-neutral-border bg-white py-3 pl-12 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-text-muted">
          Password
        </label>
        <div className="relative">
          <HiOutlineLockClosed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
          <input
            id="admin-password"
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

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {loading ? 'Creating...' : 'Create Admin Account'}
      </button>
    </form>
  )
}
