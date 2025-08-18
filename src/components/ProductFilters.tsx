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
    <div className="mb-12">
      {/* Modern Category Filter */}
      <div className="bg-gradient-to-r from-card/40 via-card/20 to-card/40 backdrop-blur-2xl border border-border/20 rounded-3xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gradient mb-2">Explore Categories</h3>
          <p className="text-muted-foreground">Discover our premium collection</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`group relative px-8 py-4 rounded-2xl font-medium transition-all duration-500 hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/25'
                  : 'bg-card/60 hover:bg-card/80 text-foreground border border-border/50 hover:border-primary/30 hover:shadow-lg'
              }`}
            >
              <span className="relative z-10">{category}</span>
              {selectedCategory === category && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-300"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
