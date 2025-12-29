"use client";

import HeroSection from "@/components/sections/hero";
import VisionIntro from "@/components/sections/vision-intro";
import FeaturesSection from "@/components/sections/features";
import PipelineSection from "@/components/sections/pipeline";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
      <HeroSection />
      <VisionIntro />
      <FeaturesSection />
      <PipelineSection />
      <Footer />
    </main>
  );
}
