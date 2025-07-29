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
    <Link to={`/product/${product.id}`} className="block">
      <Card className="
        max-w-xs min-h-[400px] mx-auto
        rounded-2xl overflow-hidden
        bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900
        border border-purple-800
        shadow-2xl
        transition-all duration-500
        hover:-translate-y-2 hover:scale-105 hover:shadow-fuchsia-800/40
        group relative
        font-sans
      ">
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden rounded-t-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="
                w-full h-full object-cover
                transition-transform duration-500
                group-hover:scale-105
                rounded-t-2xl
              "
            />
            <Badge className="
              absolute top-3 left-3
              bg-fuchsia-600 text-white px-4 py-1 text-xs font-bold shadow
              rounded-full
              scale-90 group-hover:scale-110
              transition-transform duration-300
              border border-fuchsia-900
            ">
              {product.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-5 py-4 text-center">
          <h3 className="font-extrabold text-lg mb-1 line-clamp-2 text-yellow-300 tracking-wide font-serif drop-shadow">
            {product.name}
          </h3>
          <p className="text-xs text-white mb-3 line-clamp-2 italic font-light drop-shadow">
            {product.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            <span className="flex items-center gap-2 px-2 py-1 bg-indigo-800 rounded-full text-xs text-yellow-200 font-bold border border-yellow-300">
              CPU: <span className="font-normal">{product.cpu.split(' ').slice(-1)[0]}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-purple-800 rounded-full text-xs text-pink-200 font-bold border border-pink-400">
              Generation: <span className="font-normal">{product.generation}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-fuchsia-800 rounded-full text-xs text-green-200 font-bold border border-green-400">
              RAM: <span className="font-normal">{product.ram}</span>
            </span>
            <span className="flex items-center gap-2 px-2 py-1 bg-pink-700 rounded-full text-xs text-cyan-100 font-bold border border-cyan-400">
              Storage: <span className="font-normal">{product.storage}</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xl font-extrabold text-yellow-300 font-mono drop-shadow">
              ${product.price.toLocaleString()}
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-green-600 text-white font-bold shadow border border-green-300">
              In Stock
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-5 pt-0 pb-5">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="
              w-full
              bg-gradient-to-r from-yellow-400 via-fuchsia-600 to-indigo-700
              hover:from-yellow-500 hover:to-indigo-800
              text-white font-bold py-2 rounded-full shadow
              transition-all duration-200
              scale-95 group-hover:scale-105
              hover:shadow-xl
              flex items-center justify-center
              text-lg tracking-wider
              font-serif
              drop-shadow
            "
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
