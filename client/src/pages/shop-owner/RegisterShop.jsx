import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineBuildingStorefront,
  HiOutlinePencilSquare,
  HiOutlineClock,
  HiOutlineCloudArrowUp,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineArrowRight,
} from 'react-icons/hi2'
import * as shopApi from '../../services/shopService'

export default function RegisterShop() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [shopName, setShopName] = useState('')
  const [address, setAddress] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [openingTime, setOpeningTime] = useState('08:00')
  const [closingTime, setClosingTime] = useState('20:00')
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [draftLoading, setDraftLoading] = useState(false)

  useEffect(() => {
    async function loadDraft() {
      try {
        const response = await shopApi.fetchMyShop()
        const shop = response.data.shop
        setShopName(shop.name === 'Pending Registration' ? '' : shop.name || '')
        setAddress(shop.address || '')
        setContactNumber(shop.contactNumber || '')
        setOpeningTime(shop.openingTime || '08:00')
        setClosingTime(shop.closingTime || '20:00')
        if (shop.logo) setLogoPreview(shop.logo)
      } catch {
        // New shop — empty form
      }
    }

    loadDraft()
  }, [])

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be 2MB or smaller.')
      return
    }

    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
    setError('')
  }

  const buildFormData = () => {
    const formData = new FormData()
    formData.append('name', shopName)
    formData.append('address', address)
    formData.append('contactNumber', contactNumber)
    formData.append('openingTime', openingTime)
    formData.append('closingTime', closingTime)
    if (logoFile) formData.append('logo', logoFile)
    return formData
  }

  const handleSaveDraft = async () => {
    setError('')
    setDraftLoading(true)

    try {
      await shopApi.saveShopDraft(buildFormData())
    } catch (err) {
      setError(err.message)
    } finally {
      setDraftLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await shopApi.registerShop(buildFormData())
      navigate('/dashboard/shop-owner', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">Register Your Shop</h1>
          <p className="mt-2 text-sm text-text-muted sm:text-base">
            Set up your store on QuickBasket to start reaching new customers with fresh groceries.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <section className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <HiOutlineBuildingStorefront className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-text-dark">Basic Information</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="shop-name" className="mb-1.5 block text-sm font-medium text-text-muted">
                  Shop Name *
                </label>
                <input
                  id="shop-name"
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g., Green Valley Organics"
                  className="w-full rounded-xl border border-neutral-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="shop-address" className="mb-1.5 block text-sm font-medium text-text-muted">
                  Shop Address *
                </label>
                <textarea
                  id="shop-address"
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Fresh Lane, Market District"
                  className="w-full rounded-xl border border-neutral-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="contact-number" className="mb-1.5 block text-sm font-medium text-text-muted">
                  Contact Number *
                </label>
                <input
                  id="contact-number"
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-xl border border-neutral-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <HiOutlinePencilSquare className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-text-dark">Branding</h2>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-muted">Shop Logo *</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-border bg-neutral px-6 py-10 text-center transition-colors hover:border-primary"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Shop logo preview"
                    className="mb-3 h-24 w-24 rounded-xl object-cover"
                  />
                ) : (
                  <HiOutlineCloudArrowUp className="mb-3 h-10 w-10 text-text-muted" />
                )}
                <p className="text-sm font-semibold text-text-dark">Drag &amp; drop or browse</p>
                <p className="mt-1 text-xs text-text-muted">PNG, JPG up to 2MB</p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <HiOutlineClock className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-text-dark">Operating Hours</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="opening-time" className="mb-1.5 block text-sm font-medium text-text-muted">
                  Opening Time *
                </label>
                <div className="relative">
                  <HiOutlineSun className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                  <input
                    id="opening-time"
                    type="time"
                    required
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full rounded-xl border border-neutral-border py-3 pl-12 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="closing-time" className="mb-1.5 block text-sm font-medium text-text-muted">
                  Closing Time *
                </label>
                <div className="relative">
                  <HiOutlineMoon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                  <input
                    id="closing-time"
                    type="time"
                    required
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full rounded-xl border border-neutral-border py-3 pl-12 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={draftLoading || loading}
              className="rounded-xl border border-primary px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary-light disabled:opacity-60"
            >
              {draftLoading ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="submit"
              disabled={loading || draftLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Register Shop'}
              <HiOutlineArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
