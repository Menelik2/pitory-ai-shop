import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Cpu, Monitor, HardDrive, MemoryStick } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getTotalItems } = useCart();

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
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
    <div className="min-h-screen bg-[#f5f6fa]">
      <Header cartItemCount={getTotalItems()} onSearch={() => {}} />

      <main className="container mx-auto px-2 sm:px-4 py-6">
        {/* Main Product Card */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-12">
          <Card className="w-full lg:w-1/2 p-6 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 flex justify-center items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-64 h-64 object-cover rounded-2xl shadow-md hover:scale-105 transition-all duration-300"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Badge className="mb-2 rounded-full px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-600">
                    {product.category}
                  </Badge>
                  <p className="text-sm text-gray-500 mb-2">Brand: {product.brand}</p>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                  <div className="text-2xl font-bold text-indigo-600 mb-4">
                    ${product.price.toLocaleString()}
                  </div>
                  <p className="text-base text-gray-700 mb-4">{product.description}</p>

                  {/* Specifications */}
                  <div className="bg-[#f5f6fa] rounded-xl p-4 mb-4">
                    <h3 className="font-bold mb-2 text-gray-700 text-lg">Specifications</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium text-gray-600">CPU:</span>
                        <span className="ml-1 text-gray-800">{product.cpu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MemoryStick className="w-5 h-5 text-purple-500" />
                        <span className="font-medium text-gray-600">RAM:</span>
                        <span className="ml-1 text-gray-800">{product.ram}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-teal-500" />
                        <span className="font-medium text-gray-600">Storage:</span>
                        <span className="ml-1 text-gray-800">{product.storage}</span>
                      </div>
                      {product.display && (
                        <div className="flex items-center gap-2">
                          <Monitor className="w-5 h-5 text-pink-500" />
                          <span className="font-medium text-gray-600">Display:</span>
                          <span className="ml-1 text-gray-800">{product.display}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Generation:</span>
                        <span className="ml-1 text-gray-800">{product.generation}</span>
                      </div>
                    </dl>
                  </div>
                </div>
                {/* Quantity and Add to Cart */}
                <div>
                  <div className="flex items-center gap-4 mb-3">
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
                    className="w-full text-lg py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Similar Products Card Grid */}
        {similarProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">You Might Also Like</h2>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {similarProducts.map((sp) => (
                <Card
                  key={sp.id}
                  className="group bg-white rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="flex flex-col items-center p-4"
                    onClick={() => navigate(`/product/${sp.id}`)}
                  >
                    <div className="relative w-full flex justify-center mb-4">
                      <img
                        src={sp.image}
                        alt={sp.name}
                        className="w-44 h-44 object-cover rounded-xl shadow-md group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                    <Badge className="mb-2 rounded-full px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-600">
                      {sp.category}
                    </Badge>
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 text-center">{sp.name}</h3>
                    <div className="text-indigo-600 font-bold text-lg mb-2">${sp.price.toLocaleString()}</div>
                    <Button
                      size="sm"
                      className="w-full rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${sp.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
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
