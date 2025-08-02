import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProducts } from "@/data/mockProducts";
export function PCBuilderAssistant() {
  const [search, setSearch] = useState("");

  // Filter logic: search against multiple fields (case-insensitive, partial match)
  const filteredProducts = search ? mockProducts.filter(product => {
    const searchLower = search.toLowerCase();
    return product.cpu.toLowerCase().includes(searchLower) || product.ram.toLowerCase().includes(searchLower) || product.generation.toLowerCase().includes(searchLower) || product.brand.toLowerCase().includes(searchLower) || product.price.toString().includes(searchLower);
  }) : [];

  return (
    <Card className="mx-auto max-w-4xl mb-8">
      <CardHeader>
        <CardTitle>PC Builder Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <p>PC Builder functionality coming soon...</p>
      </CardContent>
    </Card>
  );
}