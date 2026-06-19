import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
  HiOutlineArrowLeft,
  HiOutlineCloudArrowUp,
  HiOutlineXCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2'
import { productCategories, unitTypes } from '../../data/shopOwnerData'
import { getProductById, updateProduct, deleteProduct } from '../../services/productService'
import { getAuthToken } from '../../services/api'
import { useProducts } from '../../context/ProductContext'

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop'

export default function ShopOwnerEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refresh } = useProducts()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    unit: 'Piece',
    brand: '',
    taxable: true,
  })

  const [existingImage, setExistingImage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  // Load product from API on mount
  useEffect(() => {
    let cancelled = false

    async function load() {
      setFetching(true)
      setError(null)
      try {
        const token = getAuthToken()
        const res = await getProductById(token, id)
        const p = res.data.product
        if (!cancelled) {
          setForm({
            name: p.name || '',
            description: p.description || '',
            category: p.category || '',
            price: String(p.price ?? ''),
            discountPrice: p.discountPrice != null ? String(p.discountPrice) : '',
            stock: String(p.stock ?? ''),
            unit: p.unit || 'Piece',
            brand: p.brand || '',
            taxable: p.taxable ?? true,
          })
          setExistingImage(p.image || '')
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 404) setNotFound(true)
          else setError(err.message || 'Failed to load product.')
        }
      } finally {
        if (!cancelled) setFetching(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeNewImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const token = getAuthToken()
      const formData = new FormData()

      Object.entries(form).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          formData.append(key, value)
        }
      })

      if (imageFile) {
        formData.append('image', imageFile)
      }

      await updateProduct(token, id, formData)
      await refresh()
      navigate('/dashboard/shop-owner/inventory')
    } catch (err) {
      setError(err.message || 'Failed to update product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.')) return
    setDeleting(true)
    try {
      const token = getAuthToken()
      await deleteProduct(token, id)
      await refresh()
      navigate('/dashboard/shop-owner/inventory')
    } catch (err) {
      setError(err.message || 'Failed to delete product.')
      setDeleting(false)
    }
  }

  // ── states ────────────────────────────────────────────────────────────────

  if (fetching) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8">
        <HiOutlineArrowPath className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-text-muted">Loading product...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
        <p className="font-semibold text-text-dark">Product not found.</p>
        <Link
          to="/dashboard/shop-owner/inventory"
          className="mt-4 text-sm font-semibold text-primary hover:text-primary-dark"
        >
          ← Back to Inventory
        </Link>
      </div>
    )
  }

  const displayImage = imagePreview || existingImage || null

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      {/* Top bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-primary sm:text-2xl">Inventory Management</h1>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Search inventory..."
              className="w-48 rounded-full border border-neutral-border bg-white py-2 pl-9 pr-4 text-sm outline-none"
            />
          </div>
          <button type="button" className="rounded-full p-2 text-text-muted hover:bg-white">
            <HiOutlineBell className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-full p-2 text-text-muted hover:bg-white">
            <HiOutlineQuestionMarkCircle className="h-5 w-5" />
          </button>
          <HiOutlineUserCircle className="h-8 w-8 text-text-muted" />
        </div>
      </div>

      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/dashboard/shop-owner/inventory"
            className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to Inventory
          </Link>
          <h2 className="text-2xl font-bold text-text-dark">Edit Product</h2>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete Product'}
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">

            {/* Basic Info */}
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-text-dark">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    Product Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">
                      Category *
                    </label>
                    <select
                      required
                      value={form.category}
                      onChange={(e) => update('category', e.target.value)}
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                    >
                      <option value="">Select category</option>
                      {productCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">
                      Brand / Origin
                    </label>
                    <input
                      value={form.brand}
                      onChange={(e) => update('brand', e.target.value)}
                      placeholder="e.g. Sunny Farms"
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    className="w-full resize-none rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-text-dark">Pricing</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    Regular Price (₹) *
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => update('price', e.target.value)}
                    className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    Discount Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.discountPrice}
                    onChange={(e) => update('discountPrice', e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-text-dark">
                <input
                  type="checkbox"
                  checked={form.taxable}
                  onChange={(e) => update('taxable', e.target.checked)}
                  className="rounded"
                />
                Taxable Item
              </label>
            </div>

            {/* Inventory */}
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-text-dark">Inventory</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    Stock Quantity *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => update('stock', e.target.value)}
                    className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    Unit of Measure
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) => update('unit', e.target.value)}
                    className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    {unitTypes.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Image */}
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-text-dark">Product Image</h3>

              {displayImage ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={displayImage}
                    alt={form.name}
                    onError={(e) => { e.target.src = PLACEHOLDER }}
                    className="h-48 w-full rounded-xl object-cover shadow"
                  />
                  {imageFile && (
                    <button
                      type="button"
                      onClick={removeNewImage}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      <HiOutlineXCircle className="h-4 w-4" />
                      Remove new image
                    </button>
                  )}
                  {!imageFile && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-border px-4 py-2 text-sm font-medium text-text-dark hover:bg-neutral"
                    >
                      <HiOutlineCloudArrowUp className="h-4 w-4" />
                      Change Image
                    </button>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-border bg-neutral py-12 text-center transition hover:border-primary hover:bg-primary/5"
                >
                  <HiOutlineCloudArrowUp className="h-10 w-10 text-text-muted" />
                  <p className="mt-3 text-sm font-medium text-text-dark">Click to upload</p>
                  <p className="mt-1 text-xs text-text-muted">PNG, JPG, WEBP (max 5MB)</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? 'Saving changes...' : 'Save Changes'}
            </button>

            <Link
              to="/dashboard/shop-owner/inventory"
              className="block w-full rounded-lg border border-neutral-border py-3 text-center text-sm font-semibold text-text-dark hover:bg-neutral"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
