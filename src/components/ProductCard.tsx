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
        max-w-xs min-h-[380px] mx-auto
        rounded-[22px] overflow-hidden
        bg-pink-100/40 border border-white/30
        shadow-xl backdrop-blur-2xl
        transition-all duration-500
        hover:-translate-y-2 hover:scale-105 hover:shadow-pink-400/50
        group relative
      ">
        {/* Glass shimmer */}
        <span className="
          pointer-events-none absolute inset-0 rounded-[22px]
          bg-gradient-to-tr from-pink-100/30 via-transparent to-indigo-100/20
          opacity-0 group-hover:opacity-60
          transition-opacity duration-700
        " />

        {/* Header: Image + Badge */}
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden rounded-t-[22px]">
            <img
              src={product.image}
              alt={product.name}
              className="
                w-full h-full object-cover
                transition-transform duration-500
                group-hover:scale-105
                rounded-t-[22px]
              "
            />
            {/* Cute Gradient Overlay */}
            <div className="
              absolute inset-0 bg-gradient-to-t from-pink-200/60 to-transparent
              pointer-events-none
              transition-opacity duration-500
              opacity-0 group-hover:opacity-70
            " />
            {/* Category Badge */}
            <Badge className="
              absolute top-3 left-3
              bg-pink-400 text-white px-4 py-1 text-xs font-bold shadow
              rounded-full backdrop-blur-md
              scale-90 group-hover:scale-110
              transition-transform duration-300
              border border-white/30
            ">
              {product.category}
            </Badge>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 px-4 py-2 text-center">
          <h3 className="font-bold text-lg mb-1 line-clamp-2 bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow">
            {product.name}
          </h3>
          <p className="text-xs text-pink-900/70 mb-2 line-clamp-2 italic">{product.description}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            <span className="flex items-center gap-2 px-2 py-1 bg-white/40 rounded-full text-xs text-pink-700/80 shadow-sm font-bold">
              CPU: <span className="font-normal">{product.cpu.split(' ').slice(-1)[0]}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-white/40 rounded-full text-xs text-blue-600/80 shadow-sm font-bold">
              Generation: <span className="font-normal">{product.generation}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-white/40 rounded-full text-xs text-purple-600/80 shadow-sm font-bold">
              RAM: <span className="font-normal">{product.ram}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-white/40 rounded-full text-xs text-pink-600/80 shadow-sm font-bold">
              Storage: <span className="font-normal">{product.storage}</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow">
              ${product.price.toLocaleString()}
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-green-300/40 text-green-800 font-bold shadow">
              In Stock
            </div>
          </div>
        </CardContent>

        {/* Button */}
        <CardFooter className="px-4 pt-0 pb-4">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="
              w-full
              bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400
              hover:from-pink-400/90 hover:to-indigo-400/80
              text-white font-semibold py-2 rounded-full shadow
              transition-all duration-200
              scale-95 group-hover:scale-105
              hover:shadow-lg
              flex items-center justify-center
              text-lg
            "
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
