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
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getTotalItems } = useCart();

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-100">
        <p className="text-xl font-semibold text-gray-700">Product not found</p>
      </div>
    );
  }

  const similarProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
      <Header cartItemCount={getTotalItems()} onSearch={() => {}} />

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-8 bg-white/90 rounded-3xl shadow-2xl p-4 sm:p-8">
          {/* Product Image */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-xs aspect-square object-cover rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <Badge className="mb-2 rounded-full px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-600">
                {product.category}
              </Badge>
              <p className="text-sm text-gray-500 mb-2">Brand: {product.brand}</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="text-2xl sm:text-4xl font-bold text-indigo-600 mb-4">
                ${product.price.toLocaleString()}
              </div>
            </div>
            <p className="text-base sm:text-lg text-gray-700 mb-4">{product.description}</p>

            {/* Specifications */}
            <Card className="bg-gray-50/80 border-none">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-indigo-700">
                  <span>📋</span> CPU: {product.cpu}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
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
                  {product.display && (
                    <div className="flex items-center gap-2">
                      <span>🖥️</span>
                      <span>Display: {product.display}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-start gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Decrease quantity"
                  className="rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-10 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Increase quantity"
                  className="rounded-full"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full text-lg py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg transition"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <Card
                  key={similarProduct.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow bg-white border border-gray-200 rounded-2xl"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img
                      src={similarProduct.image}
                      alt={similarProduct.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col gap-2">
                    <h3 className="font-bold text-gray-800">{similarProduct.name}</h3>
                    <div className="text-lg font-bold text-indigo-600">
                      ${similarProduct.price.toLocaleString()}
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-2 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold"
                    >
                      View Details
                    </Button>
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
