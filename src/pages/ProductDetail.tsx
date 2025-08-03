import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, ShoppingCart, Send } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  cpu: string;
  generation: string;
  ram: string;
  storage: string;
  display: string;
}
interface Comment {
  id: string;
  comment: string;
  created_at: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const { addToCart, getTotalItems } = useCart();

  useEffect(() => {
    fetchProduct();
    fetchComments();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const convertedProduct: Product = {
          id: data.id,
          name: data.name,
          brand: data.brand || '',
          price: data.price,
          category: data.category,
          description: data.description || '',
          image: data.image_urls?.[0] || '/placeholder.svg',
          stock: data.stock_quantity || 0,
          cpu: (data.detailed_specs as any)?.cpu || '',
          generation: (data.detailed_specs as any)?.generation || '',
          ram: (data.detailed_specs as any)?.ram || '',
          storage: (data.detailed_specs as any)?.storage || '',
          display: (data.detailed_specs as any)?.display || ''
        };
        
        setProduct(convertedProduct);
        
        // Fetch similar products
        const { data: similarData } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(4);

        if (similarData) {
          const convertedSimilar: Product[] = similarData.map((item) => ({
            id: item.id,
            name: item.name,
            brand: item.brand || '',
            price: item.price,
            category: item.category,
            description: item.description || '',
            image: item.image_urls?.[0] || '/placeholder.svg',
            stock: item.stock_quantity || 0,
            cpu: (item.detailed_specs as any)?.cpu || '',
            generation: (item.detailed_specs as any)?.generation || '',
            ram: (item.detailed_specs as any)?.ram || '',
            storage: (item.detailed_specs as any)?.storage || '',
            display: (item.detailed_specs as any)?.display || ''
          }));
          setSimilarProducts(convertedSimilar);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('product_comments')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !id) return;
    
    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('product_comments')
        .insert({
          product_id: id,
          comment: newComment.trim()
        });

      if (error) throw error;
      
      setNewComment("");
      fetchComments();
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully!"
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
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
          <div className="w-80 h-80 bg-card rounded-xl overflow-hidden shadow-tech hover:shadow-hover-tech transition-all duration-500 group mx-auto lg:mx-0">
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
        
        {/* Comments Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Customer Comments</h2>
          
          {/* Add Comment */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Leave a Comment</h3>
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts about this product..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submittingComment}
                  className="w-full sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submittingComment ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </CardContent>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-6">
                    <p className="text-foreground mb-2">{comment.comment}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

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
                    <Button size="sm" className="w-full" onClick={() => navigate(`/products/${similarProduct.id}`)}>
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