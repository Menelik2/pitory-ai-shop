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
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow bg-card/80 backdrop-blur border-border/50">
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <Badge className="absolute top-2 right-2 bg-primary">
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>CPU: {product.cpu.split(' ').slice(-1)[0]}</div>
            <div>Gen: {product.generation}</div>
            <div>RAM: {product.ram}</div>
            <div>Storage: {product.storage}</div>
          </div>
          
          <div className="text-2xl font-bold text-primary">
            ${product.price.toLocaleString()}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}