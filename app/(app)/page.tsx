import HeroSection from '../../components/HeroSection';
import VehicleSelector from '../../components/VehicleSelector';
import FeaturedCategories from '../../components/FeaturedCategories';
import FeaturedProducts from '../../components/FeaturedProducts';
import BrandStrip from '../../components/BrandStrip';
import AdvantagesStrip from '../../components/AdvantagesStrip';
import BlogSection from '../../components/BlogSection';
import TestimonialsSection from '../../components/TestimonialsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <VehicleSelector />
        <FeaturedCategories />
        <FeaturedProducts />
        <BrandStrip />
        <AdvantagesStrip />
        <BlogSection />
        <TestimonialsSection />
      </main>
    </div>
  );
}
