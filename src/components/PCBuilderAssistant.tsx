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
  return;
}