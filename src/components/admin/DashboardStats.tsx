import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  Archive,
  ShoppingBag,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalValue: 0,
    totalItems: 0,
    uniqueProducts: 0,
    lowStock: 0,
    pendingOrders: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [{ data: products }, { data: orders }] = await Promise.all([
        supabase.from("products").select("price, stock_quantity"),
        supabase.from("orders").select("total_amount, status"),
      ]);

      const list = products || [];
      const orderList = orders || [];

      const totalValue = list.reduce(
        (sum, p) => sum + (p.price || 0) * (p.stock_quantity || 0),
        0
      );
      const totalItems = list.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
      const lowStock = list.filter((p) => (p.stock_quantity || 0) > 0 && (p.stock_quantity || 0) <= 3).length;
      const pendingOrders = orderList.filter(
        (o) => o.status === "pending" || !o.status
      ).length;
      const revenue = orderList
        .filter((o) => o.status === "completed" || o.status === "confirmed")
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      setStats({
        totalValue,
        totalItems,
        uniqueProducts: list.length,
        lowStock,
        pendingOrders,
        totalOrders: orderList.length,
        revenue,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Inventory Value",
      value: loading ? "…" : `$${stats.totalValue.toLocaleString()}`,
      subtitle: "Stock × price",
      icon: DollarSign,
    },
    {
      title: "Units in Stock",
      value: loading ? "…" : stats.totalItems.toString(),
      subtitle: "All products",
      icon: Package,
    },
    {
      title: "Products",
      value: loading ? "…" : stats.uniqueProducts.toString(),
      subtitle: "Listings",
      icon: Archive,
    },
    {
      title: "Low Stock",
      value: loading ? "…" : stats.lowStock.toString(),
      subtitle: "3 or fewer left",
      icon: AlertTriangle,
      warn: stats.lowStock > 0,
    },
    {
      title: "Pending Orders",
      value: loading ? "…" : stats.pendingOrders.toString(),
      subtitle: "Need attention",
      icon: Clock,
      warn: stats.pendingOrders > 0,
    },
    {
      title: "Total Orders",
      value: loading ? "…" : stats.totalOrders.toString(),
      subtitle: "All time",
      icon: ShoppingBag,
    },
    {
      title: "Revenue",
      value: loading ? "…" : `$${stats.revenue.toLocaleString()}`,
      subtitle: "Confirmed + completed",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-8">
      {cards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className={`border-black/[0.04] ${stat.warn ? "border-amber-300/80 bg-amber-50/50" : ""}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
              <CardTitle className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                {stat.title}
              </CardTitle>
              <Icon className={`h-3.5 w-3.5 ${stat.warn ? "text-amber-600" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl font-semibold tracking-tight tabular-nums">{stat.value}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
