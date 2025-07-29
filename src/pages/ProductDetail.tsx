import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, getTotalItems } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Fetch the specific product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        return;
      }

      setProduct(productData);

      // Fetch similar products (same category, excluding current product)
      if (productData?.category) {
        const { data: similarData, error: similarError } = await supabase
          .from('products')
          .select('*')
          .eq('category', productData.category)
          .neq('id', id)
          .limit(4);

        if (similarError) {
          console.error('Error fetching similar products:', similarError);
        } else {
          setSimilarProducts(similarData || []);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Transform Supabase product to cart format
    const cartProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      cpu: product.detailed_specs?.cpu || '',
      generation: product.detailed_specs?.generation || '',
      ram: product.detailed_specs?.ram || '',
      storage: product.detailed_specs?.storage || '',
      display: product.detailed_specs?.display || '',
      description: product.description,
      image: product.image_urls?.[0] || 'https://placehold.co/600x400.png',
      stock: product.stock_quantity
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen">
      <Header cartItemCount={getTotalItems()} onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="relative bg-card rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-square sm:aspect-[4/3] lg:aspect-square">
              <img
                src={product.image_urls?.[0] || 'https://placehold.co/600x400.png'}
                alt={product.name}   
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 text-sm">{product.category}</Badge>
              <p className="text-sm text-muted-foreground mb-2">Brand: {product.brand}</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4 leading-tight">{product.name}</h1>
              <div className="text-3xl sm:text-4xl font-bold mb-6 text-gradient">${(product.price / 100).toLocaleString()}</div>
            </div>
            
            <p className="text-muted-foreground">{product.description}</p>
            
            {/* Specifications */}
            <Card className="bg-card/80 backdrop-blur border border-border/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                  <span>📋</span> CPU: {product.detailed_specs?.cpu || 'N/A'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <span>⚡</span>
                    <span>Generation: {product.detailed_specs?.generation || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <span>🧠</span>
                    <span>RAM: {product.detailed_specs?.ram || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <span>💾</span>
                    <span>Storage: {product.detailed_specs?.storage || 'N/A'}</span>
                  </div>
                  {product.detailed_specs?.display && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <span>🖥️</span>
                      <span>Display: {product.detailed_specs.display}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4 p-4 bg-muted/30 rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-16 text-center bg-background rounded px-3 py-2">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button onClick={handleAddToCart} className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-shadow">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
        
        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <Card key={similarProduct.id} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 bg-card/80 backdrop-blur border border-border/50">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={similarProduct.image_urls?.[0] || 'https://placehold.co/600x400.png'}
                      alt={similarProduct.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base line-clamp-2">{similarProduct.name}</h3>
                    <div className="text-lg font-bold text-primary mb-3">
                      ${(similarProduct.price / 100).toLocaleString()}
                    </div>
                    <Link to={`/product/${similarProduct.id}`}>
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
