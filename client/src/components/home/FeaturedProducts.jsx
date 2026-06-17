import ProductCard from '../ProductCard'
import SectionHeading from '../SectionHeading'
import { featuredProducts } from '../../data/mockData'

export default function FeaturedProducts() {
  return (
    <section>
      <SectionHeading title="Featured Products" />
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
