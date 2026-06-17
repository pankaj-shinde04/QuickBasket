import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2'
import AdminSidebarContent from './AdminSidebarContent'
import AdminFooter from './AdminFooter'

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="flex min-h-screen flex-col bg-neutral">
      <header className="sticky top-0 z-50 bg-white shadow-sm lg:hidden">
        <div className="flex items-center justify-between border-b border-neutral-border px-4 py-3">
          <div>
            <p className="text-base font-bold text-primary">QuickBasket Admin</p>
            <p className="text-xs text-text-muted">Platform Management</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-text-dark hover:bg-neutral"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <HiOutlineXMark className="h-7 w-7" />
            ) : (
              <HiOutlineBars3 className="h-7 w-7" />
            )}
          </button>
        </div>

        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 top-14 z-40 bg-black/50"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            />
            <div className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-neutral-border bg-white shadow-lg">
              <AdminSidebarContent onNavigate={() => setMenuOpen(false)} showBrand={false} />
            </div>
          </>
        )}
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-neutral-border bg-white xl:w-64 lg:flex">
          <AdminSidebarContent showBrand />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="min-w-0 flex-1 overflow-x-hidden">
            <Outlet />
          </main>
          <AdminFooter />
        </div>
      </div>
    </div>
  )
}
