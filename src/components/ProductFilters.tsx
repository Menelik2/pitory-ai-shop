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
    <div className="mb-8">
      {/* Modern Search and Sort Section */}
      <div className="bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-8 shadow-tech">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Modern Search Bar */}
          <div className="flex-1 w-full">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search products by name, brand, CPU, RAM..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-14 text-base bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>
          </div>
          
          {/* Modern Sort Dropdown */}
          <div className="w-full lg:w-72">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Sort by</label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="h-14 bg-background/50 border-border/50 rounded-xl hover:border-primary/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
                  <SelectValue className="text-base" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50 rounded-xl shadow-2xl">
                  <SelectItem value="name-asc" className="hover:bg-primary/10 focus:bg-primary/10 rounded-lg">
                    Name (A-Z)
                  </SelectItem>
                  <SelectItem value="name-desc" className="hover:bg-primary/10 focus:bg-primary/10 rounded-lg">
                    Name (Z-A)
                  </SelectItem>
                  <SelectItem value="price-asc" className="hover:bg-primary/10 focus:bg-primary/10 rounded-lg">
                    Price (Low to High)
                  </SelectItem>
                  <SelectItem value="price-desc" className="hover:bg-primary/10 focus:bg-primary/10 rounded-lg">
                    Price (High to Low)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Category Filter */}
      <div className="hidden md:block mt-6">
        <Card className="glass-effect border-border/30">
          <CardContent className="p-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Filter by Category</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105 px-4 py-2 text-sm font-medium"
                    onClick={() => onCategoryChange(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
