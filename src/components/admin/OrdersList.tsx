import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  MapPin,
  User,
  Package,
  RefreshCw,
  Search,
  Trash2,
  MessageCircle,
  Download,
  Copy,
  Printer,
  CheckCheck,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { copyText, downloadCsv } from "@/lib/adminUtils";
import { deleteOrderFromDatabase } from "@/lib/deleteOrder";

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

const STATUS_FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [newCount, setNewCount] = useState(0);
  const knownIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
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
      const list = (data as unknown as Order[]) || [];

      if (!firstLoad.current) {
        const fresh = list.filter((o) => !knownIds.current.has(o.id));
        if (fresh.length > 0) {
          setNewCount((c) => c + fresh.length);
          toast({
            title: `${fresh.length} new order${fresh.length > 1 ? "s" : ""}`,
            description: "Refresh the list or check Pending.",
          });
        }
      }
      firstLoad.current = false;
      knownIds.current = new Set(list.map((o) => o.id));
      setOrders(list);
    } catch (err: any) {
      console.error("Error loading orders:", err);
      if (!silent) {
        toast({
          title: "Could not load orders",
          description: err?.message || "Check Supabase RLS policies for orders.",
          variant: "destructive",
        });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const t = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(t);
  }, [fetchOrders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const status = o.status || "pending";
      if (statusFilter !== "all" && status !== statusFilter) return false;

      const d = new Date(o.created_at);
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (d < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }

      if (!q) return true;
      const addr = (o.shipping_address || {}) as ShippingAddress;
      return (
        addr.customer_name?.toLowerCase().includes(q) ||
        addr.location?.toLowerCase().includes(q) ||
        addr.phone?.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    });
  }, [orders, search, statusFilter, dateFrom, dateTo]);

  const deductStock = async (order: Order) => {
    const items = order.order_items || [];
    for (const item of items) {
      if (!item.product_id) continue;
      const { data: prod } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .maybeSingle();
      if (!prod) continue;
      const next = Math.max(0, (prod.stock_quantity || 0) - item.quantity);
      await supabase
        .from("products")
        .update({ stock_quantity: next })
        .eq("id", item.product_id);
    }
  };

  const updateStatus = async (orderId: string, status: string, order?: Order) => {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) throw error;

      if (status === "confirmed" && order && (order.status === "pending" || !order.status)) {
        await deductStock(order);
      }

      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast({
        title: "Status updated",
        description:
          status === "confirmed"
            ? "Order confirmed and stock reduced."
            : `Order marked as ${status}.`,
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.message || "Could not update order status.",
        variant: "destructive",
      });
    }
  };

  const bulkConfirmPending = async () => {
    const pending = filtered.filter((o) => o.status === "pending" || !o.status);
    if (pending.length === 0) {
      toast({ title: "No pending orders in this view" });
      return;
    }
    if (!confirm(`Confirm ${pending.length} pending order(s)? Stock will be deducted.`)) return;
    for (const o of pending) {
      await updateStatus(o.id, "confirmed", o);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteOrderFromDatabase(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      knownIds.current.delete(orderId);
      toast({
        title: "Order deleted",
        description: "Removed completely from the database.",
      });
    } catch (err: any) {
      const msg = err?.message || "Could not delete order.";
      toast({
        title: "Delete failed",
        description:
          msg.includes("policy") || msg.includes("0 rows")
            ? "Permission blocked. Run supabase/orders_delete_policy.sql in Supabase SQL Editor."
            : msg,
        variant: "destructive",
      });
    }
  };

  const exportCsv = () => {
    const rows: string[][] = [
      ["Order ID", "Date", "Status", "Customer", "Location", "Phone", "Total", "Items"],
    ];
    filtered.forEach((o) => {
      const addr = (o.shipping_address || {}) as ShippingAddress;
      const items = (o.order_items || [])
        .map((i) => `${i.products?.name || "Product"} x${i.quantity}`)
        .join("; ");
      rows.push([
        o.id,
        new Date(o.created_at).toISOString(),
        o.status || "pending",
        addr.customer_name || "",
        addr.location || "",
        addr.phone || "",
        String(o.total_amount),
        items,
      ]);
    });
    downloadCsv(`orders-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    toast({ title: "CSV downloaded", description: `${filtered.length} orders exported.` });
  };

  const printOrder = (order: Order) => {
    const addr = (order.shipping_address || {}) as ShippingAddress;
    const itemsHtml = (order.order_items || [])
      .map(
        (i) =>
          `<tr><td>${i.products?.name || "Product"}</td><td>${i.quantity}</td><td>$${(i.unit_price * i.quantity).toLocaleString()}</td></tr>`
      )
      .join("");
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Order ${order.id.slice(0, 8)}</title>
      <style>body{font-family:system-ui;padding:24px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}</style>
      </head><body>
      <h1>Pitory Order #${order.id.slice(0, 8)}</h1>
      <p>${new Date(order.created_at).toLocaleString()}</p>
      <p><b>Customer:</b> ${addr.customer_name || "—"}<br/>
      <b>Location:</b> ${addr.location || "—"}<br/>
      <b>Phone:</b> ${addr.phone || "—"}</p>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>${itemsHtml}</tbody></table>
      <p><b>Total: $${Number(order.total_amount).toLocaleString()}</b></p>
      <p>Status: ${order.status || "pending"}</p>
      <script>window.print()</script></body></html>`);
    w.document.close();
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

  const whatsappLink = (phone?: string, name?: string) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, "");
    const text = encodeURIComponent(
      `Hello ${name || ""}, this is Pitory regarding your order.`
    );
    return `https://wa.me/${digits}?text=${text}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            Customer Orders
            {newCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">{newCount} new</Badge>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Search, filter, export, confirm (auto stock), call & WhatsApp.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={exportCsv}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={bulkConfirmPending}>
            <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
            Confirm all pending
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => {
              setNewCount(0);
              fetchOrders();
            }}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search name, phone, location, order ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-full"
            />
          </div>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 rounded-full w-full sm:w-auto"
            title="From date"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 rounded-full w-full sm:w-auto"
            title="To date"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              className="rounded-full capitalize h-9"
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            {orders.length === 0 ? "No orders yet." : "No orders match your filters."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const addr = (order.shipping_address || {}) as ShippingAddress;
            const wa = whatsappLink(addr.phone, addr.customer_name);
            return (
              <Card key={order.id} className="overflow-hidden border-black/[0.04]">
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
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          Name
                        </div>
                        <div className="font-medium flex items-center gap-1">
                          <span className="truncate">{addr.customer_name || "—"}</span>
                          {addr.customer_name && (
                            <button
                              type="button"
                              className="p-0.5 text-muted-foreground hover:text-foreground"
                              onClick={async () => {
                                if (await copyText(addr.customer_name!))
                                  toast({ title: "Name copied" });
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          Location
                        </div>
                        <div className="font-medium truncate">{addr.location || "—"}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          Phone
                        </div>
                        <div className="font-medium flex items-center gap-1">
                          {addr.phone ? (
                            <>
                              <a href={`tel:${addr.phone}`} className="text-primary hover:underline">
                                {addr.phone}
                              </a>
                              <button
                                type="button"
                                className="p-0.5 text-muted-foreground hover:text-foreground"
                                onClick={async () => {
                                  if (await copyText(addr.phone!))
                                    toast({ title: "Phone copied" });
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            "—"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="rounded-xl bg-muted/30 p-3 space-y-1.5">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm gap-2">
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
                        onClick={() => updateStatus(order.id, "confirmed", order)}
                      >
                        Confirm + stock
                      </Button>
                    )}
                    {(order.status === "pending" || order.status === "confirmed") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => updateStatus(order.id, "completed", order)}
                      >
                        Complete
                      </Button>
                    )}
                    {order.status !== "cancelled" && order.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-destructive"
                        onClick={() => updateStatus(order.id, "cancelled", order)}
                      >
                        Cancel
                      </Button>
                    )}
                    {addr.phone && (
                      <Button size="sm" variant="outline" className="rounded-full" asChild>
                        <a href={`tel:${addr.phone}`}>
                          <Phone className="h-3.5 w-3.5 mr-1" />
                          Call
                        </a>
                      </Button>
                    )}
                    {wa && (
                      <Button size="sm" variant="outline" className="rounded-full" asChild>
                        <a href={wa} target="_blank" rel="noreferrer">
                          <MessageCircle className="h-3.5 w-3.5 mr-1" />
                          WhatsApp
                        </a>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => printOrder(order)}
                    >
                      <Printer className="h-3.5 w-3.5 mr-1" />
                      Print
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-muted-foreground ml-auto"
                      onClick={() => {
                        if (confirm("Delete this order permanently from the database?"))
                          deleteOrder(order.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        Showing {filtered.length} of {orders.length} orders · Auto-refresh every 30s
      </p>
    </div>
  );
}
