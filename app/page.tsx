import { Hero } from "@/components/hero";
import { PublicLayout } from "@/layouts/public-layout";

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      {/* <main className="flex-1 flex flex-col gap-6 px-4"></main> */}
    </PublicLayout>
  );
}
