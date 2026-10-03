import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InventoryStats } from "@/components/admin/InventoryStats";
import { ProductTable } from "@/components/admin/ProductTable";
import { OrdersList } from "@/components/admin/OrdersList";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { getTotalItems } = useCart();
  const { user, isAdmin, loading, adminLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (loading || adminLoading) return;

    if (!user) {
      navigate("/auth?redirect=/admin", { replace: true });
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate("/auth?redirect=/admin", { replace: true });
    }
  }, [user, isAdmin, loading, adminLoading, navigate, toast]);

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={getTotalItems()} onSearch={() => {}} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Inventory, products, and customer orders.
          </p>
        </div>

        <InventoryStats />
        <ProductTable />
        <OrdersList />
      </main>

      <Footer />
    </div>
  );
}
