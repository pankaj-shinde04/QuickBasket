import { Link } from 'react-router-dom'
import { categories, categoryToSlug } from '../../data/mockData'

export default function CategoryRow() {
  return (
    <section>
      <div className="grid grid-cols-4 gap-3 sm:gap-4 md:grid-cols-8 md:gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/category/${categoryToSlug(cat.name)}`}
            className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full text-xl shadow-sm transition-shadow group-hover:shadow-md sm:h-16 sm:w-16 sm:text-2xl lg:h-[4.5rem] lg:w-[4.5rem] ${cat.color}`}
            >
              {cat.icon}
            </span>
            <span className="text-center text-xs font-semibold text-text-dark sm:text-sm">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
