import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, ShoppingCart, Send, Star, Heart, Share2, Zap, Monitor, HardDrive, Cpu, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/mockProducts";

interface Comment {
  id: string;
  comment: string;
  user_name: string;
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
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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
        // Helper function to safely convert detailed_specs to Record<string, string>
        const convertSpecifications = (specs: any): Record<string, string> => {
          if (!specs || typeof specs !== 'object') return {};
          
          const result: Record<string, string> = {};
          for (const [key, value] of Object.entries(specs)) {
            result[key] = String(value || '');
          }
          return result;
        };

        const convertedProduct: Product = {
          id: data.id,
          name: data.name,
          brand: data.brand || '',
          price: data.price,
          category: data.category,
          description: data.description || '',
          image: data.image_urls?.[0] || '/placeholder.svg',
          images: data.image_urls || ['/placeholder.svg'],
          stock: data.stock_quantity || 0,
          specifications: convertSpecifications(data.detailed_specs),
          // Legacy fields for backward compatibility
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
            images: item.image_urls || ['/placeholder.svg'],
            stock: item.stock_quantity || 0,
            specifications: convertSpecifications(item.detailed_specs),
            // Legacy fields
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
    if (!newComment.trim() || !userName.trim() || !id) return;
    
    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('product_comments')
        .insert({
          product_id: id,
          comment: newComment.trim(),
          user_name: userName.trim()
        });

      if (error) throw error;
      
      setNewComment("");
      setUserName("");
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

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard."
      });
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header cartItemCount={getTotalItems()} onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group">
              <div className="aspect-square bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/50 hover:shadow-3xl transition-all duration-700">
                <img 
                  src={product.images[selectedImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative group aspect-square bg-card rounded-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
                    selectedImageIndex === index 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-border/50 hover:border-primary/50'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6 animate-fade-in">
            {/* Brand and Category */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs font-medium px-2 py-1">
                {product.brand}
              </Badge>
              <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                {product.category}
              </Badge>
            </div>

            {/* Product Name */}
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-muted text-muted" />
              </div>
              <span className="text-sm text-muted-foreground">(4.2/5)</span>
            </div>

            {/* Price Display */}
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800/30 mb-6">
              <div className="text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400">
                ${product.price.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Free shipping</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className="flex-1 border-border/50 hover:border-primary/50"
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                Favorite
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
                className="flex-1 border-border/50 hover:border-primary/50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            {/* Product Description */}
            <Card className="bg-card border-border/50">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-2 text-foreground">Product Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
            
            {/* Specifications Tabs */}
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="features">Key Features</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specs" className="mt-6">
                <Card className="bg-gradient-to-br from-card via-card to-muted/10 backdrop-blur border-border/50">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Dynamic specifications from the new system */}
                      {product.specifications && Object.entries(product.specifications).length > 0 ? (
                        Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                            <Cpu className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium capitalize">{key.replace(/_/g, ' ')}</div>
                              <div className="text-sm text-muted-foreground">{value}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        /* Fallback to legacy specifications for backward compatibility */
                        <>
                          {product.cpu && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                              <Cpu className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">Processor</div>
                                <div className="text-sm text-muted-foreground">{product.cpu}</div>
                              </div>
                            </div>
                          )}
                          
                          {product.generation && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                              <Zap className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">Generation</div>
                                <div className="text-sm text-muted-foreground">{product.generation}</div>
                              </div>
                            </div>
                          )}
                          
                          {product.ram && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                              <HardDrive className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">Memory</div>
                                <div className="text-sm text-muted-foreground">{product.ram}</div>
                              </div>
                            </div>
                          )}
                          
                          {product.storage && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                              <HardDrive className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">Storage</div>
                                <div className="text-sm text-muted-foreground">{product.storage}</div>
                              </div>
                            </div>
                          )}
                          
                          {product.display && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors sm:col-span-2">
                              <Monitor className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">Display</div>
                                <div className="text-sm text-muted-foreground">{product.display}</div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <Card className="bg-gradient-to-br from-card via-card to-muted/10 backdrop-blur border-border/50">
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>High-performance computing for demanding applications</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Energy-efficient design for longer battery life</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Premium build quality with modern aesthetics</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Comprehensive warranty and support</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Add to Cart Section */}
            <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Quantity</span>
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="hover-scale"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setQuantity(quantity + 1)}
                        className="hover-scale"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart} 
                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ShoppingCart className="mr-3 h-6 w-6" />
                    Add {quantity} to Cart - ${(product.price * quantity).toLocaleString()}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Comments Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Customer Reviews
          </h2>
          
          {/* Add Comment */}
          <Card className="mb-8 bg-gradient-to-br from-card via-card to-muted/5 border-border/50">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Share Your Experience
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="userName" className="text-base font-medium">Your Name</Label>
                  <Input
                    id="userName"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="comment" className="text-base font-medium">Your Review</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your thoughts about this product..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[120px] mt-2"
                  />
                </div>
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || !userName.trim() || submittingComment}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  size="lg"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {submittingComment ? "Posting..." : "Post Review"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <Card className="bg-muted/20">
                <CardContent className="p-8 text-center">
                  <div className="space-y-3">
                    <div className="text-6xl">💬</div>
                    <p className="text-xl text-muted-foreground">No reviews yet</p>
                    <p className="text-muted-foreground">Be the first to share your thoughts about this product!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              comments.map((comment, index) => (
                <Card 
                  key={comment.id} 
                  className="bg-gradient-to-br from-card via-card to-muted/5 border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">{comment.user_name || 'Anonymous'}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-foreground leading-relaxed">{comment.comment}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map((similarProduct, index) => (
                <Card 
                  key={similarProduct.id} 
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card via-card to-muted/10 border-border/50 hover-scale animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={similarProduct.image} 
                      alt={similarProduct.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {similarProduct.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{similarProduct.brand}</p>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ${similarProduct.price.toLocaleString()}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                      variant="outline"
                      onClick={() => navigate(`/products/${similarProduct.id}`)}
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