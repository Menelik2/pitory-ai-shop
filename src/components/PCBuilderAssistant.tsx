import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { mockProducts, Product } from "@/data/mockProducts";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { Cpu, HardDrive, MemoryStick, Monitor, Search, Sparkles, ShoppingCart } from "lucide-react";

type UseCase = "all" | "Gaming" | "Work" | "Creative" | "General Use";
type CpuBrand = "any" | "intel" | "amd";

function parseRamGb(ram?: string): number {
  if (!ram) return 0;
  const match = ram.match(/(\d+)\s*GB/i);
  return match ? parseInt(match[1], 10) : 0;
}

export function PCBuilderAssistant() {
  const [search, setSearch] = useState("");
  const [useCase, setUseCase] = useState<UseCase>("all");
  const [cpuBrand, setCpuBrand] = useState<CpuBrand>("any");
  const [minRam, setMinRam] = useState(0);
  const [budget, setBudget] = useState([2000]);
  const { addToCart } = useCart();

  const maxPrice = useMemo(
    () => Math.max(...mockProducts.map((p) => p.price), 2000),
    []
  );

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      if (useCase !== "all" && product.category !== useCase) return false;
      if (product.price > budget[0]) return false;
      if (minRam > 0 && parseRamGb(product.ram) < minRam) return false;

      if (cpuBrand !== "any") {
        const cpu = (product.cpu || "").toLowerCase();
        if (cpuBrand === "intel" && !cpu.includes("intel")) return false;
        if (cpuBrand === "amd" && !cpu.includes("amd") && !cpu.includes("ryzen")) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = [
          product.name,
          product.brand,
          product.category,
          product.cpu,
          product.generation,
          product.ram,
          product.storage,
          product.display,
          product.description,
          product.price.toString(),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [search, useCase, cpuBrand, minRam, budget]);

  const rankedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const score = (p: Product) =>
        parseRamGb(p.ram) * 2 +
        (p.price <= budget[0] * 0.8 ? 10 : 0) +
        (p.category === useCase ? 15 : 0);
      return score(b) - score(a) || a.price - b.price;
    });
  }, [filteredProducts, budget, useCase]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const resetFilters = () => {
    setSearch("");
    setUseCase("all");
    setCpuBrand("any");
    setMinRam(0);
    setBudget([maxPrice]);
  };

  return (
    <section className="py-12 px-4">
      <Card className="mx-auto max-w-5xl bg-white border border-black/5 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-black/5 pb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                PC Builder Assistant
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm mt-0.5">
                Tell us what you need — we&apos;ll recommend the best machines.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="builder-search" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="builder-search"
                  placeholder="CPU, RAM, brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-11 rounded-xl border-black/10 bg-secondary/50 focus-visible:ring-primary/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Use case
              </Label>
              <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
                <SelectTrigger className="h-11 rounded-xl border-black/10 bg-secondary/50">
                  <SelectValue placeholder="What will you use it for?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any use case</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                  <SelectItem value="Work">Work / Office</SelectItem>
                  <SelectItem value="Creative">Creative / Content</SelectItem>
                  <SelectItem value="General Use">General / Everyday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                CPU preference
              </Label>
              <Select value={cpuBrand} onValueChange={(v) => setCpuBrand(v as CpuBrand)}>
                <SelectTrigger className="h-11 rounded-xl border-black/10 bg-secondary/50">
                  <SelectValue placeholder="Intel or AMD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any CPU</SelectItem>
                  <SelectItem value="intel">Intel</SelectItem>
                  <SelectItem value="amd">AMD / Ryzen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Minimum RAM
              </Label>
              <Select value={String(minRam)} onValueChange={(v) => setMinRam(Number(v))}>
                <SelectTrigger className="h-11 rounded-xl border-black/10 bg-secondary/50">
                  <SelectValue placeholder="Any amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="8">8 GB+</SelectItem>
                  <SelectItem value="16">16 GB+</SelectItem>
                  <SelectItem value="32">32 GB+</SelectItem>
                  <SelectItem value="64">64 GB+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 rounded-xl bg-secondary/40 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Max budget
              </Label>
              <span className="text-sm font-semibold text-foreground tabular-nums">
                ${budget[0].toLocaleString()}
              </span>
            </div>
            <Slider
              value={budget}
              onValueChange={setBudget}
              min={400}
              max={Math.ceil(maxPrice / 100) * 100}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$400</span>
              <span>${Math.ceil(maxPrice / 100) * 100}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {rankedProducts.length} recommendation{rankedProducts.length !== 1 ? "s" : ""} found
            </p>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-primary">
              Reset filters
            </Button>
          </div>

          {rankedProducts.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-secondary/30 border border-dashed border-black/10">
              <p className="text-foreground font-medium mb-1">No PCs match your criteria</p>
              <p className="text-sm text-muted-foreground">
                Try raising your budget or loosening the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rankedProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden border border-black/5 bg-white shadow-sm rounded-2xl hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row">
                    <Link
                      to={`/products/${product.id}`}
                      className="sm:w-32 h-28 sm:h-auto shrink-0 relative bg-secondary/50"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground border-0 text-[10px] font-medium px-2">
                          Best match
                        </Badge>
                      )}
                    </Link>
                    <div className="flex-1 p-4 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/products/${product.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[10px] font-medium rounded-md">
                              {product.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">
                              {product.brand}
                            </span>
                          </div>
                        </div>
                        <div className="text-base font-semibold text-foreground whitespace-nowrap tabular-nums">
                          ${product.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {product.cpu && (
                          <span className="flex items-center gap-1.5 truncate">
                            <Cpu className="h-3 w-3 shrink-0 opacity-60" />
                            {product.cpu}
                          </span>
                        )}
                        {product.ram && (
                          <span className="flex items-center gap-1.5 truncate">
                            <MemoryStick className="h-3 w-3 shrink-0 opacity-60" />
                            {product.ram}
                          </span>
                        )}
                        {product.storage && (
                          <span className="flex items-center gap-1.5 truncate">
                            <HardDrive className="h-3 w-3 shrink-0 opacity-60" />
                            {product.storage}
                          </span>
                        )}
                        {product.display && (
                          <span className="flex items-center gap-1.5 truncate">
                            <Monitor className="h-3 w-3 shrink-0 opacity-60" />
                            {product.display}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-2 flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 rounded-xl h-9"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to cart
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl h-9 border-black/10" asChild>
                          <Link to={`/products/${product.id}`}>Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
