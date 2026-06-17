import { FaStar } from 'react-icons/fa'
import SectionHeading from '../SectionHeading'
import { topVendors } from '../../data/mockData'

export default function TopSellers() {
  return (
    <section>
      <SectionHeading title="Top Seller Users" />
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {topVendors.map((vendor) => (
          <div
            key={vendor.name}
            className="flex flex-col items-center rounded-xl border border-neutral-border bg-white p-5 text-center transition-shadow hover:shadow-md sm:p-6 lg:rounded-2xl"
          >
            <img
              src={vendor.avatar}
              alt={vendor.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-primary-light sm:h-[4.5rem] sm:w-[4.5rem] lg:h-20 lg:w-20"
            />
            <h3 className="mt-3 text-sm font-semibold text-text-dark sm:text-base">
              {vendor.name}
            </h3>
            <div className="mt-1.5 flex items-center gap-1">
              <FaStar className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs font-medium text-text-muted sm:text-sm">
                {vendor.rating}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-text-muted sm:text-sm">{vendor.sales} sales</p>
          </div>
        ))}
      </div>
    </section>
  )
}
