import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
  HiOutlineCloudArrowUp,
  HiOutlineBookmark,
  HiOutlineXCircle,
  HiOutlinePlus,
} from 'react-icons/hi2'
import { unitTypes } from '../../data/shopOwnerData'
import { createProduct } from '../../services/productService'
import { getCategories, createCategory } from '../../services/categoryService'
import { getAuthToken } from '../../services/api'
import { useProducts } from '../../context/ProductContext'

export default function ShopOwnerAddProduct() {
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

  const [categories, setCategories] = useState([])
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', icon: '📦', color: 'bg-neutral text-text-dark' })
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [creatingCategory, setCreatingCategory] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoadingCategories(true)
    try {
      const token = getAuthToken()
      const res = await getCategories(token)
      setCategories(res.data.categories || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) return

    setCreatingCategory(true)
    try {
      const token = getAuthToken()
      await createCategory(token, newCategory)
      await fetchCategories()
      setNewCategory({ name: '', icon: '📦', color: 'bg-neutral text-text-dark' })
      setShowNewCategoryForm(false)
    } catch (err) {
      console.error('Category creation error:', err)
      alert(err.message || 'Failed to create category')
    } finally {
      setCreatingCategory(false)
    }
  }

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  const removeImage = () => {
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

      // Append all text fields
      Object.entries(form).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          formData.append(key, value)
        }
      })

      // Append image if selected
      if (imageFile) {
        formData.append('image', imageFile)
      }

      await createProduct(token, formData)
      await refresh()
      navigate('/dashboard/shop-owner/inventory')
    } catch (err) {
      setError(err.message || 'Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      {/* Top bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          <Link to="/dashboard/shop-owner/inventory" className="hover:text-primary">
            Inventory
          </Link>{' '}
          &gt; Add Product
        </p>
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
          <h1 className="text-2xl font-bold text-text-dark">Add New Product</h1>
          <p className="mt-1 text-sm text-text-muted">
            Fill in the details below to add a new item to your store.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard/shop-owner/inventory"
            className="rounded-lg border border-neutral-border bg-white px-5 py-2.5 text-sm font-semibold text-text-dark hover:bg-neutral"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="add-product-form"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            <HiOutlineBookmark className="h-5 w-5" />
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form id="add-product-form" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-bold text-text-dark">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    Product Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="e.g. Organic Gala Apples"
                    className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    placeholder="Briefly describe the product, its origin, and qualities..."
                    className="w-full resize-none rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-bold text-text-dark">Product Image</h2>

              {imagePreview ? (
                <div className="relative flex flex-col items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-48 w-48 rounded-xl object-cover shadow"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    <HiOutlineXCircle className="h-4 w-4" />
                    Remove Image
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-border bg-neutral py-12 text-center transition hover:border-primary hover:bg-primary/5"
                >
                  <HiOutlineCloudArrowUp className="h-10 w-10 text-text-muted" />
                  <p className="mt-3 text-sm font-medium text-text-dark">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-text-muted">SVG, PNG, JPG or WEBP (max. 5MB)</p>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-bold text-text-dark">Organization</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-muted">
                    Product Category *
                  </label>
                  {loadingCategories ? (
                    <p className="text-sm text-text-muted">Loading categories...</p>
                  ) : (
                    <>
                      <select
                        required
                        value={form.category}
                        onChange={(e) => update('category', e.target.value)}
                        className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                        className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark"
                      >
                        <HiOutlinePlus className="h-4 w-4" />
                        {showNewCategoryForm ? 'Cancel' : 'Create New Category'}
                      </button>
                    </>
                  )}

                  {/* New Category Form */}
                  {showNewCategoryForm && (
                    <div className="mt-4 rounded-lg border border-neutral-border bg-neutral p-4">
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-text-muted">
                            Category Name *
                          </label>
                          <input
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="e.g. Organic Products"
                            className="w-full rounded-lg border border-neutral-border px-4 py-2 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-text-muted">
                              Icon
                            </label>
                            <input
                              type="text"
                              value={newCategory.icon}
                              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                              placeholder="📦"
                              className="w-full rounded-lg border border-neutral-border px-4 py-2 text-sm outline-none focus:border-primary"
                              maxLength={10}
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-text-muted">
                              Color Class
                            </label>
                            <input
                              type="text"
                              value={newCategory.color}
                              onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                              placeholder="bg-neutral text-text-dark"
                              className="w-full rounded-lg border border-neutral-border px-4 py-2 text-sm outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleCreateCategory}
                            disabled={creatingCategory || !newCategory.name.trim()}
                            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                          >
                            {creatingCategory ? 'Creating...' : 'Create Category'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowNewCategoryForm(false)}
                            className="rounded-lg border border-neutral-border px-4 py-2 text-sm font-semibold text-text-dark hover:bg-neutral"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
            </div>

            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-bold text-text-dark">Pricing &amp; Inventory</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">
                      Base Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                        ₹
                      </span>
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={(e) => update('price', e.target.value)}
                        className="w-full rounded-lg border border-neutral-border py-2.5 pl-7 pr-3 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-muted">
                      Discount Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                        ₹
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.discountPrice}
                        onChange={(e) => update('discountPrice', e.target.value)}
                        placeholder="Optional"
                        className="w-full rounded-lg border border-neutral-border py-2.5 pl-7 pr-3 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                      Unit Type
                    </label>
                    <select
                      value={form.unit}
                      onChange={(e) => update('unit', e.target.value)}
                      className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                    >
                      {unitTypes.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-text-dark">
                  <input
                    type="checkbox"
                    checked={form.taxable}
                    onChange={(e) => update('taxable', e.target.checked)}
                    className="rounded"
                  />
                  Taxable Item
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
