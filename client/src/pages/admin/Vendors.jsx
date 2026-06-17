import { useState } from 'react'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineChevronDown,
  HiOutlineNoSymbol,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2'
import AdminTopBar from '../../components/admin/AdminTopBar'
import { vendors, vendorSummary, vendorStatusStyles, vendorFilters } from '../../data/adminData'

export default function AdminVendors() {
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = vendors.filter((v) => {
    const matchesStatus = statusFilter === 'All Statuses' || v.status === statusFilter
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.owner.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  return (
    <div>
      <AdminTopBar
        title="Vendor Management"
        subtitle="Review and manage all registered merchant shops on the QuickBasket platform."
        badge={`${vendorSummary.pendingRequests} Pending Requests`}
        searchPlaceholder="Search vendors..."
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 flex-1 sm:min-w-[240px]">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by shop name, owner, or email..."
              className="w-full rounded-lg border border-neutral-border py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-neutral-border bg-white py-2.5 pl-4 pr-10 text-sm outline-none focus:border-primary sm:w-auto"
            >
              {vendorFilters.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-neutral-border bg-white px-4 py-2.5 text-sm font-semibold text-text-muted hover:border-primary hover:text-primary"
          >
            <HiOutlineAdjustmentsHorizontal className="h-4 w-4" />
            More Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-neutral-border text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-4 py-3 sm:px-5">Shop Name</th>
                  <th className="px-4 py-3 sm:px-5">Owner</th>
                  <th className="px-4 py-3 sm:px-5">Registration Date</th>
                  <th className="px-4 py-3 sm:px-5">Status</th>
                  <th className="px-4 py-3 sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-neutral-border last:border-0">
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={vendor.logo}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-text-dark">{vendor.name}</p>
                          <p className="text-xs text-text-muted">ID: {vendor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <p className="font-medium text-text-dark">{vendor.owner}</p>
                      <p className="text-xs text-text-muted">{vendor.email}</p>
                    </td>
                    <td className="px-4 py-4 text-text-muted sm:px-5">{vendor.registered}</td>
                    <td className="px-4 py-4 sm:px-5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${vendorStatusStyles[vendor.status]}`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex items-center gap-2">
                        {vendor.status === 'Pending' ? (
                          <>
                            <button
                              type="button"
                              className="flex items-center gap-1 rounded-lg bg-tertiary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                            >
                              <HiOutlineCheck className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              type="button"
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                              aria-label="Reject"
                            >
                              <HiOutlineXMark className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="rounded-lg p-1.5 text-text-muted hover:bg-neutral"
                              aria-label="Suspend"
                            >
                              <HiOutlineNoSymbol className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                              aria-label="Delete"
                            >
                              <HiOutlineTrash className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-neutral-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-text-muted">Showing 1 to {filtered.length} of 128 results</p>
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
              >
                <HiOutlineChevronLeft className="h-5 w-5" />
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                    page === p ? 'bg-primary text-white' : 'text-text-muted hover:bg-neutral'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(3, p + 1))}
                disabled={page === 3}
                className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
              >
                <HiOutlineChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-primary p-5 text-white sm:p-6 md:col-span-1">
            <h3 className="font-bold">Registration Trends</h3>
            <p className="mt-2 text-sm text-white/80">{vendorSummary.registrationTrend}</p>
            <div className="mt-4 flex h-16 items-end gap-2">
              {[40, 55, 48, 70, 62, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-white/30"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-light text-tertiary">
                <HiOutlineCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-text-muted">Total Active Shops</p>
                <p className="text-2xl font-bold text-text-dark">{vendorSummary.totalActive.toLocaleString()}</p>
                <p className="text-xs font-medium text-tertiary">+{vendorSummary.activeToday} today</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-500">
                <HiOutlineXMark className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-text-muted">Suspended Accounts</p>
                <p className="text-2xl font-bold text-text-dark">{vendorSummary.suspended}</p>
                <button type="button" className="text-xs font-semibold text-primary hover:text-primary-dark">
                  Pending review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
