import { useEffect, useRef, useState } from 'react'
import {
  HiOutlineUserCircle,
  HiOutlineBuildingStorefront,
  HiOutlineLockClosed,
  HiOutlineCloudArrowUp,
  HiOutlineXCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'
import { useShop } from '../../context/ShopContext'

// ─── Reusable field ───────────────────────────────────────────────────────────
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

// ─── Alert banner ─────────────────────────────────────────────────────────────
function Alert({ type, message, onDismiss }) {
  if (!message) return null
  const styles = type === 'success'
    ? 'border-green-200 bg-green-50 text-green-700'
    : 'border-red-200 bg-red-50 text-red-600'
  const Icon = type === 'success' ? HiOutlineCheckCircle : HiOutlineXCircle

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100">✕</button>
      )}
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────
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

// ════════════════════════════════════════════════════════════════════
export default function ShopOwnerSettings() {
  const { user } = useAuth()
  const { shop, updateShop, updateProfile, changePassword } = useShop()

  // ── Profile form ──────────────────────────────────────────────────
  const [profile, setProfile] = useState({ firstName: '', lastName: '' })
  const [profileStatus, setProfileStatus] = useState(null) // { type, msg }
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    if (user) setProfile({ firstName: user.firstName || '', lastName: user.lastName || '' })
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileStatus(null)
    try {
      await updateProfile(profile)
      setProfileStatus({ type: 'success', msg: 'Name updated successfully.' })
    } catch (err) {
      setProfileStatus({ type: 'error', msg: err.message || 'Failed to update profile.' })
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Password form ─────────────────────────────────────────────────
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
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      setPwStatus({ type: 'success', msg: 'Password changed successfully.' })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwStatus({ type: 'error', msg: err.message || 'Failed to change password.' })
    } finally {
      setPwLoading(false)
    }
  }

  // ── Shop form ─────────────────────────────────────────────────────
  const fileInputRef = useRef(null)
  const [shopForm, setShopForm] = useState({
    name: '', address: '', contactNumber: '', openingTime: '', closingTime: '',
  })
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [shopStatus, setShopStatus] = useState(null)
  const [shopLoading, setShopLoading] = useState(false)

  useEffect(() => {
    if (shop) {
      setShopForm({
        name: shop.name || '',
        address: shop.address || '',
        contactNumber: shop.contactNumber || '',
        openingTime: shop.openingTime || '',
        closingTime: shop.closingTime || '',
      })
    }
  }, [shop])

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleShopSubmit = async (e) => {
    e.preventDefault()
    setShopLoading(true)
    setShopStatus(null)
    try {
      const formData = new FormData()
      Object.entries(shopForm).forEach(([k, v]) => { if (v !== '') formData.append(k, v) })
      if (logoFile) formData.append('logo', logoFile)
      await updateShop(formData)
      setShopStatus({ type: 'success', msg: 'Shop settings saved successfully.' })
      setLogoFile(null)
      setLogoPreview(null)
    } catch (err) {
      setShopStatus({ type: 'error', msg: err.message || 'Failed to update shop settings.' })
    } finally {
      setShopLoading(false)
    }
  }

  const displayLogo = logoPreview || shop?.logo || null

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-dark">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">Manage your profile, shop details, and security settings.</p>
      </div>

      <div className="space-y-6 max-w-2xl">

        {/* ── Profile Overview card ── */}
        <div className="flex items-center gap-5 rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
          {displayLogo ? (
            <img
              src={displayLogo}
              alt={shop?.name}
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-primary/10"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-light ring-4 ring-primary/10">
              <HiOutlineBuildingStorefront className="h-8 w-8 text-primary" />
            </span>
          )}
          <div>
            <p className="text-lg font-bold text-text-dark">{shop?.name || 'My Store'}</p>
            <p className="text-sm text-text-muted">{user?.firstName} {user?.lastName}</p>
            <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              shop?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {shop?.status ? shop.status.charAt(0).toUpperCase() + shop.status.slice(1) : 'Pending'}
            </span>
          </div>
        </div>

        {/* ── Personal Info ── */}
        <Section icon={HiOutlineUserCircle} title="Personal Information" subtitle="Update your display name">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Alert type={profileStatus?.type} message={profileStatus?.msg} onDismiss={() => setProfileStatus(null)} />
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
              <Input value={user?.email || ''} disabled className="bg-neutral opacity-60 cursor-not-allowed" />
              <p className="mt-1 text-xs text-text-muted">Email cannot be changed.</p>
            </Field>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                {profileLoading && <HiOutlineArrowPath className="h-4 w-4 animate-spin" />}
                Save Profile
              </button>
            </div>
          </form>
        </Section>

        {/* ── Shop Settings ── */}
        <Section icon={HiOutlineBuildingStorefront} title="Shop Settings" subtitle="Update your store name, address, and logo">
          <form onSubmit={handleShopSubmit} className="space-y-4">
            <Alert type={shopStatus?.type} message={shopStatus?.msg} onDismiss={() => setShopStatus(null)} />

            {/* Logo upload */}
            <Field label="Shop Logo">
              <div className="flex items-center gap-4">
                {displayLogo ? (
                  <img
                    src={displayLogo}
                    alt="Logo"
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-neutral-border"
                  />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral ring-2 ring-neutral-border">
                    <HiOutlineBuildingStorefront className="h-7 w-7 text-text-muted" />
                  </span>
                )}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-border px-4 py-2 text-sm font-medium text-text-dark hover:bg-neutral"
                  >
                    <HiOutlineCloudArrowUp className="h-4 w-4" />
                    {displayLogo ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  {logoFile && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:underline"
                    >
                      <HiOutlineXCircle className="h-3.5 w-3.5" />
                      Remove new logo
                    </button>
                  )}
                  <p className="text-xs text-text-muted">PNG, JPG, WEBP · Max 2MB</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleLogoChange}
              />
            </Field>

            <Field label="Shop Name *">
              <Input
                required
                value={shopForm.name}
                onChange={(e) => setShopForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="e.g. Fresh Mart"
              />
            </Field>

            <Field label="Address">
              <Input
                value={shopForm.address}
                onChange={(e) => setShopForm((s) => ({ ...s, address: e.target.value }))}
                placeholder="Full shop address"
              />
            </Field>

            <Field label="Contact Number">
              <Input
                type="tel"
                value={shopForm.contactNumber}
                onChange={(e) => setShopForm((s) => ({ ...s, contactNumber: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Opening Time">
                <Input
                  type="time"
                  value={shopForm.openingTime}
                  onChange={(e) => setShopForm((s) => ({ ...s, openingTime: e.target.value }))}
                />
              </Field>
              <Field label="Closing Time">
                <Input
                  type="time"
                  value={shopForm.closingTime}
                  onChange={(e) => setShopForm((s) => ({ ...s, closingTime: e.target.value }))}
                />
              </Field>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={shopLoading}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                {shopLoading && <HiOutlineArrowPath className="h-4 w-4 animate-spin" />}
                Save Shop Settings
              </button>
            </div>
          </form>
        </Section>

        {/* ── Change Password ── */}
        <Section icon={HiOutlineLockClosed} title="Change Password" subtitle="Use a strong password of at least 8 characters">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Alert type={pwStatus?.type} message={pwStatus?.msg} onDismiss={() => setPwStatus(null)} />
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
  )
}
