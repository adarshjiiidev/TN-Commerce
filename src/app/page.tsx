import HeroBannerSlideshow from '@/components/layout/HeroBannerSlideshow'
import FeaturedProducts from '@/components/product/FeaturedProducts'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d12] ">
      {/* Hero Banner */}
      <HeroBannerSlideshow />

      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  )
}
