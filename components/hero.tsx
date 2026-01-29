export function Hero() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl lg:text-4xl font-semibold !leading-tight mx-auto max-w-xl text-center mb-5">
        Coach.ai
      </h1>
      <p className="text-2xl !leading-tight mx-auto max-w-xl text-center">
        Personal AI Career Coach in Your Pocket
      </p>

      {/* COOL DIVIDER */}
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
