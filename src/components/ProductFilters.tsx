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
  selectedCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <div className="mb-10 hidden lg:block">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-white text-muted-foreground border border-black/[0.06] hover:border-black/10 hover:text-foreground hover:bg-[#fafafa]"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
