import {
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
} from 'react-icons/hi2'

export default function ShopOwnerTopBar({ searchPlaceholder = 'Search...' }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-border bg-white px-4 py-3 sm:mb-6 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
      <div className="relative order-2 w-full sm:order-1 sm:max-w-md sm:flex-1">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          placeholder={searchPlaceholder}
          className="w-full rounded-full border border-neutral-border bg-neutral py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>
      <div className="order-1 ml-auto flex items-center gap-2 sm:order-2 sm:gap-3">
        <button type="button" className="relative rounded-full p-2 text-text-muted hover:bg-neutral">
          <HiOutlineBell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button type="button" className="rounded-full p-2 text-text-muted hover:bg-neutral">
          <HiOutlineQuestionMarkCircle className="h-5 w-5" />
        </button>
        <HiOutlineUserCircle className="h-8 w-8 text-text-muted" />
      </div>
    </div>
  )
}
