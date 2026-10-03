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
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
        Category
      </h3>
      <div
        className="
          flex flex-wrap gap-2 p-2.5 rounded-2xl
          bg-white/60 backdrop-blur-xl backdrop-saturate-150
          border border-black/[0.04]
        "
        style={{
          WebkitBackdropFilter: "saturate(150%) blur(16px)",
        }}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-white/50 text-muted-foreground border border-black/[0.06] backdrop-blur-sm"
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
