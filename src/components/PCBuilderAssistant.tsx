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
  const [budget, setBudget] = useState([2000]); // max budget
  const { addToCart } = useCart();

  const maxPrice = useMemo(
    () => Math.max(...mockProducts.map((p) => p.price), 2000),
    []
  );

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      // Use case / category
      if (useCase !== "all" && product.category !== useCase) return false;

      // Budget
      if (product.price > budget[0]) return false;

      // Min RAM
      if (minRam > 0 && parseRamGb(product.ram) < minRam) return false;

      // CPU brand
      if (cpuBrand !== "any") {
        const cpu = (product.cpu || "").toLowerCase();
        if (cpuBrand === "intel" && !cpu.includes("intel")) return false;
        if (cpuBrand === "amd" && !cpu.includes("amd") && !cpu.includes("ryzen")) return false;
      }

      // Free-text search across key fields
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

  // Rank: prefer higher specs within budget (simple score)
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
    <section className="py-12 px-4 bg-muted/30">
      <Card className="mx-auto max-w-5xl border-purple-800/40 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-900 via-purple-900 to-fuchsia-900 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <CardTitle className="text-2xl font-bold tracking-tight">
              PC Builder Assistant
            </CardTitle>
          </div>
          <CardDescription className="text-purple-100/90">
            Tell us what you need — we&apos;ll recommend the best machines from our catalog.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="builder-search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="builder-search"
                  placeholder="CPU, RAM, brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Use case</Label>
              <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
                <SelectTrigger>
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
              <Label>CPU preference</Label>
              <Select value={cpuBrand} onValueChange={(v) => setCpuBrand(v as CpuBrand)}>
                <SelectTrigger>
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
              <Label>Minimum RAM</Label>
              <Select
                value={String(minRam)}
                onValueChange={(v) => setMinRam(Number(v))}
              >
                <SelectTrigger>
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

          {/* Budget slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Max budget</Label>
              <span className="text-sm font-semibold text-primary">
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
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>

          {/* Results */}
          {rankedProducts.length === 0 ? (
            <div className="text-center py-10 rounded-lg border border-dashed">
              <p className="text-muted-foreground mb-2">
                No PCs match your criteria.
              </p>
              <p className="text-sm text-muted-foreground">
                Try raising your budget or loosening the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rankedProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden border-purple-800/30 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row">
                    <Link
                      to={`/products/${product.id}`}
                      className="sm:w-36 h-28 sm:h-auto shrink-0 relative"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-black border-0">
                          Best match
                        </Badge>
                      )}
                    </Link>
                    <div className="flex-1 p-4 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/products/${product.id}`}
                            className="font-semibold hover:underline line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {product.brand}
                            </span>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-primary whitespace-nowrap">
                          ${product.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {product.cpu && (
                          <span className="flex items-center gap-1 truncate">
                            <Cpu className="h-3 w-3 shrink-0" />
                            {product.cpu}
                          </span>
                        )}
                        {product.ram && (
                          <span className="flex items-center gap-1 truncate">
                            <MemoryStick className="h-3 w-3 shrink-0" />
                            {product.ram}
                          </span>
                        )}
                        {product.storage && (
                          <span className="flex items-center gap-1 truncate">
                            <HardDrive className="h-3 w-3 shrink-0" />
                            {product.storage}
                          </span>
                        )}
                        {product.display && (
                          <span className="flex items-center gap-1 truncate">
                            <Monitor className="h-3 w-3 shrink-0" />
                            {product.display}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-2 flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to cart
                        </Button>
                        <Button size="sm" variant="outline" asChild>
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
