import { Link } from 'react-router-dom'

export default function SectionHeading({ title, viewAllHref = null }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6 lg:mb-8">
      <h2 className="text-xl font-bold text-text-dark sm:text-2xl lg:text-3xl">
        {title}
      </h2>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          View All →
        </Link>
      )}
    </div>
  )
}
