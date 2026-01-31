import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Pill } from "./pill";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center py-64 bg-background overflow-hidden">
      <div className="absolute z-10 inset-0 bg-background/70 backdrop-blur-[100px]"></div>
      <GradientBackground />
      <HeroContent />
    </section>
  );
}

export function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center px-4">
      <Pill />

      <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-center mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
        Coach.ai
      </h1>

      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent mb-6" />

      <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl text-center mb-10 leading-relaxed">
        Your personal AI career coach, guiding you through every promotion and
        pivot.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button
          size="lg"
          className="relative h-14 px-8 text-base font-semibold rounded-full group overflow-hidden bg-primary text-primary-foreground transition-all duration-300"
        >
          {/* The "Hover" Gradient Layer */}
          <span className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* The Content */}
          <span className="relative z-10 flex items-center">
            Start free session
            <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-14 px-8 text-base rounded-full backdrop-blur-sm"
        >
          See how it works
        </Button>
      </div>
    </div>
  );
}

export function GradientBackground() {
  return (
    <div className="absolute inset-0 -z-0">
      {/* Blob 1 */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] 
                     bg-primary rounded-full blur-3xl
                     animate-float"
      />

      {/* Blob 2 */}
      <div
        className="absolute top-[5%] right-[-5%] w-[600px] h-[600px] 
                     bg-primary rounded-full blur-3xl
                     animate-float-reverse"
      />

      {/* Blob 3 */}
      <div
        className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] 
                     bg-primary rounded-full blur-3xl 
                     animate-float [animation-duration:30s]"
      />
    </div>
  );
}
