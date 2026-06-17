import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import CustomerTopNav from './CustomerTopNav'
import CustomerSidebarContent from './CustomerSidebarContent'

export default function CustomerLayout() {
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
    <div className="min-h-screen bg-neutral">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <CustomerTopNav
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((open) => !open)}
        />

        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            />
            <div className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-neutral-border bg-white shadow-lg lg:hidden">
              <CustomerSidebarContent onNavigate={() => setMenuOpen(false)} />
            </div>
          </>
        )}
      </header>

      <div className="flex min-h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-neutral-border bg-white xl:w-64 lg:flex">
          <CustomerSidebarContent />
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
