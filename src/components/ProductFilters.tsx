import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { categories } from "@/data/mockProducts";

interface ProductFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

export function ProductFilters({
  searchQuery,
  selectedCategory,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="mb-12 hidden lg:block">
      {/* Premium Category Filter - Desktop Only */}
      <div className="relative overflow-hidden bg-gradient-to-br from-card/60 via-card/30 to-card/60 backdrop-blur-3xl border border-border/30 rounded-[2rem] p-12 shadow-2xl shadow-primary/5">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl animate-float delay-1000"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent mb-4">
              Explore Categories
            </h3>
            <p className="text-lg text-muted-foreground/80 max-w-md mx-auto">
              Discover our premium collection of cutting-edge technology
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`group relative px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-700 hover:scale-110 hover:-translate-y-1 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground shadow-xl shadow-primary/30 border border-primary/20'
                    : 'bg-gradient-to-r from-card via-card/80 to-card/60 hover:from-card/90 hover:via-card/70 hover:to-card/50 text-foreground border border-border/40 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10'
                }`}
              >
                <span className="relative z-10 tracking-wide">{category}</span>
                
                {/* Active state glow effect */}
                {selectedCategory === category && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-2xl -z-20 animate-pulse"></div>
                  </>
                )}
                
                {/* Hover effect for non-active items */}
                {selectedCategory !== category && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-accent/10 rounded-2xl transition-all duration-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
