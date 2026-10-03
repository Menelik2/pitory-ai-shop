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
    <div className="lg:hidden mb-6">
      <h3 className="text-[11px] font-semibold mb-2.5 px-0.5 text-muted-foreground uppercase tracking-wider">
        Category
      </h3>

      {/* Horizontal scroll — avoids uneven wrap on small screens */}
      <div className="relative -mx-4 px-4">
        <div
          className="
            flex gap-2 overflow-x-auto pb-1
            scrollbar-none
            [-ms-overflow-style:none] [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`
                  shrink-0 px-4 py-2 rounded-full text-[13px] font-medium
                  transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-foreground text-background shadow-sm"
                      : "bg-white/80 text-muted-foreground border border-black/[0.06] backdrop-blur-sm active:scale-[0.97]"
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
