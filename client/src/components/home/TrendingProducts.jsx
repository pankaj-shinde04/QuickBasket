import ProductCard from '../ProductCard'
import SectionHeading from '../SectionHeading'
import { trendingProducts } from '../../data/mockData'

export default function TrendingProducts() {
  return (
    <section>
      <SectionHeading title="Trending Products" />
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {trendingProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
