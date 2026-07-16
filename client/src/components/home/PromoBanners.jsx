import { Link } from 'react-router-dom'

const BANNERS = [
  {
    id: 'fresh-produce',
    subtitle: 'Daily Fresh',
    title: 'Farm-fresh Fruits & Veggies',
    bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=160&h=160&fit=crop',
    href: '/category/fresh-fruits',
  },
  {
    id: 'dairy-essentials',
    subtitle: 'Every Morning',
    title: 'Dairy & Breakfast Essentials',
    bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    image: 'https://images.unsplash.com/photo-1563636619-e91424eaafc3?w=160&h=160&fit=crop',
    href: '/category/dairy',
  },
  {
    id: 'snacks-drinks',
    subtitle: 'Grab & Go',
    title: 'Snacks, Drinks & More',
    bg: 'bg-gradient-to-br from-orange-500 to-amber-600',
    image: 'https://images.unsplash.com/photo-1548907040-4d61b257bc88?w=160&h=160&fit=crop',
    href: '/category/snacks',
  },
]

export default function PromoBanners() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {BANNERS.map((banner, idx) => (
        <Link
          key={banner.id}
          to={banner.href}
          className={`relative min-h-[160px] overflow-hidden rounded-xl p-5 text-white transition-transform hover:scale-[1.02] sm:min-h-[180px] sm:p-6 lg:min-h-[200px] lg:rounded-2xl lg:p-7 ${banner.bg} ${
            idx === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
          }`}
        >
          <div className="relative z-10 max-w-[70%]">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
              {banner.subtitle}
            </p>
            <h3 className="mt-1.5 text-xl font-bold sm:text-2xl lg:text-3xl">{banner.title}</h3>
            <span className="mt-4 inline-block rounded-lg bg-white/20 px-5 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30">
              Shop Now
            </span>
          </div>
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute -bottom-3 -right-3 h-24 w-24 rounded-xl object-cover opacity-90 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
          />
        </Link>
      ))}
    </section>
  )
}
