import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProducts } from "@/data/mockProducts";
import { DollarSign, Package, Archive } from "lucide-react";

export function InventoryStats() {
  const totalValue = mockProducts.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const totalItems = mockProducts.reduce((sum, product) => sum + product.stock, 0);
  const uniqueProducts = mockProducts.length;

  const stats = [
    {
      title: "Total Inventory Value",
      value: `$${totalValue.toLocaleString()}`,
      subtitle: "Based on current stock and prices",
      icon: DollarSign,
    },
    {
      title: "Total Items", 
      value: totalItems.toString(),
      subtitle: "Sum of all items in stock",
      icon: Package,
    },
    {
      title: "Unique Products",
      value: uniqueProducts.toString(), 
      subtitle: "Number of distinct product listings",
      icon: Archive,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-card/80 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}