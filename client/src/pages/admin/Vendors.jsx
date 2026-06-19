import { useCallback, useEffect, useState } from 'react'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineChevronDown,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2'
import AdminTopBar from '../../components/admin/AdminTopBar'
import { vendorStatusStyles, vendorFilters } from '../../data/adminData'
import * as adminApi from '../../services/adminService'
import { formatJoinDate } from '../../utils/adminUser'

const STATUS_FILTER_MAP = {
  'All Statuses': '',
  Active: 'active',
  Pending: 'pending',
  Suspended: 'suspended',
  Rejected: 'rejected',
}

export default function AdminVendors() {
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [vendors, setVendors] = useState([])
  const [stats, setStats] = useState(null)
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const loadVendors = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminApi.fetchVendors({
        page,
        limit: 10,
        status: STATUS_FILTER_MAP[statusFilter],
        search: search.trim() || undefined,
      })
      setVendors(response.data.vendors)
      setPagination(response.data.pagination)
    } catch (err) {
      setError(err.message)
      setVendors([])
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  const loadStats = useCallback(async () => {
    try {
      const response = await adminApi.fetchVendorStats()
      setStats(response.data.stats)
    } catch {
      setStats(null)
    }
  }, [])

  useEffect(() => {
    loadVendors()
  }, [loadVendors])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const handleApprove = async (vendorId) => {
    setActionLoading(vendorId)
    setError('')

    try {
      await adminApi.approveVendor(vendorId)
      await Promise.all([loadVendors(), loadStats()])
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (vendorId) => {
    setActionLoading(vendorId)
    setError('')

    try {
      await adminApi.rejectVendor(vendorId)
      await Promise.all([loadVendors(), loadStats()])
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <AdminTopBar
        title="Vendor Management"
        subtitle="Review and manage all registered merchant shops on the QuickBasket platform."
        badge={stats ? `${stats.pendingRequests} Pending Requests` : undefined}
        searchPlaceholder="Search vendors..."
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 flex-1 sm:min-w-[240px]">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by shop name, owner, or email..."
              className="w-full rounded-lg border border-neutral-border py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted sm:px-5">
                      Loading vendors...
                    </td>
                  </tr>
                ) : vendors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted sm:px-5">
                      No vendors found.
                    </td>
                  </tr>
                ) : (
                  vendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b border-neutral-border last:border-0">
                      <td className="px-4 py-4 sm:px-5">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-text-dark">{vendor.name}</p>
                          <p className="text-xs text-text-muted">ID: {vendor.shopId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <p className="font-medium text-text-dark">{vendor.owner}</p>
                        <p className="text-xs text-text-muted">{vendor.email}</p>
                      </td>
                      <td className="px-4 py-4 text-text-muted sm:px-5">
                        {formatJoinDate(vendor.registered)}
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${vendorStatusStyles[vendor.status] ?? vendorStatusStyles.Pending}`}
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
                                disabled={actionLoading === vendor.id}
                                onClick={() => handleApprove(vendor.id)}
                                className="flex items-center gap-1 rounded-lg bg-tertiary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
                              >
                                <HiOutlineCheck className="h-4 w-4" />
                                {actionLoading === vendor.id ? 'Saving...' : 'Approve'}
                              </button>
                              <button
                                type="button"
                                disabled={actionLoading === vendor.id}
                                onClick={() => handleReject(vendor.id)}
                                className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-60"
                                aria-label="Reject"
                              >
                                <HiOutlineXMark className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-text-muted">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-neutral-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-text-muted">
              Showing {vendors.length} of {pagination.total ?? 0} results
            </p>
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
              >
                <HiOutlineChevronLeft className="h-5 w-5" />
              </button>
              <span className="px-3 text-sm text-text-muted">
                Page {pagination.page ?? page} of {pagination.totalPages ?? 1}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages ?? 1, p + 1))}
                disabled={page >= (pagination.totalPages ?? 1) || loading}
                className="rounded-lg p-2 text-text-muted hover:bg-neutral disabled:opacity-40"
              >
                <HiOutlineChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-primary p-5 text-white sm:p-6 md:col-span-1">
            <h3 className="font-bold">Registration Trends</h3>
            <p className="mt-2 text-sm text-white/80">
              {stats?.registrationTrend ?? 'Shop applications are reviewed by admin before activation.'}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-light text-tertiary">
                <HiOutlineCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-text-muted">Total Active Shops</p>
                <p className="text-2xl font-bold text-text-dark">
                  {stats?.totalActive?.toLocaleString() ?? '—'}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-500">
                <HiOutlineXMark className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-text-muted">Pending / Rejected</p>
                <p className="text-2xl font-bold text-text-dark">
                  {(stats?.pendingRequests ?? 0) + (stats?.rejected ?? 0)}
                </p>
                <p className="text-xs text-text-muted">
                  {stats?.pendingRequests ?? 0} pending · {stats?.rejected ?? 0} rejected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
