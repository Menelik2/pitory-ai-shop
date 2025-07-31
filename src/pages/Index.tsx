import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { PCBuilderAssistant } from "@/components/PCBuilderAssistant";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  cpu: string;
  generation: string;
  ram: string;
  storage: string;
  display: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart, getTotalItems } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert Supabase data to our Product interface
      const convertedProducts: Product[] = (data || []).map((product) => ({
        id: product.id,
        name: product.name,
        brand: product.brand || '',
        price: product.price, // Price is already in dollars
        category: product.category,
        description: product.description || '',
        image: product.image_urls?.[0] || '/placeholder.svg',
        stock: product.stock_quantity || 0,
        cpu: (product.detailed_specs as any)?.cpu || '',
        generation: (product.detailed_specs as any)?.generation || '',
        ram: (product.detailed_specs as any)?.ram || '',
        storage: (product.detailed_specs as any)?.storage || '',
        display: (product.detailed_specs as any)?.display || ''
      }));

      setProducts(convertedProducts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.cpu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.generation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ram.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.storage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen">
      <Header cartItemCount={getTotalItems()} onSearch={setSearchQuery} />
      
      <main>
        <Hero />
        
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <ProductFilters
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              sortBy={sortBy}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              onSortChange={setSortBy}
            />
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Featured Products</h2>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                    />
                  ))}
                </div>
                
                {!loading && filteredAndSortedProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xl text-muted-foreground">
                      No products found matching your criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        
        <PCBuilderAssistant />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
