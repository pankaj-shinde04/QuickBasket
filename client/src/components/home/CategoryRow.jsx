import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../services/api'

// Fallback categories shown while loading or if API fails
const FALLBACK_CATEGORIES = [
  { name: 'Vegetables', icon: '🥦', color: 'bg-green-100', slug: 'vegetables' },
  { name: 'Fresh Fruits', icon: '🍎', color: 'bg-red-100', slug: 'fresh-fruits' },
  { name: 'Desserts', icon: '🍰', color: 'bg-pink-100', slug: 'desserts' },
  { name: 'Drinks', icon: '🥤', color: 'bg-blue-100', slug: 'drinks' },
  { name: 'Snacks', icon: '🍿', color: 'bg-yellow-100', slug: 'snacks' },
  { name: 'Bakery', icon: '🥐', color: 'bg-amber-100', slug: 'bakery' },
  { name: 'Dairy', icon: '🥛', color: 'bg-sky-100', slug: 'dairy' },
  { name: 'Meat', icon: '🥩', color: 'bg-rose-100', slug: 'meat' },
]

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse">
      <div className="h-14 w-14 rounded-full bg-neutral sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem]" />
      <div className="h-3 w-16 rounded bg-neutral" />
    </div>
  )
}

export default function CategoryRow() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest('/public/categories', { method: 'GET' })
        const cats = res.data?.categories || []
        setCategories(cats.length > 0 ? cats : FALLBACK_CATEGORIES)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setCategories(FALLBACK_CATEGORIES)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section>
        <div className="grid grid-cols-4 gap-3 sm:gap-4 md:grid-cols-8 md:gap-5">
          {Array.from({ length: 8 }, (_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="grid grid-cols-4 gap-3 sm:gap-4 md:grid-cols-8 md:gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.id || cat.name}
            to={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full text-xl shadow-sm transition-shadow group-hover:shadow-md sm:h-16 sm:w-16 sm:text-2xl lg:h-[4.5rem] lg:w-[4.5rem] ${cat.color || 'bg-neutral'}`}
            >
              {cat.icon || '📦'}
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
