import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/mockProducts";
import { toast } from "@/hooks/use-toast";

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

  return (
    <Link to={`/products/${product.id}`} className="block">
      <Card className="
        group
        max-w-[320px] min-h-[420px] mx-auto
        relative flex flex-col overflow-hidden
        bg-white/10 backdrop-blur-xl border border-white/20
        rounded-2xl shadow-lg hover:shadow-2xl
        transition-all duration-400
        glass-effect
        cursor-pointer
        hover:-translate-y-2
        hover:scale-[1.03]
        animate-fade-in
      ">
        <CardHeader className="p-0">
          <div className="
            aspect-video relative overflow-hidden rounded-t-2xl 
            bg-gradient-to-tr from-white/10 to-primary/10
            ">
            <img
              src={product.image}
              alt={product.name}
              className="
                w-full h-full object-cover
                transition-transform duration-500
                group-hover:scale-110
                animate-zoom-in
              "
            />
            <div className="
              absolute inset-0
              bg-gradient-to-t from-black/30 to-transparent
              opacity-0 group-hover:opacity-90
              transition-opacity duration-300
              pointer-events-none
            " />
            <Badge className="
              absolute top-4 left-4
              bg-primary/80 text-primary-foreground
              px-4 py-1 text-xs font-semibold shadow
              rounded-xl
              scale-90 group-hover:scale-110
              transition-transform duration-300
              animate-pop-in
            ">
              {product.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 text-center">
          <div className="space-y-2">
            <h3 className="font-bold text-base line-clamp-2 text-gradient leading-tight animate-slide-up">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-normal animate-fade-in">
              {product.description}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="flex items-center gap-1 px-2 py-1 bg-muted/30 rounded-lg text-xs">
                <span className="text-primary">🔧</span> {product.cpu.split(' ').slice(-1)[0]}
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-muted/30 rounded-lg text-xs">
                <span className="text-primary">⚡</span> {product.generation}
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-muted/30 rounded-lg text-xs">
                <span className="text-primary">🧠</span> {product.ram}
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-muted/30 rounded-lg text-xs">
                <span className="text-primary">💾</span> {product.storage}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-xl font-bold text-gradient animate-slide-up">
                ${product.price.toLocaleString()}
              </div>
              <div className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full animate-fade-in">
                In Stock
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="
              w-full
              bg-gradient-to-r from-primary to-primary/80
              hover:from-primary/90 hover:to-primary/70
              text-primary-foreground font-semibold py-2
              rounded-xl shadow hover:shadow-xl
              transition-all duration-200
              scale-95 group-hover:scale-105
              animate-bounce-in
            "
          >
            <span className="mr-2">🛒</span>
            Add to Cart
          </Button>
        </CardFooter>
        {/* Optional animated shine effect on hover */}
        <span className="
          pointer-events-none absolute inset-0 rounded-2xl
          bg-gradient-to-tr from-white/30 via-transparent to-white/10
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          animate-shimmer
        " />
      </Card>
    </Link>
  );
}
