import { HiArrowRight } from 'react-icons/hi2'

const products = [
  {
    src: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=200&h=260&fit=crop',
    alt: 'Chocolate bar',
    className: 'right-[38%] top-[18%] z-20 w-24 rotate-[-8deg] sm:w-28 lg:w-32',
  },
  {
    src: 'https://images.unsplash.com/photo-1558961363-fa8ccf64d398?w=200&h=260&fit=crop',
    alt: 'Pretzel snacks',
    className: 'right-[22%] top-[8%] z-30 w-24 rotate-[6deg] sm:w-28 lg:w-32',
  },
  {
    src: 'https://images.unsplash.com/photo-1599490659213-eb5a96beb39f?w=200&h=260&fit=crop',
    alt: 'Snack mix',
    className: 'right-[8%] top-[22%] z-10 w-24 rotate-[-4deg] sm:w-28 lg:w-32',
  },
  {
    src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=260&fit=crop',
    alt: 'Bakery box',
    className: 'right-[2%] bottom-[8%] z-40 w-28 rotate-[3deg] sm:w-32 lg:w-36',
  },
  {
    src: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=260&fit=crop',
    alt: 'Snack bag',
    className: 'right-[28%] bottom-[4%] z-25 w-24 rotate-[-12deg] sm:w-28 lg:w-32',
  },
]

export default function PromoCTA() {
  return (
    <section className="page-container pb-6 sm:pb-8 lg:pb-10">
      <div className="relative overflow-hidden rounded-2xl bg-[#f3b5e5] lg:rounded-3xl">
        <div className="flex flex-col lg:min-h-[260px] lg:flex-row lg:items-center">
          {/* Left content */}
          <div className="flex flex-col items-start justify-center gap-3 p-6 sm:p-8 sm:gap-4 lg:flex-1 lg:p-10">
            <span className="rounded-full bg-[#f5e6c8] px-3 py-1 text-xs font-semibold text-text-dark sm:text-sm">
              Only This Week
            </span>
            <h2 className="max-w-md text-2xl font-bold leading-tight text-[#1a1a2e] sm:text-3xl lg:text-4xl">
              Provides you the quality that&apos;s you expected
            </h2>
            <p className="text-sm text-[#6b6280] sm:text-base">
              A different kind of grocery store
            </p>
            <button
              type="button"
              className="mt-1 flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-text-dark shadow-sm transition-all hover:shadow-md sm:px-8 sm:py-3 sm:text-base"
            >
              Shop Now
              <HiArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Right product collage */}
          <div className="relative h-48 w-full sm:h-52 lg:h-auto lg:min-h-[260px] lg:w-[45%]">
            <div className="absolute inset-0">
              {products.map((product) => (
                <img
                  key={product.alt}
                  src={product.src}
                  alt={product.alt}
                  className={`absolute rounded-xl object-cover shadow-md ${product.className}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
