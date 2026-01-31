import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Works } from "@/components/landing/works";
import { PublicLayout } from "@/layouts/public-layout";

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <Features />
      <Works />
      <CTA />
    </PublicLayout>
  );
}
