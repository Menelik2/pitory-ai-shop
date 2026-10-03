import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      className="relative py-24 md:py-32 px-4 text-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(https://cdn.pixabay.com/photo/2020/10/21/18/07/laptop-5673901_960_720.jpg)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      <div className="container mx-auto max-w-3xl relative z-10">
        <div className="space-y-6">
          <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-white/70">
            Premium computing
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
            Pitory Computer
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-xl mx-auto leading-relaxed font-normal">
            Laptops, desktops, and gaming PCs built for performance — curated for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
            <Button
              size="lg"
              className="rounded-full text-[15px] px-8 h-12 font-medium shadow-lg shadow-black/20"
            >
              Call Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="
                rounded-full text-[15px] px-8 h-12 font-medium
                text-white border-white/30
                bg-white/15
                backdrop-blur-xl backdrop-saturate-150
                hover:bg-white/25
              "
              style={{
                WebkitBackdropFilter: "saturate(150%) blur(16px)",
              }}
            >
              091 826 6383
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
