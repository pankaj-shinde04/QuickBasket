import { useCallback, useEffect, useState } from 'react'
import AdminTopBar from '../../components/admin/AdminTopBar'
import CreateAdminForm from '../../components/admin/CreateAdminForm'
import * as adminApi from '../../services/adminService'

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AdminSettings() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAdmins = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminApi.fetchAdmins()
      setAdmins(response.data.admins)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAdmins()
  }, [loadAdmins])

  return (
    <div>
      <AdminTopBar
        title="Settings"
        subtitle="Create admin accounts and manage platform administrators."
        searchPlaceholder="Search settings..."
      />
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:p-8">
        <div className="rounded-xl border border-neutral-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-bold text-text-dark">Create Admin Account</h2>
          <p className="mt-2 text-sm text-text-muted">
            Admin accounts are stored in the database and can access the full admin panel.
            Public sign-up does not allow admin registration.
          </p>
          <div className="mt-6">
            <CreateAdminForm onCreated={loadAdmins} />
          </div>
        </div>

        <div className="rounded-xl border border-neutral-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-bold text-text-dark">Admin Accounts</h2>
          <p className="mt-2 text-sm text-text-muted">
            All administrators currently registered on the platform.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <div className="mt-6 space-y-3">
            {loading ? (
              <p className="text-sm text-text-muted">Loading admins...</p>
            ) : admins.length === 0 ? (
              <p className="text-sm text-text-muted">No admin accounts found.</p>
            ) : (
              admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-border px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-text-dark">{admin.name}</p>
                    <p className="text-sm text-text-muted">{admin.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Admin
                    </span>
                    <p className="mt-1 text-xs text-text-muted">Joined {formatDate(admin.joinDate)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
