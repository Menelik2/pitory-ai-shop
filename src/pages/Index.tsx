import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { PCBuilderAssistant } from "@/components/PCBuilderAssistant";
import { Footer } from "@/components/Footer";
import { mockProducts, Product } from "@/data/mockProducts";
import { useCart } from "@/context/CartContext";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  
  const { addToCart, getTotalItems } = useCart();

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts;

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
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
        
        <PCBuilderAssistant />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
