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
    <div className="mb-6 hidden lg:block">
      {/* Compact Category Filter - Desktop Only */}
      <div className="relative overflow-hidden bg-gradient-to-br from-card/60 via-card/30 to-card/60 backdrop-blur-3xl border border-border/30 rounded-xl p-4 shadow-lg shadow-primary/5">
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3"></div>
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
              Explore Categories
            </h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground shadow-md shadow-primary/20 border border-primary/20'
                    : 'bg-gradient-to-r from-card via-card/80 to-card/60 hover:from-card/90 hover:via-card/70 hover:to-card/50 text-foreground border border-border/40 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10'
                }`}
              >
                <span className="relative z-10">{category}</span>
                
                {/* Active state glow effect */}
                {selectedCategory === category && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-sm -z-10 transition-all duration-300"></div>
                )}
                
                {/* Hover effect for non-active items */}
                {selectedCategory !== category && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-accent/5 rounded-lg transition-all duration-300"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
