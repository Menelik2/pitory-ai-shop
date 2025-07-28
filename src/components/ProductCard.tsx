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
        bg-white border border-gray-200
        shadow-lg
        transition-all duration-500
        hover:-translate-y-2 hover:scale-105 hover:shadow-xl
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
              bg-pink-400 text-white px-4 py-1 text-xs font-bold shadow
              rounded-full
              scale-90 group-hover:scale-110
              transition-transform duration-300
            ">
              {product.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-4 py-2 text-center">
          <h3 className="font-bold text-lg mb-1 line-clamp-2 text-pink-600">
            {product.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2 italic">{product.description}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            <span className="flex items-center gap-2 px-2 py-1 bg-pink-50 rounded-full text-xs text-pink-700 font-bold">
              CPU: <span className="font-normal">{product.cpu.split(' ').slice(-1)[0]}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-purple-50 rounded-full text-xs text-purple-700 font-bold">
              Generation: <span className="font-normal">{product.generation}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-full text-xs text-blue-700 font-bold">
              RAM: <span className="font-normal">{product.ram}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-green-50 rounded-full text-xs text-green-700 font-bold">
              Storage: <span className="font-normal">{product.storage}</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xl font-extrabold text-pink-600">
              ${product.price.toLocaleString()}
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-green-200 text-green-900 font-bold shadow">
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
              bg-pink-500 hover:bg-pink-400
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
