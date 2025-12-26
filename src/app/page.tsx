import HeroBannerSlideshow from '@/components/layout/HeroBannerSlideshow'
import FeaturedProducts from '@/components/product/FeaturedProducts'
import BrandStatement from '@/components/layout/BrandStatement'
import FlashSale from '@/components/layout/FlashSale'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <br /><br /><br /><br />
      <HeroBannerSlideshow />

      {/* Brand Statement - Minimalist */}
      <BrandStatement />

      {/* Featured Products - Shopping Core */}
      <FeaturedProducts />

      {/* Flash Sale - Limited Drops */}
      <FlashSale />
    </div>
  )
}
