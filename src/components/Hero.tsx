import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative py-20 px-4 text-center">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Pitory Computer
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Your ultimate destination for high-performance computers. From gaming rigs to workstations, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button size="lg" className="text-lg px-8 py-6">
              Shop Now
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20">
              Gaming Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}