import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
  HiOutlineCloudArrowUp,
  HiOutlineBookmark,
} from 'react-icons/hi2'
import { useProducts } from '../../context/ProductContext'
import { productCategories, unitTypes } from '../../data/shopOwnerData'

export default function ShopOwnerAddProduct() {
  const navigate = useNavigate()
  const { addProduct } = useProducts()
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    stock: '',
    unit: 'Piece',
    brand: '',
    taxable: true,
  })

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    addProduct(form)
    navigate('/dashboard/shop-owner/inventory')
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
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <HiOutlineBookmark className="h-5 w-5" />
            Save Product
          </button>
        </div>
      </div>

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

            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-bold text-text-dark">Product Image</h2>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-border bg-neutral py-12 text-center">
                <HiOutlineCloudArrowUp className="h-10 w-10 text-text-muted" />
                <p className="mt-3 text-sm font-medium text-text-dark">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-text-muted">SVG, PNG, JPG or WEBP (max. 5MB)</p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-bold text-text-dark">Organization</h2>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-muted">
                  Product Category *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="">Select category</option>
                  {productCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
                        $
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
                      Discount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form.discount}
                        onChange={(e) => update('discount', e.target.value)}
                        className="w-full rounded-lg border border-neutral-border py-2.5 pl-3 pr-7 text-sm outline-none focus:border-primary"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                        %
                      </span>
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
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
