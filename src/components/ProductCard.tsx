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
        rounded-xl overflow-hidden
        bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500
        border border-indigo-700
        shadow-lg
        transition-all duration-500
        hover:-translate-y-2 hover:scale-105 hover:shadow-2xl
        group relative
      ">
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden rounded-t-xl">
            <img
              src={product.image}
              alt={product.name}
              className="
                w-full h-full object-cover
                transition-transform duration-500
                group-hover:scale-105
                rounded-t-xl
              "
            />
            {/* Category Badge */}
            <Badge className="
              absolute top-3 left-3
              bg-fuchsia-400 text-white px-4 py-1 text-xs font-bold shadow
              rounded-full
              scale-90 group-hover:scale-110
              transition-transform duration-300
            ">
              {product.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-4 py-2 text-center">
          <h3 className="font-bold text-lg mb-1 line-clamp-2 text-white drop-shadow">
            {product.name}
          </h3>
          <p className="text-xs text-white/80 mb-2 line-clamp-2 italic">{product.description}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            <span className="flex items-center gap-2 px-2 py-1 bg-indigo-100/50 rounded-full text-xs text-indigo-900 font-bold">
              CPU: <span className="font-normal">{product.cpu.split(' ').slice(-1)[0]}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-purple-100/50 rounded-full text-xs text-purple-900 font-bold">
              Generation: <span className="font-normal">{product.generation}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-blue-100/50 rounded-full text-xs text-blue-900 font-bold">
              RAM: <span className="font-normal">{product.ram}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-fuchsia-100/50 rounded-full text-xs text-fuchsia-900 font-bold">
              Storage: <span className="font-normal">{product.storage}</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xl font-extrabold text-white drop-shadow">
              ${product.price.toLocaleString()}
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-green-300/50 text-green-900 font-bold shadow">
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
              bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-purple-500
              hover:from-fuchsia-600 hover:to-purple-600
              text-white font-semibold py-2 rounded-full shadow
              transition-all duration-200
              scale-95 group-hover:scale-105
              hover:shadow-xl
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
