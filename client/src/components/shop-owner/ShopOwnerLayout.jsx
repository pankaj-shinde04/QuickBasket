import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2'
import ShopOwnerSidebarContent from './ShopOwnerSidebarContent'

export default function ShopOwnerLayout() {
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
      {/* ── Mobile top bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-neutral-border bg-white px-4 py-3 lg:hidden">
        <div>
          <p className="text-base font-bold text-primary">QuickBasket</p>
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
      </header>

      {/* ── Mobile backdrop ── */}
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 top-14 z-40 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* ── Mobile sidebar — drops down from below header ── */}
      <div
        className={`fixed left-0 right-0 top-14 z-40 flex max-h-[calc(100dvh-3.5rem)] flex-col overflow-y-auto border-b border-neutral-border bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
          menuOpen ? 'translate-y-0' : 'pointer-events-none -translate-y-full'
        }`}
        aria-hidden={!menuOpen}
      >
        <ShopOwnerSidebarContent
          onNavigate={() => setMenuOpen(false)}
          showBrand={false}
        />
      </div>

      {/* ── Body: desktop sidebar + main ── */}
      <div className="flex min-h-[calc(100dvh-3.5rem)] lg:min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-border bg-white lg:flex">
          <ShopOwnerSidebarContent showBrand />
        </aside>

        <main className="min-w-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
