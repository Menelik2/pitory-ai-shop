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
    <Link to={`/products/${product.id}`}>
      <Card className="group h-full flex flex-col overflow-hidden glass-effect hover:shadow-hover-tech transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium shadow-lg">
              {product.category}
            </Badge>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
                <span className="text-xs text-muted-foreground">💫</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                {product.brand}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-yellow-500">★</span>
                <span className="text-xs text-muted-foreground">4.8</span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg sm:text-xl line-clamp-2 text-gradient leading-tight">
              {product.name}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm bg-muted/30 rounded-lg p-2">
                <span className="text-primary">🔧</span> 
                <span className="font-medium text-foreground">{product.cpu.split(' ').slice(-1)[0]}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm bg-muted/30 rounded-lg p-2">
                <span className="text-primary">⚡</span> 
                <span className="font-medium text-foreground">{product.generation}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm bg-muted/30 rounded-lg p-2">
                <span className="text-primary">🧠</span> 
                <span className="font-medium text-foreground">{product.ram}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm bg-muted/30 rounded-lg p-2">
                <span className="text-primary">💾</span> 
                <span className="font-medium text-foreground">{product.storage}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-2xl sm:text-3xl font-bold text-gradient">
                ${product.price.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                In Stock
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 sm:p-6 pt-0">
          <Button 
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }} 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <span className="mr-2">🛒</span>
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}