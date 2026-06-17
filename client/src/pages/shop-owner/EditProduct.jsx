import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
  HiOutlineArrowLeft,
} from 'react-icons/hi2'
import { useProducts } from '../../context/ProductContext'
import { productCategories, unitTypes } from '../../data/shopOwnerData'

export default function ShopOwnerEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, updateProduct, deleteProduct } = useProducts()
  const product = getProduct(id)

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    unit: 'Piece',
    brand: '',
    sku: '',
    taxable: true,
    image: '',
  })

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        category: product.category,
        price: String(product.price),
        discountPrice: product.discountPrice ? String(product.discountPrice) : '',
        stock: String(product.stock),
        unit: product.unit,
        brand: product.brand,
        sku: product.sku,
        taxable: product.taxable,
        image: product.image,
      })
    }
  }, [product])

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
        <p className="text-text-muted">Product not found.</p>
        <Link
          to="/dashboard/shop-owner/inventory"
          className="mt-4 text-sm font-semibold text-primary"
        >
          Back to Inventory
        </Link>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProduct(id, form)
    navigate('/dashboard/shop-owner/inventory')
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
      navigate('/dashboard/shop-owner/inventory')
    }
  }

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
          <h1 className="text-2xl font-bold text-text-dark">Edit Product</h1>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
        >
          Delete Product
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm sm:p-6">
          {/* Top row: image + name */}
          <div className="mb-6 grid gap-5 sm:grid-cols-[120px_1fr]">
            <img
              src={form.image}
              alt={form.name}
              className="h-28 w-28 rounded-xl object-cover"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-muted">
                Product Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-muted">Category</label>
              <select
                required
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                {productCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-muted">
                Brand/Origin
              </label>
              <input
                value={form.brand}
                onChange={(e) => update('brand', e.target.value)}
                className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-5">
            <h2 className="mb-3 text-sm font-bold text-text-dark">Pricing</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-muted">
                  Regular Price ($)
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
                  Discount Price ($)
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
            <label className="mt-3 flex items-center gap-2 text-sm text-text-dark">
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
          <div className="mb-5">
            <h2 className="mb-3 text-sm font-bold text-text-dark">Inventory</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-muted">
                  Current Stock
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
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-muted">
                  SKU / Barcode
                </label>
                <input
                  value={form.sku}
                  onChange={(e) => update('sku', e.target.value)}
                  className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-text-muted">
              Product Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full resize-none rounded-lg border border-neutral-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link
              to="/dashboard/shop-owner/inventory"
              className="rounded-lg border border-neutral-border px-6 py-2.5 text-sm font-semibold text-text-dark hover:bg-neutral"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Update Product
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
