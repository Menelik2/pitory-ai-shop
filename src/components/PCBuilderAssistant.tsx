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
    <section className="py-16 px-4 bg-[#f5f5f7]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-2">
            PC Builder Assistant
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Answer a few questions and we&apos;ll match you with the right machine.
          </p>
        </div>

        <Card className="bg-white border border-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_40px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <Label htmlFor="builder-search" className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="builder-search"
                    placeholder="CPU, RAM, brand..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-black/[0.06] bg-[#f5f5f7] focus-visible:ring-primary/20 focus-visible:border-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Use case
                </Label>
                <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
                  <SelectTrigger className="h-12 rounded-xl border-black/[0.06] bg-[#f5f5f7]">
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
                <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  CPU preference
                </Label>
                <Select value={cpuBrand} onValueChange={(v) => setCpuBrand(v as CpuBrand)}>
                  <SelectTrigger className="h-12 rounded-xl border-black/[0.06] bg-[#f5f5f7]">
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
                <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Minimum RAM
                </Label>
                <Select value={String(minRam)} onValueChange={(v) => setMinRam(Number(v))}>
                  <SelectTrigger className="h-12 rounded-xl border-black/[0.06] bg-[#f5f5f7]">
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

            <div className="space-y-3 rounded-2xl bg-[#f5f5f7] p-5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Max budget
                </Label>
                <span className="text-base font-semibold text-foreground tabular-nums">
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
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>$400</span>
                <span>${Math.ceil(maxPrice / 100) * 100}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{rankedProducts.length}</span>
                {" "}recommendation{rankedProducts.length !== 1 ? "s" : ""}
              </p>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-primary font-medium rounded-full">
                Reset filters
              </Button>
            </div>

            {rankedProducts.length === 0 ? (
              <div className="text-center py-14 rounded-2xl bg-[#f5f5f7]">
                <p className="text-foreground font-medium mb-1">No matches found</p>
                <p className="text-sm text-muted-foreground">
                  Try raising your budget or adjusting filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rankedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="
                      flex flex-col sm:flex-row overflow-hidden
                      rounded-2xl border border-black/[0.04] bg-white
                      shadow-[0_1px_2px_rgba(0,0,0,0.02)]
                      transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]
                    "
                  >
                    <Link
                      to={`/products/${product.id}`}
                      className="sm:w-36 h-32 sm:h-auto shrink-0 relative bg-[#f5f5f7]"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <Badge className="absolute top-2.5 left-2.5 bg-primary text-primary-foreground border-0 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                          Best match
                        </Badge>
                      )}
                    </Link>
                    <div className="flex-1 p-4 flex flex-col gap-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/products/${product.id}`}
                            className="font-semibold text-[15px] text-foreground hover:text-primary transition-colors line-clamp-1 tracking-tight"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                              {product.category}
                            </span>
                            <span className="text-muted-foreground/40">·</span>
                            <span className="text-[11px] text-muted-foreground truncate">
                              {product.brand}
                            </span>
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-foreground whitespace-nowrap tabular-nums tracking-tight">
                          ${product.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px] text-muted-foreground">
                        {product.cpu && (
                          <span className="flex items-center gap-1.5 truncate">
                            <Cpu className="h-3 w-3 shrink-0 opacity-50" />
                            {product.cpu}
                          </span>
                        )}
                        {product.ram && (
                          <span className="flex items-center gap-1.5 truncate">
                            <MemoryStick className="h-3 w-3 shrink-0 opacity-50" />
                            {product.ram}
                          </span>
                        )}
                        {product.storage && (
                          <span className="flex items-center gap-1.5 truncate">
                            <HardDrive className="h-3 w-3 shrink-0 opacity-50" />
                            {product.storage}
                          </span>
                        )}
                        {product.display && (
                          <span className="flex items-center gap-1.5 truncate">
                            <Monitor className="h-3 w-3 shrink-0 opacity-50" />
                            {product.display}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-1 flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 rounded-full h-9 text-xs font-medium"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Add to cart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full h-9 text-xs border-black/[0.08]"
                          asChild
                        >
                          <Link to={`/products/${product.id}`}>Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
