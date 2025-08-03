import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/mockProducts";

interface MobileCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MobileCategoryFilter({
  selectedCategory,
  onCategoryChange,
}: MobileCategoryFilterProps) {
  return (
    <div className="md:hidden mb-8">
      <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}