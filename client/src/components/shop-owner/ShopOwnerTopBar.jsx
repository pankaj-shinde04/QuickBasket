import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'

export default function ShopOwnerTopBar({ searchPlaceholder = 'Search...' }) {
  return (
    <div className="mb-4 border-b border-neutral-border bg-white px-4 py-3 sm:mb-6 sm:px-6 sm:py-4 lg:px-8">
      <div className="relative max-w-md">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          placeholder={searchPlaceholder}
          className="w-full rounded-full border border-neutral-border bg-neutral py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>
    </div>
  )
}
