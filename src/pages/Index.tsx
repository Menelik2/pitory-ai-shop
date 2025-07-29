import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { PCBuilderAssistant } from "@/components/PCBuilderAssistant";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart, getTotalItems } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error:', error);
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
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.detailed_specs?.cpu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.detailed_specs?.generation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.detailed_specs?.ram?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.detailed_specs?.storage?.toLowerCase().includes(searchQuery.toLowerCase())
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
        filtered.sort((a, b) => (a.price / 100) - (b.price / 100));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.price / 100) - (a.price / 100));
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, products]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header cartItemCount={getTotalItems()} onSearch={setSearchQuery} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header cartItemCount={getTotalItems()} onSearch={setSearchQuery} />
      
      <main>
        <Hero />
        
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredAndSortedProducts.map((product) => {
                // Transform Supabase product to match ProductCard expected format
                const transformedProduct = {
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  category: product.category,
                  price: product.price / 100, // Convert from cents to dollars
                  cpu: product.detailed_specs?.cpu || '',
                  generation: product.detailed_specs?.generation || '',
                  ram: product.detailed_specs?.ram || '',
                  storage: product.detailed_specs?.storage || '',
                  display: product.detailed_specs?.display || '',
                  description: product.description,
                  image: product.image_urls?.[0] || 'https://placehold.co/600x400.png',
                  stock: product.stock_quantity
                };

                return (
                  <ProductCard 
                    key={product.id} 
                    product={transformedProduct} 
                    onAddToCart={addToCart} 
                  />
                );
              })}
            </div>
            
            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <ProductFilters
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
          />
        </div>
        
        <PCBuilderAssistant />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
