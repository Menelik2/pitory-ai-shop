import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tag, Sparkles } from "lucide-react";
import { categories } from "@/data/mockProducts";

interface ProductFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

const getCategoryIcon = (category: string) => {
  const key = category.toLowerCase();
  if (key.includes("art") || key.includes("painting")) return "🎨";
  if (key.includes("photo") || key.includes("photography")) return "📷";
  if (key.includes("nature") || key.includes("landscape")) return "🌲";
  if (key.includes("abstract")) return "🌀";
  if (key.includes("portrait")) return "👤";
  if (key.includes("digital")) return "💻";
  return "🏷️";
};

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
      {/* Desktop-only: Modern Category Filter (visible on md and up) */}
      <div className="hidden md:block bg-gradient-to-r from-card/40 via-card/20 to-card/40 backdrop-blur-2xl border border-border/20 rounded-3xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-extrabold text-gradient mb-2 flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" aria-hidden />
            <span>Explore Categories</span>
          </h3>
          <p className="text-muted-foreground">
            Discover our premium collection — click a category to explore curated selections
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                aria-pressed={isSelected}
                className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-primary/30 hover:scale-105 ${
                  isSelected
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/25"
                    : "bg-card/60 text-foreground border border-border/50 hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {getCategoryIcon(category)}
                </span>
                <span className="relative z-10">{category}</span>

                {isSelected && <Badge className="ml-2" variant="secondary">Selected</Badge>}

                {/* Decorative gradient blur behind selected item */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: compact select fallback (visible on small screens) */}
      <div className="md:hidden">
        <Card className="rounded-xl shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <Tag className="w-5 h-5 text-muted-foreground" aria-hidden />
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground">Category</label>
              <Select value={selectedCategory || ""} onValueChange={(val) => onCategoryChange(val)}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {getCategoryIcon(c)} {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
