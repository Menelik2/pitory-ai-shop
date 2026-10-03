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
          cpu: (data.detailed_specs as any)?.cpu || '',
          generation: (data.detailed_specs as any)?.generation || '',
          ram: (data.detailed_specs as any)?.ram || '',
          storage: (data.detailed_specs as any)?.storage || '',
          display: (data.detailed_specs as any)?.display || ''
        };
        
        setProduct(convertedProduct);
        
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
      toast({ title: "Comment added", description: "Your comment has been posted successfully!" });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({ title: "Error", description: "Failed to post comment. Please try again.", variant: "destructive" });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({ title: product.name, text: `Check out this ${product.name}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!", description: "Product link has been copied to clipboard." });
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
    toast({ title: "Added to cart", description: `${quantity} x ${product.name} added to your cart.` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header cartItemCount={getTotalItems()} onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="relative group">
              <div className="aspect-square bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/50 hover:shadow-3xl transition-all duration-700">
                <img src={product.images[selectedImageIndex]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <button key={index} onClick={() => setSelectedImageIndex(index)} className={`relative group aspect-square bg-card rounded-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
                  selectedImageIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-border/50 hover:border-primary/50'
                }`}>
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs font-medium px-2 py-1">{product.brand}</Badge>
              <Badge variant="secondary" className="text-xs font-medium px-2 py-1">{product.category}</Badge>
            </div>
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground leading-tight mb-3">{product.name}</h1>
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
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800/30 mb-6">
              <div className="text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400">${product.price.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">Free shipping</div>
            </div>
            <div className="flex gap-3 mb-6">
              <Button variant="outline" size="sm" onClick={() => setIsFavorited(!isFavorited)} className="flex-1 border-border/50 hover:border-primary/50">
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />Favorite
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 border-border/50 hover:border-primary/50">
                <Share2 className="h-4 w-4 mr-2" />Share
              </Button>
            </div>
            <Card className="bg-card border-border/50">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-2 text-foreground">Product Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="features">Key Features</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specs" className="mt-3">
                <Card className="border-border/40 overflow-hidden">
                  <CardContent className="p-3 sm:p-4">
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {product.specifications && Object.entries(product.specifications).length > 0 ? (
                        Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-muted/25 min-w-0">
                            <Cpu className="h-3.5 w-3.5 text-primary shrink-0 opacity-80" />
                            <div className="min-w-0 leading-tight">
                              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground truncate capitalize">{key.replace(/_/g, ' ')}</div>
                              <div className="text-[13px] font-medium text-foreground truncate">{value}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          {product.cpu && (
                            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-muted/25 min-w-0">
                              <Cpu className="h-3.5 w-3.5 text-primary shrink-0 opacity-80" />
                              <div className="min-w-0 leading-tight">
                                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">CPU</div>
                                <div className="text-[13px] font-medium text-foreground truncate">{product.cpu}</div>
                              </div>
                            </div>
                          )}
                          {product.ram && (
                            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-muted/25 min-w-0">
                              <HardDrive className="h-3.5 w-3.5 text-primary shrink-0 opacity-80" />
                              <div className="min-w-0 leading-tight">
                                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">RAM</div>
                                <div className="text-[13px] font-medium text-foreground truncate">{product.ram}</div>
                              </div>
                            </div>
                          )}
                          {product.display && (
                            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-muted/25 min-w-0">
                              <Monitor className="h-3.5 w-3.5 text-primary shrink-0 opacity-80" />
                              <div className="min-w-0 leading-tight">
                                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Display</div>
                                <div className="text-[13px] font-medium text-foreground truncate">{product.display}</div>
                              </div>
                            </div>
                          )}
                          {product.storage && (
                            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-muted/25 min-w-0">
                              <HardDrive className="h-3.5 w-3.5 text-primary shrink-0 opacity-80" />
                              <div className="min-w-0 leading-tight">
                                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Storage</div>
                                <div className="text-[13px] font-medium text-foreground truncate">{product.storage}</div>
                              </div>
                            </div>
                          )}
                          {product.generation && (
                            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-muted/25 min-w-0">
                              <Zap className="h-3.5 w-3.5 text-primary shrink-0 opacity-80" />
                              <div className="min-w-0 leading-tight">
                                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Generation</div>
                                <div className="text-[13px] font-medium text-foreground truncate">{product.generation}</div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="mt-3">
                <Card className="border-border/40">
                  <CardContent className="p-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /><span>High-performance computing for demanding applications</span></li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /><span>Energy-efficient design for longer battery life</span></li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /><span>Premium build quality with modern aesthetics</span></li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /><span>Comprehensive warranty and support</span></li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-9 w-9 rounded-full"><Minus className="h-4 w-4" /></Button>
                      <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} className="h-9 w-9 rounded-full"><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="text-sm text-muted-foreground">{product.stock} in stock</div>
                  </div>
                  <Button onClick={handleAddToCart} className="w-full h-12 rounded-full text-base font-medium" size="lg">
                    <ShoppingCart className="h-5 w-5 mr-2" />Add to Cart — ${(product.price * quantity).toLocaleString()}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Your name</Label>
                    <Input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your name" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea id="comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..." rows={3} className="rounded-xl" />
                </div>
                <Button onClick={handleSubmitComment} disabled={submittingComment || !newComment.trim() || !userName.trim()} className="rounded-full">
                  <Send className="h-4 w-4 mr-2" />{submittingComment ? "Posting..." : "Post Comment"}
                </Button>
              </CardContent>
            </Card>
            {comments.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">No reviews yet. Be the first to comment!</div>
            ) : (
              <div className="space-y-3">
                {comments.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0"><User className="h-4 w-4" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{c.user_name}</span>
                            <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{c.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {similarProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarProducts.map((similarProduct) => (
                <Card key={similarProduct.id} className="overflow-hidden group cursor-pointer" onClick={() => navigate(`/products/${similarProduct.id}`)}>
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img src={similarProduct.image} alt={similarProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{similarProduct.name}</h3>
                    <p className="text-base font-semibold mb-3">${similarProduct.price.toLocaleString()}</p>
                    <Button size="sm" className="w-full rounded-full" variant="outline" onClick={(e) => { e.stopPropagation(); navigate(`/products/${similarProduct.id}`); }}>View Details</Button>
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
