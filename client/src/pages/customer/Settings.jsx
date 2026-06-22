import { useEffect, useRef, useState } from 'react'
import {
  HiOutlineUserCircle,
  HiOutlineLockClosed,
  HiOutlineCloudArrowUp,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowPath,
  HiOutlineCamera,
} from 'react-icons/hi2'
import CustomerFooter from '../../components/customer/CustomerFooter'
import { useAuth } from '../../context/AuthContext'
import { getAuthToken, apiFormRequest, apiRequest } from '../../services/api'

// ── Reusable sub-components ───────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-muted">{label}</label>
      {children}
    </div>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    />
  )
}

function StatusBanner({ status, onDismiss }) {
  if (!status) return null
  const ok = status.type === 'success'
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${ok ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-600'}`}>
      {ok ? <HiOutlineCheckCircle className="h-4 w-4 shrink-0" /> : <HiOutlineXCircle className="h-4 w-4 shrink-0" />}
      <span className="flex-1">{status.msg}</span>
      <button type="button" onClick={onDismiss} className="opacity-60 hover:opacity-100">✕</button>
    </div>
  )
}

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-xl border border-neutral-border bg-white shadow-sm">
      <div className="border-b border-neutral-border px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light">
            <Icon className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h2 className="text-base font-bold text-text-dark">{title}</h2>
            {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CustomerSettings() {
  const { user, setUser } = useAuth()
  const fileInputRef = useRef(null)

  // ── Profile state ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({ firstName: '', lastName: '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [profileStatus, setProfileStatus] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    if (user) setProfile({ firstName: user.firstName || '', lastName: user.lastName || '' })
  }, [user])

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileStatus(null)
    try {
      const token = getAuthToken()
      const formData = new FormData()
      formData.append('firstName', profile.firstName)
      formData.append('lastName', profile.lastName)
      if (avatarFile) formData.append('logo', avatarFile) // middleware uses 'logo' field name

      const res = await apiFormRequest('/settings/profile', formData, 'PATCH', token)
      // Update AuthContext with new user data
      if (setUser && res.data?.user) setUser(res.data.user)
      setAvatarFile(null)
      setProfileStatus({ type: 'success', msg: 'Profile updated successfully.' })
    } catch (err) {
      setProfileStatus({ type: 'error', msg: err.message || 'Failed to update profile.' })
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Password state ─────────────────────────────────────────────────────────
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwStatus, setPwStatus] = useState(null)
  const [pwLoading, setPwLoading] = useState(false)

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwStatus({ type: 'error', msg: 'New passwords do not match.' })
      return
    }
    if (passwords.newPassword.length < 8) {
      setPwStatus({ type: 'error', msg: 'Password must be at least 8 characters.' })
      return
    }
    setPwLoading(true)
    setPwStatus(null)
    try {
      const token = getAuthToken()
      await apiRequest('/settings/password', {
        method: 'PATCH',
        token,
        body: { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
      })
      setPwStatus({ type: 'success', msg: 'Password changed successfully.' })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwStatus({ type: 'error', msg: err.message || 'Failed to change password.' })
    } finally {
      setPwLoading(false)
    }
  }

  const displayAvatar = avatarPreview || user?.avatar || null
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()

  return (
    <div>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-dark">Account Settings</h1>
          <p className="mt-1 text-sm text-text-muted">Manage your profile and security settings.</p>
        </div>

        <div className="mx-auto max-w-2xl space-y-6">

          {/* ── Profile overview card ── */}
          <div className="flex items-center gap-5 rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className="relative">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={user?.firstName}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/10"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light ring-4 ring-primary/10">
                  <span className="text-2xl font-bold text-primary">{initials || '?'}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary-dark"
                aria-label="Change photo"
              >
                <HiOutlineCamera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-lg font-bold text-text-dark">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-text-muted">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                {user?.role || 'customer'}
              </span>
            </div>
          </div>

          {/* ── Profile details ── */}
          <Section icon={HiOutlineUserCircle} title="Personal Information" subtitle="Update your name and profile photo">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <StatusBanner status={profileStatus} onDismiss={() => setProfileStatus(null)} />

              {/* Avatar upload */}
              <Field label="Profile Photo">
                <div className="flex items-center gap-4">
                  {displayAvatar ? (
                    <img src={displayAvatar} alt="Avatar" className="h-14 w-14 rounded-full object-cover ring-2 ring-neutral-border" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral ring-2 ring-neutral-border">
                      <span className="text-lg font-bold text-text-muted">{initials || '?'}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-border px-4 py-2 text-sm font-medium text-text-dark hover:bg-neutral"
                    >
                      <HiOutlineCloudArrowUp className="h-4 w-4" />
                      {displayAvatar ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    {avatarFile && (
                      <p className="text-xs text-primary">{avatarFile.name}</p>
                    )}
                    <p className="text-xs text-text-muted">PNG, JPG, WEBP · Max 2MB</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First Name">
                  <Input
                    required
                    value={profile.firstName}
                    onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="First name"
                  />
                </Field>
                <Field label="Last Name">
                  <Input
                    required
                    value={profile.lastName}
                    onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Last name"
                  />
                </Field>
              </div>

              <Field label="Email Address">
                <Input value={user?.email || ''} disabled className="cursor-not-allowed bg-neutral opacity-60" />
                <p className="mt-1 text-xs text-text-muted">Email cannot be changed.</p>
              </Field>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {profileLoading && <HiOutlineArrowPath className="h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </Section>

          {/* ── Change Password ── */}
          <Section icon={HiOutlineLockClosed} title="Change Password" subtitle="Use a strong password of at least 8 characters">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <StatusBanner status={pwStatus} onDismiss={() => setPwStatus(null)} />
              <Field label="Current Password">
                <Input
                  required
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </Field>
              <Field label="New Password">
                <Input
                  required
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="At least 8 characters"
                />
              </Field>
              <Field label="Confirm New Password">
                <Input
                  required
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                />
              </Field>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {pwLoading && <HiOutlineArrowPath className="h-4 w-4 animate-spin" />}
                  Change Password
                </button>
              </div>
            </form>
          </Section>

        </div>
      </div>
      <CustomerFooter variant="simple" />
    </div>
  )
}
