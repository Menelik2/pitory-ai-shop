import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { mockProducts } from "@/data/mockProducts";
import { toast } from "@/hooks/use-toast";

export function PCBuilderAssistant() {
  const [useCase, setUseCase] = useState("");
  const [budget, setBudget] = useState("");
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter state for search
  const [filters, setFilters] = useState({
    cpu: "",
    ram: "",
    generation: "",
    brand: "",
    price: ""
  });

  // Filtering logic
  const filteredProducts = mockProducts.filter(product => {
    const cpuMatch = filters.cpu ? product.cpu.toLowerCase().includes(filters.cpu.toLowerCase()) : true;
    const ramMatch = filters.ram ? product.ram.toLowerCase().includes(filters.ram.toLowerCase()) : true;
    const genMatch = filters.generation ? product.generation.toLowerCase().includes(filters.generation.toLowerCase()) : true;
    const brandMatch = filters.brand ? product.brand.toLowerCase().includes(filters.brand.toLowerCase()) : true;
    const priceMatch = filters.price ? product.price <= Number(filters.price) : true;
    return cpuMatch && ramMatch && genMatch && brandMatch && priceMatch;
  });

  const getRecommendation = () => {
    if (!useCase || !budget) {
      toast({
        title: "Please complete the form",
        description: "Select both use case and budget to get a recommendation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate AI processing and filter by use case/budget
    setTimeout(() => {
      let filtered = filteredProducts;

      // Filter by use case
      if (useCase === "Gaming") {
        filtered = filtered.filter(p => p.category === "Gaming");
      } else if (useCase === "Work/Productivity") {
        filtered = filtered.filter(p => p.category === "Work");
      } else if (useCase === "General Use (Web, Email, Video)") {
        filtered = filtered.filter(p => p.category === "General Use");
      }

      // Filter by budget
      if (budget === "Under $1000") {
        filtered = filtered.filter(p => p.price < 1000);
      } else if (budget === "$1000 - $1500") {
        filtered = filtered.filter(p => p.price >= 1000 && p.price <= 1500);
      } else if (budget === "Over $1500") {
        filtered = filtered.filter(p => p.price > 1500);
      }

      const recommended = filtered.length > 0 ? filtered[0] : mockProducts[0];

      setRecommendation({
        product: recommended,
        reasoning: `Based on your ${useCase.toLowerCase()} needs and ${budget.toLowerCase()} budget, this computer offers the perfect balance of performance and value.`
      });

      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-card/90 backdrop-blur border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-2">PC Builder Assistant</CardTitle>
            <p className="text-muted-foreground">
              Answer a few questions and we'll recommend the perfect PC for you.
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Search/Filter UI */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              <input
                type="text"
                placeholder="CPU"
                value={filters.cpu}
                onChange={e => setFilters({ ...filters, cpu: e.target.value })}
                className="border rounded px-2 py-1 w-32"
              />
              <input
                type="text"
                placeholder="RAM"
                value={filters.ram}
                onChange={e => setFilters({ ...filters, ram: e.target.value })}
                className="border rounded px-2 py-1 w-32"
              />
              <input
                type="text"
                placeholder="Generation"
                value={filters.generation}
                onChange={e => setFilters({ ...filters, generation: e.target.value })}
                className="border rounded px-2 py-1 w-32"
              />
              <input
                type="text"
                placeholder="Brand"
                value={filters.brand}
                onChange={e => setFilters({ ...filters, brand: e.target.value })}
                className="border rounded px-2 py-1 w-32"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.price}
                onChange={e => setFilters({ ...filters, price: e.target.value })}
                className="border rounded px-2 py-1 w-32"
              />
            </div>

            {/* Show filtered products */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Filtered Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full text-center text-muted-foreground">No products match your filter.</div>
                ) : (
                  filteredProducts.map(product => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow bg-card/80 backdrop-blur border-border/50 cursor-pointer">
                      <CardHeader className="p-0">
                        <div className="aspect-video relative overflow-hidden rounded-md">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded-md"
                          />
                          <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">{product.category}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-base text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-700">{product.description}</p>
                          <div className="text-sm text-gray-600">CPU: {product.cpu}</div>
                          <div className="text-sm text-gray-600">RAM: {product.ram}</div>
                          <div className="text-sm text-gray-600">Gen: {product.generation}</div>
                          <div className="text-sm text-gray-600">Brand: {product.brand}</div>
                          <div className="text-xl font-bold text-primary pt-2">${product.price.toLocaleString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Recommendation logic same as before */}
            <div>
              <h3 className="text-lg font-semibold mb-4">What will you be using this computer for?</h3>
              <RadioGroup value={useCase} onValueChange={setUseCase}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Gaming" id="gaming" />
                  <Label htmlFor="gaming">Gaming</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Work/Productivity" id="work" />
                  <Label htmlFor="work">Work/Productivity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="General Use (Web, Email, Video)" id="general" />
                  <Label htmlFor="general">General Use (Web, Email, Video)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">What is your budget?</h3>
              <RadioGroup value={budget} onValueChange={setBudget}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Under $1000" id="under1000" />
                  <Label htmlFor="under1000">Under $1000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="$1000 - $1500" id="mid" />
                  <Label htmlFor="mid">$1000 - $1500</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Over $1500" id="over1500" />
                  <Label htmlFor="over1500">Over $1500</Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              onClick={getRecommendation}
              className="w-full text-lg py-6"
              disabled={isLoading}
            >
              {isLoading ? "Finding your perfect PC..." : "Get Recommendation"}
            </Button>

            {recommendation && (
              <Card className="mt-8 bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Recommended for You</h3>
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={recommendation.product.image}
                      alt={recommendation.product.name}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{recommendation.product.name}</h4>
                      <p className="text-muted-foreground mb-4">{recommendation.reasoning}</p>
                      <div className="text-2xl font-bold text-primary mb-4">
                        ${recommendation.product.price.toLocaleString()}
                      </div>
                      <Button>View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
