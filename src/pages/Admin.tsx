import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InventoryStats } from "@/components/admin/InventoryStats";
import { ProductTable } from "@/components/admin/ProductTable";
import { useCart } from "@/context/CartContext";

export default function Admin() {
  const { getTotalItems } = useCart();

  return (
    <div className="min-h-screen">
      <Header cartItemCount={getTotalItems()} onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Inventory Manager</h1>
          <p className="text-muted-foreground">
            An overview of your current product inventory and value.
          </p>
        </div>
        
        <InventoryStats />
        <ProductTable />
      </main>
      
      <Footer />
    </div>
  );
}