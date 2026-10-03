import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "order" | "product";
  title: string;
  subtitle: string;
  at: string;
  status?: string | null;
}

export function RecentActivity() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: orders }, { data: products }] = await Promise.all([
          supabase
            .from("orders")
            .select("id, created_at, status, total_amount, shipping_address")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("products")
            .select("id, name, created_at, stock_quantity")
            .order("created_at", { ascending: false })
            .limit(3),
        ]);

        const activity: ActivityItem[] = [];

        (orders || []).forEach((o: any) => {
          const name = o.shipping_address?.customer_name || "Customer";
          activity.push({
            id: o.id,
            type: "order",
            title: `Order from ${name}`,
            subtitle: `$${Number(o.total_amount).toLocaleString()} · ${o.status || "pending"}`,
            at: o.created_at,
            status: o.status,
          });
        });

        (products || []).forEach((p: any) => {
          activity.push({
            id: p.id,
            type: "product",
            title: p.name,
            subtitle: `Stock: ${p.stock_quantity ?? 0}`,
            at: p.created_at,
          });
        });

        activity.sort((a, b) => +new Date(b.at) - +new Date(a.at));
        setItems(activity.slice(0, 8));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Card className="border-black/[0.04] mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center gap-3 py-2 border-b border-black/[0.04] last:border-0"
            >
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                {item.type === "order" ? (
                  <ShoppingBag className="h-3.5 w-3.5" />
                ) : (
                  <Package className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{item.title}</div>
                <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
              </div>
              <div className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                {new Date(item.at).toLocaleDateString()}
              </div>
              {item.status && (
                <Badge variant="outline" className="text-[10px] capitalize shrink-0">
                  {item.status}
                </Badge>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
