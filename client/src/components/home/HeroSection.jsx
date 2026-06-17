export default function HeroSection() {
  return (
    <section className="grid gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {/* Main hero banner */}
      <div className="relative min-h-[260px] overflow-hidden rounded-2xl bg-primary p-6 text-white sm:min-h-[300px] sm:p-8 lg:col-span-2 lg:min-h-[360px] lg:rounded-3xl lg:p-10">
        <div className="relative z-10 max-w-md">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            Limited Offer
          </span>
          <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-[2.5rem]">
            Fresh Organic Food for All
          </h1>
          <p className="mt-3 text-2xl font-extrabold text-secondary sm:text-3xl lg:text-4xl">
            $59.00
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-secondary px-8 py-3 text-sm font-bold text-text-dark transition-colors hover:bg-secondary-dark sm:text-base"
          >
            Shop Now
          </button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&h=500&fit=crop"
          alt="Organic beverages"
          className="absolute bottom-0 right-0 h-36 w-auto object-contain sm:h-44 md:h-52 lg:h-60"
        />
      </div>

      {/* Side banners */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:flex lg:flex-col lg:gap-6">
        <div className="relative flex min-h-[150px] items-center overflow-hidden rounded-2xl bg-sky-300 p-5 sm:min-h-[170px] lg:min-h-[170px] lg:flex-1 lg:rounded-3xl">
          <div className="relative z-10 max-w-[60%]">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-800">
              New Arrival
            </p>
            <h2 className="mt-1.5 text-lg font-bold text-sky-900 sm:text-xl lg:text-2xl">
              Creamy Fruits Baby Jam
            </h2>
            <button
              type="button"
              className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-50 sm:text-sm"
            >
              Shop Now
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1587049352846-4a222e784422?w=300&h=300&fit=crop"
            alt="Baby jam"
            className="absolute -right-2 bottom-0 h-24 w-24 object-contain sm:h-28 sm:w-28 lg:h-32 lg:w-32"
          />
        </div>

        <div className="relative flex min-h-[150px] items-center overflow-hidden rounded-2xl bg-gradient-to-r from-sky-200 to-pink-200 p-5 sm:min-h-[170px] lg:min-h-[170px] lg:flex-1 lg:rounded-3xl">
          <div className="relative z-10 max-w-[60%]">
            <p className="text-xs font-semibold uppercase tracking-wider text-pink-800">
              Baby Care
            </p>
            <h2 className="mt-1.5 text-lg font-bold text-pink-900 sm:text-xl lg:text-2xl">
              Gentle Baby Products
            </h2>
            <button
              type="button"
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark sm:text-sm"
            >
              Explore
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop"
            alt="Baby products"
            className="absolute -right-2 bottom-0 h-24 w-24 object-contain sm:h-28 sm:w-28 lg:h-32 lg:w-32"
          />
        </div>
      </div>
    </section>
  )
}
