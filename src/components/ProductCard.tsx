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
    return Object.entries(allSpecs).slice(0, 3);
  };

  const displaySpecs = getDisplaySpecifications();

  return (
    <Link to={`/products/${product.id}`} className="block group h-full">
      <Card className="
        h-full flex flex-col
        max-w-sm mx-auto
        rounded-2xl overflow-hidden
        bg-white
        border border-black/[0.04]
        shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.04)]
        transition-all duration-300 ease-out
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        hover:-translate-y-1
      ">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f7]">
            <img
              src={product.image}
              alt={product.name}
              className="
                w-full h-full object-cover
                transition-transform duration-700 ease-out
                group-hover:scale-[1.04]
              "
            />
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <Badge className="
                bg-white/90 text-foreground backdrop-blur-md
                px-2.5 py-1 text-[11px] font-medium tracking-wide
                rounded-full border-0 shadow-sm
              ">
                {product.category}
              </Badge>
              {product.stock > 0 && product.stock <= 10 && (
                <Badge className="
                  bg-amber-50 text-amber-800
                  px-2 py-1 text-[10px] font-medium
                  rounded-full border-0
                ">
                  Low stock
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col px-5 pt-5 pb-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
            {product.brand}
          </p>
          <h3 className="font-semibold text-[15px] leading-snug mb-2 line-clamp-2 text-foreground tracking-tight">
            {product.name}
          </h3>
          <p className="text-[13px] text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {displaySpecs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {displaySpecs.map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-[11px] bg-[#f5f5f7] text-muted-foreground"
                >
                  <span className="font-medium text-foreground/70 mr-1">{key}:</span>
                  {value}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-baseline justify-between gap-2">
            <div className="text-xl font-semibold tracking-tight text-foreground tabular-nums">
              ${product.price.toLocaleString()}
            </div>
            <span className="text-[11px] font-medium text-emerald-600">
              In stock
            </span>
          </div>
        </CardContent>

        <CardFooter className="px-5 pt-3 pb-5">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="
              w-full h-11
              rounded-full
              font-medium text-sm
              shadow-none
              transition-all duration-200
              hover:opacity-90
            "
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
