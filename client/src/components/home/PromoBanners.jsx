import { promoBanners } from '../../data/mockData'

export default function PromoBanners() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {promoBanners.map((banner) => (
        <div
          key={banner.title}
          className={`relative min-h-[160px] overflow-hidden rounded-xl p-5 text-white sm:min-h-[180px] sm:p-6 lg:min-h-[200px] lg:rounded-2xl lg:p-7 ${
            banner.bg
          } ${promoBanners.indexOf(banner) === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
        >
          <div className="relative z-10 max-w-[70%]">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
              {banner.subtitle}
            </p>
            <h3 className="mt-1.5 text-xl font-bold sm:text-2xl lg:text-3xl">{banner.title}</h3>
            <button
              type="button"
              className="mt-4 rounded-lg bg-white/20 px-5 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              Shop Now
            </button>
          </div>
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute -bottom-3 -right-3 h-24 w-24 rounded-xl object-cover opacity-90 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
          />
        </div>
      ))}
    </section>
  )
}
