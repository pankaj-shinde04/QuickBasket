import HeroSection from '../components/home/HeroSection'
import CategoryRow from '../components/home/CategoryRow'
import FeaturedProducts from '../components/home/FeaturedProducts'
import PromoBanners from '../components/home/PromoBanners'
import BestSellers from '../components/home/BestSellers'
import TrendingProducts from '../components/home/TrendingProducts'

export default function Home() {
  return (
    <div className="page-container section-gap py-6 sm:py-8 lg:py-10">
      <HeroSection />
      <CategoryRow />
      <FeaturedProducts />
      <PromoBanners />
      <BestSellers />
      <TrendingProducts />
    </div>
  )
}
