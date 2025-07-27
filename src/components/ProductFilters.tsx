import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/data/mockProducts";

interface ProductFiltersProps {
  selectedCategory: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

export function ProductFilters({
  selectedCategory,
  sortBy,
  onCategoryChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-card/80 backdrop-blur">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="bg-card/80 backdrop-blur">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            <SelectItem value="price-asc">Price Low-High</SelectItem>
            <SelectItem value="price-desc">Price High-Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}