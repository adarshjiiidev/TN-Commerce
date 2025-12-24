import HeroBannerSlideshow from '@/components/layout/HeroBannerSlideshow'
import FeaturedProducts from '@/components/product/FeaturedProducts'
import BrandStatement from '@/components/layout/BrandStatement'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroBannerSlideshow />

      {/* Brand Statement - Minimalist */}
      <BrandStatement />

      {/* Featured Products - Shopping Core */}
      <FeaturedProducts />
    </div>
  )
}
