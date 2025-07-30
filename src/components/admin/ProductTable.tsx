import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ProductForm } from "./ProductForm";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Database Product interface
interface DBProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  detailed_specs: any;
  stock_quantity: number;
  image_urls: string[];
  description: string;
}

// Form Product interface for compatibility with ProductForm
interface FormProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  cpu: string;
  generation: string;
  ram: string;
  storage: string;
  display?: string;
  description: string;
  image: string;
  stock: number;
}

export function ProductTable() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<FormProduct | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: DBProduct) => {
    // Convert DB product to form product
    const formProduct: FormProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      cpu: product.detailed_specs?.cpu || "",
      generation: product.detailed_specs?.generation || "",
      ram: product.detailed_specs?.ram || "",
      storage: product.detailed_specs?.storage || "",
      display: product.detailed_specs?.display || "",
      description: product.description,
      image: product.image_urls?.[0] || "",
      stock: product.stock_quantity
    };
    setSelectedProduct(formProduct);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Product deleted",
        description: "The product has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleSaveProduct = async (formData: any) => {
    try {
      // Convert form data to database format
      const dbData = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: formData.price,
        description: formData.description,
        image_urls: [formData.image],
        stock_quantity: formData.stock,
        detailed_specs: {
          cpu: formData.cpu,
          generation: formData.generation,
          ram: formData.ram,
          storage: formData.storage,
          display: formData.display
        },
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      if (selectedProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(dbData)
          .eq('id', selectedProduct.id);

        if (error) throw error;
        
        toast({
          title: "Product updated",
          description: "The product has been successfully updated.",
        });
      } else {
        // Add new product
        const { error } = await supabase
          .from('products')
          .insert([dbData]);

        if (error) throw error;
        
        toast({
          title: "Product added",
          description: "The product has been successfully added.",
        });
      }
      
      setIsFormOpen(false);
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur border-border/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Product Management</CardTitle>
            <p className="text-sm text-muted-foreground">
              Create, view, edit, and delete your products.
            </p>
          </div>
          <Button onClick={handleAddProduct} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Gen</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                     <img
                       src={product.image_urls?.[0] || "https://placehold.co/600x400.png"}
                       alt={product.name}
                       className="w-12 h-12 object-cover rounded"
                     />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                   <TableCell>{product.detailed_specs?.cpu || 'N/A'}</TableCell>
                   <TableCell>{product.detailed_specs?.generation || 'N/A'}</TableCell>
                   <TableCell>{product.detailed_specs?.ram || 'N/A'}</TableCell>
                  <TableCell>${product.price.toLocaleString()}</TableCell>
                   <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <ProductForm
        product={selectedProduct}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
      />
    </Card>
  );
}