import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, User, Package, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShippingAddress {
  customer_name?: string;
  location?: string;
  phone?: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  product_id: string | null;
  products?: { name: string } | null;
}

interface Order {
  id: string;
  created_at: string;
  status: string | null;
  total_amount: number;
  shipping_address: ShippingAddress | null;
  order_items?: OrderItem[];
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          created_at,
          status,
          total_amount,
          shipping_address,
          order_items (
            id,
            quantity,
            unit_price,
            product_id,
            products ( name )
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data as unknown as Order[]) || []);
    } catch (err: any) {
      console.error("Error loading orders:", err);
      toast({
        title: "Could not load orders",
        description: err?.message || "Check Supabase RLS policies for orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) throw error;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast({ title: "Status updated", description: `Order marked as ${status}.` });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.message || "Could not update order status.",
        variant: "destructive",
      });
    }
  };

  const statusColor = (status: string | null) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Customer Orders</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Orders placed from checkout with name, location, and phone.
          </p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full" onClick={fetchOrders}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading orders...</p>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No orders yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const addr = (order.shipping_address || {}) as ShippingAddress;
            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={`border ${statusColor(order.status)}`} variant="outline">
                    {order.status || "pending"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          Name
                        </div>
                        <div className="font-medium">{addr.customer_name || "—"}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          Location
                        </div>
                        <div className="font-medium">{addr.location || "—"}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          Phone
                        </div>
                        {addr.phone ? (
                          <a
                            href={`tel:${addr.phone}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {addr.phone}
                          </a>
                        ) : (
                          <div className="font-medium">—</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="rounded-xl bg-muted/30 p-3 space-y-1.5">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm gap-2"
                        >
                          <span className="text-muted-foreground truncate">
                            {item.products?.name || "Product"} × {item.quantity}
                          </span>
                          <span className="tabular-nums font-medium shrink-0">
                            ${(item.unit_price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t border-black/[0.06]">
                        <span>Total</span>
                        <span className="tabular-nums">
                          ${Number(order.total_amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        className="rounded-full"
                        onClick={() => updateStatus(order.id, "confirmed")}
                      >
                        Confirm
                      </Button>
                    )}
                    {(order.status === "pending" || order.status === "confirmed") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => updateStatus(order.id, "completed")}
                      >
                        Complete
                      </Button>
                    )}
                    {order.status !== "cancelled" && order.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-destructive"
                        onClick={() => updateStatus(order.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
