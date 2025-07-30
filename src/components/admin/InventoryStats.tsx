import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Archive } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function InventoryStats() {
  const [stats, setStats] = useState({
    totalValue: 0,
    totalItems: 0,
    uniqueProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventoryStats();
  }, []);

  const fetchInventoryStats = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('price, stock_quantity');

      if (error) throw error;

      if (products) {
        const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock_quantity), 0);
        const totalItems = products.reduce((sum, product) => sum + product.stock_quantity, 0);
        const uniqueProducts = products.length;

        setStats({
          totalValue,
          totalItems,
          uniqueProducts,
        });
      }
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Inventory Value",
      value: loading ? "Loading..." : `$${stats.totalValue.toLocaleString()}`,
      subtitle: "Based on current stock and prices",
      icon: DollarSign,
    },
    {
      title: "Total Items", 
      value: loading ? "Loading..." : stats.totalItems.toString(),
      subtitle: "Sum of all items in stock",
      icon: Package,
    },
    {
      title: "Unique Products",
      value: loading ? "Loading..." : stats.uniqueProducts.toString(), 
      subtitle: "Number of distinct product listings",
      icon: Archive,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat, index) => {
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