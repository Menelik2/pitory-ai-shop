import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mockProducts } from "@/data/mockProducts";

const PCBuilderAssistant = () => {
  const [useCase, setUseCase] = useState("");
  const [budget, setBudget] = useState("");
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for filters
  const [filters, setFilters] = useState({
    cpu: "",
    ram: "",
    generation: "",
    brand: "",
    price: ""
  });

  // State to toggle filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Filtering logic
  const filteredProducts = mockProducts.filter(product => {
    const cpuMatch = filters.cpu ? product.cpu.toLowerCase().includes(filters.cpu.toLowerCase()) : true;
    const ramMatch = filters.ram ? product.ram.toLowerCase().includes(filters.ram.toLowerCase()) : true;
    const genMatch = filters.generation ? product.generation.toLowerCase().includes(filters.generation.toLowerCase()) : true;
    const brandMatch = filters.brand ? product.brand.toLowerCase().includes(filters.brand.toLowerCase()) : true;
    const priceMatch = filters.price ? product.price <= Number(filters.price) : true;
    return cpuMatch && ramMatch && genMatch && brandMatch && priceMatch;
  });

  return (
    <Card className="mb-8">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold mb-2">PC Builder Assistant</CardTitle>
        <p className="text-muted-foreground">
          Answer a few questions and we'll recommend the perfect PC for you.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Toggle Filters Button */}
        <div className="flex justify-center mb-4">
          <button
            className="px-4 py-2 rounded bg-primary text-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Conditionally render filters */}
        {showFilters && (
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
        )}

        {/* Show filtered products */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Filtered Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground">
                No products match your filter.
              </div>
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
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary">${product.price}</span>
                        <span className="text-xs text-muted-foreground">{product.brand}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PCBuilderAssistant;
