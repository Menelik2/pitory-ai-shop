import { useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
export default function ProductDetail() {
  const {
    id
  } = useParams();
  const [quantity, setQuantity] = useState(1);
  const {
    addToCart,
    getTotalItems
  } = useCart();
  const product = mockProducts.find(p => p.id === id);
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Product not found</p>
      </div>;
  }
  const similarProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`
    });
  };
  return <div className="min-h-screen">
      <Header cartItemCount={getTotalItems()} onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="aspect-[4/3] md:aspect-square bg-card rounded-xl overflow-hidden shadow-tech hover:shadow-hover-tech transition-all duration-500 group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <p className="text-sm text-muted-foreground mb-2">Brand: {product.brand}</p>
              <h1 className="text-3xl font-bold mb-4 text-slate-950">{product.name}</h1>
              <div className="text-4xl font-bold mb-4">${product.price.toLocaleString()}</div>
            </div>
            
            <p className="text-muted-foreground">{product.description}</p>
            
            {/* Specifications */}
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span>📋</span> CPU: {product.cpu}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>Generation: {product.generation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🧠</span>
                    <span>RAM: {product.ram}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💾</span>
                    <span>Storage: {product.storage}</span>
                  </div>
                  {product.display && <div className="flex items-center gap-2">
                      <span>🖥️</span>
                      <span>Display: {product.display}</span>
                    </div>}
                </div>
              </CardContent>
            </Card>
            
            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button onClick={handleAddToCart} className="w-full text-lg py-6">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
        
        {/* Similar Products */}
        {similarProducts.length > 0 && <section>
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map(similarProduct => <Card key={similarProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-card/80 backdrop-blur">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={similarProduct.image} alt={similarProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{similarProduct.name}</h3>
                    <div className="text-lg font-bold text-primary mb-2">
                      ${similarProduct.price.toLocaleString()}
                    </div>
                    <Button size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>)}
            </div>
          </section>}
      </main>
      
      <Footer />
    </div>;
}