import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'

export default function AdminTopBar({
  title,
  subtitle,
  searchPlaceholder = 'Search...',
  badge,
}) {
  return (
    <div className="border-b border-neutral-border bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-text-dark sm:text-2xl">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {badge && (
            <span className="hidden rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary sm:inline">
              {badge}
            </span>
          )}
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-neutral-border bg-neutral py-2 pl-9 pr-4 text-sm outline-none focus:border-primary sm:w-48 md:w-56 lg:w-64"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
