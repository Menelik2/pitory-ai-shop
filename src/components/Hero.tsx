import { Button } from "@/components/ui/button";
// Remove the local import for heroBackground

export function Hero() {
  return <section className="relative py-20 px-4 text-center bg-cover bg-center bg-no-repeat" style={{
    backgroundImage: `url(https://cdn.pixabay.com/photo/2020/10/21/18/07/laptop-5673901_960_720.jpg)`
  }}>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Pitory Computer
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Discover cutting-edge laptops, powerful desktops, and gaming PCs built for performance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button size="lg" className="text-lg px-8 py-6">Call Now →</Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20">0918266383</Button>
          </div>
        </div>
      </div>
    </section>;
}