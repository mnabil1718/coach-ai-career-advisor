import { Button } from "../ui/button";

export function CTA() {
  return (
    <section className="pb-32">
      <div className="relative mx-auto max-w-5xl bg-primary text-background p-20 rounded-xl flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute z-10 inset-0 bg-primary/30 backdrop-blur-[100px]"></div>
        <CTAShimmerBG />
        <div className="z-20 flex flex-col items-center">
          <h2 className="text-2xl lg:text-4xl font-bold !leading-tight mb-3">
            Ready to Improve your CV in 10 minutes?
          </h2>
          <p className="text-muted-background mb-9">
            Join thousands of job seekers who&apos;ve improved their CVs and
            aced their interviews with Coach.ai.
          </p>

          <Button className="bg-background/80 hover:bg-background text-foreground p-7 font-bold transition-opacity duration-300 w-fit">
            Upload your CV Now
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CTAShimmerBG() {
  return (
    <div>
      {/* BLOB 1 */}
      <div className="absolute -bottom-[60%] left-0 animate-shimmer [animation-duration:26s] w-80 h-80 bg-background rounded-full" />

      {/* BLOB 2 */}
      <div className="absolute -bottom-[100%] left-[10%] animate-shimmer [animation-duration:50s] w-96 h-96 bg-background rounded-full" />

      {/* BLOB 3 */}
      <div className="absolute -bottom-[80%] right-[10%] animate-shimmer [animation-duration:70s] w-72 h-72 bg-background rounded-full" />

      {/* BLOB 4 */}
      <div className="absolute -bottom-[100%] left-[20%] animate-shimmer [animation-duration:100s] w-[400px] h-80 bg-background rounded-full" />

      {/* BLOB 5 */}
      <div className="absolute -bottom-[140%] left-[20%] animate-shimmer [animation-duration:40s] w-[1000px] h-[600px] bg-background rounded-full" />
    </div>
  );
}
