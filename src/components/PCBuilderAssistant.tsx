import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProducts } from "@/data/mockProducts";

export function PCBuilderAssistant() {
  const [search, setSearch] = useState("");

  // Filter logic: search against multiple fields (case-insensitive, partial match)
  const filteredProducts = search
    ? mockProducts.filter(product => {
        const searchLower = search.toLowerCase();
        return (
          product.cpu.toLowerCase().includes(searchLower) ||
          product.ram.toLowerCase().includes(searchLower) ||
          product.generation.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.price.toString().includes(searchLower)
        );
      })
    : [];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-card/90 backdrop-blur border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-2">
              Search Products
            </CardTitle>
            <p className="text-muted-foreground">
              Type to search by CPU, RAM, Generation, Brand, or Price.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded px-4 py-2 w-full max-w-lg"
              />
            </div>
            {search && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Filtered Products
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground">
                      No products match your search.
                    </div>
                  ) : (
                    filteredProducts.map(product => (
                      <Card
                        key={product.id}
                        className="hover:shadow-lg transition-shadow bg-card/80 backdrop-blur border-border/50 cursor-pointer"
                      >
                        <CardHeader className="p-0">
                          <div className="aspect-video relative overflow-hidden rounded-md">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-40 object-cover rounded-md"
                            />
                            <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="p-2">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-base text-gray-900">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-700">
                              {product.description}
                            </p>
                            <div className="text-sm text-gray-600">
                              CPU: {product.cpu}
                            </div>
                            <div className="text-sm text-gray-600">
                              RAM: {product.ram}
                            </div>
                            <div className="text-sm text-gray-600">
                              Gen: {product.generation}
                            </div>
                            <div className="text-sm text-gray-600">
                              Brand: {product.brand}
                            </div>
                            <div className="text-xl font-bold text-primary pt-2">
                              ${product.price.toLocaleString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
