import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <div className="relative flex-1 w-full flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </div>
    </main>
  );
}
