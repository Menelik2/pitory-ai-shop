import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/data/mockProducts";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const getDisplaySpecifications = () => {
    const specs = product.specifications || {};
    const legacySpecs = {
      ...(product.cpu && { cpu: product.cpu }),
      ...(product.generation && { generation: product.generation }),
      ...(product.ram && { ram: product.ram }),
      ...(product.storage && { storage: product.storage }),
    };

    const allSpecs = { ...legacySpecs, ...specs };
    return Object.entries(allSpecs).slice(0, 4);
  };

  const displaySpecs = getDisplaySpecifications();

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <Card className="
        max-w-xs min-h-[400px] mx-auto
        rounded-2xl overflow-hidden
        bg-white
        border border-black/5
        shadow-sm
        transition-all duration-300
        hover:shadow-md hover:-translate-y-0.5
        relative
      ">
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden bg-secondary/40">
            <img
              src={product.image}
              alt={product.name}
              className="
                w-full h-full object-cover
                transition-transform duration-500
                group-hover:scale-[1.03]
              "
            />
            <Badge className="
              absolute top-3 left-3
              bg-white/90 text-foreground backdrop-blur-sm
              px-2.5 py-0.5 text-[11px] font-medium
              rounded-lg border border-black/5 shadow-sm
            ">
              {product.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-4 py-4 text-left">
          <h3 className="font-semibold text-base mb-1 line-clamp-2 text-foreground tracking-tight">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {displaySpecs.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary text-muted-foreground border border-black/5"
              >
                <span className="uppercase tracking-wide opacity-70">{key}</span>
                <span className="text-foreground">{value}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-foreground tabular-nums">
              ${product.price.toLocaleString()}
            </div>
            <div className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
              In Stock
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 pt-0 pb-4">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="
              w-full
              rounded-xl h-10
              font-medium
              transition-all duration-200
            "
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
