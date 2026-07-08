import { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import SectionHeading from '../SectionHeading'
import { apiRequest } from '../../services/api'

function ShopSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center rounded-xl border border-neutral-border bg-white p-5 text-center sm:p-6 lg:rounded-2xl">
      <div className="h-16 w-16 rounded-full bg-neutral sm:h-[4.5rem] sm:w-[4.5rem] lg:h-20 lg:w-20" />
      <div className="mt-3 h-4 w-24 rounded bg-neutral" />
      <div className="mt-2 h-3 w-16 rounded bg-neutral" />
    </div>
  )
}

export default function TopSellers() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await apiRequest('/public/shops?limit=4', { method: 'GET' })
        setShops(res.data?.shops || [])
      } catch (err) {
        console.error('Failed to fetch top shops:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchShops()
  }, [])

  if (loading) {
    return (
      <section>
        <SectionHeading title="Top Seller Shops" />
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => <ShopSkeleton key={i} />)}
        </div>
      </section>
    )
  }

  if (shops.length === 0) return null

  return (
    <section>
      <SectionHeading title="Top Seller Shops" />
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="flex flex-col items-center rounded-xl border border-neutral-border bg-white p-5 text-center transition-shadow hover:shadow-md sm:p-6 lg:rounded-2xl"
          >
            {shop.logo ? (
              <img
                src={shop.logo}
                alt={shop.name}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-primary-light sm:h-[4.5rem] sm:w-[4.5rem] lg:h-20 lg:w-20"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            {/* Fallback avatar with initials */}
            <div
              className={`${shop.logo ? 'hidden' : 'flex'} h-16 w-16 items-center justify-center rounded-full bg-primary-light text-xl font-bold text-primary ring-2 ring-primary-light sm:h-[4.5rem] sm:w-[4.5rem] lg:h-20 lg:w-20`}
            >
              {shop.name?.charAt(0)?.toUpperCase() || '?'}
            </div>

            <h3 className="mt-3 text-sm font-semibold text-text-dark sm:text-base line-clamp-1">
              {shop.name}
            </h3>
            <div className="mt-1.5 flex items-center gap-1">
              <FaStar className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs font-medium text-text-muted sm:text-sm">Top Seller</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-text-muted sm:text-sm">
              <HiOutlineShoppingBag className="h-3.5 w-3.5" />
              <span>{shop.productCount} products</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
