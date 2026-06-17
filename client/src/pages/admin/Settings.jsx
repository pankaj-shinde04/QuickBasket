import AdminTopBar from '../../components/admin/AdminTopBar'

export default function AdminSettings() {
  return (
    <div>
      <AdminTopBar
        title="Settings"
        subtitle="Configure platform preferences and admin account settings."
        searchPlaceholder="Search settings..."
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border border-neutral-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-bold text-text-dark">Platform Settings</h2>
          <p className="mt-2 text-sm text-text-muted">
            Admin settings for notifications, security, and platform configuration will be
            available here.
          </p>
        </div>
      </div>
    </div>
  )
}
