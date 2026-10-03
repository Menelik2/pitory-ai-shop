import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { ProductTable } from "@/components/admin/ProductTable";
import { OrdersList } from "@/components/admin/OrdersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Package, ShoppingBag, LayoutDashboard } from "lucide-react";

export default function Admin() {
  const { getTotalItems } = useCart();
  const { user, isAdmin, loading, adminLoading, signOut } = useAuth();
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Signed in as {user.email}. Manage orders, stock, and products.
            </p>
          </div>
        </div>

        <DashboardStats />
        <RecentActivity />

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="rounded-full h-11 p-1 mb-6 bg-muted/80">
            <TabsTrigger value="orders" className="rounded-full gap-1.5 px-4">
              <ShoppingBag className="h-3.5 w-3.5" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-full gap-1.5 px-4">
              <Package className="h-3.5 w-3.5" />
              Products
            </TabsTrigger>
            <TabsTrigger value="overview" className="rounded-full gap-1.5 px-4">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-0">
            <OrdersList />
          </TabsContent>

          <TabsContent value="products" className="mt-0">
            <ProductTable />
          </TabsContent>

          <TabsContent value="overview" className="mt-0 space-y-10">
            <OrdersList />
            <ProductTable />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
