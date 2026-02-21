import { HeroSection } from "@/components/home/HeroSection";
import { NarrativeSection } from "@/components/home/NarrativeSection";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { CollectionSection } from "@/components/home/CollectionSection";
import { Footer } from "@/components/layout/Footer";
import { PrivateTeaserArtifacts } from "@/components/shared/PrivateTeaserArtifacts";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NarrativeSection />
      <FeaturedCarousel />
      <CollectionSection />
      <Footer />
    </>
  );
}
