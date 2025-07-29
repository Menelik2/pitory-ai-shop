import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categories } from "@/data/mockProducts";

interface Product {
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

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}

export function ProductForm({ product, isOpen, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    category: product?.category || "",
    price: product?.price || 0,
    cpu: product?.detailed_specs?.cpu || "",
    generation: product?.detailed_specs?.generation || "",
    ram: product?.detailed_specs?.ram || "",
    storage: product?.detailed_specs?.storage || "",
    display: product?.detailed_specs?.display || "",
    description: product?.description || "",
    image: product?.image_urls?.[0] || "https://placehold.co/600x400.png",
    stock: product?.stock_quantity || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform form data to match Supabase schema
    const productData = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      price: formData.price,
      description: formData.description,
      stock_quantity: formData.stock,
      image_urls: [formData.image],
      detailed_specs: {
        cpu: formData.cpu,
        generation: formData.generation,
        ram: formData.ram,
        storage: formData.storage,
        display: formData.display,
      },
    };
    
    onSave(productData);
    onClose();
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Fill out the form to {product ? "update the" : "add a new"} product.
          </p>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., Aether-Wing Mouse"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  placeholder="e.g., Apex"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the product..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="e.g., Electronics" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat !== "All").map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange("stock", parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <h3 className="font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpu">CPU</Label>
                  <Input
                    id="cpu"
                    value={formData.cpu}
                    onChange={(e) => handleChange("cpu", e.target.value)}
                    placeholder="e.g., Ryzen 9"
                  />
                </div>
                
                <div>
                  <Label htmlFor="generation">Generation</Label>
                  <Input
                    id="generation"
                    value={formData.generation}
                    onChange={(e) => handleChange("generation", e.target.value)}
                    placeholder="e.g., 14th Gen"
                  />
                </div>
                
                <div>
                  <Label htmlFor="ram">RAM</Label>
                  <Input
                    id="ram"
                    value={formData.ram}
                    onChange={(e) => handleChange("ram", e.target.value)}
                    placeholder="e.g., 32GB DDR5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="storage">Storage</Label>
                  <Input
                    id="storage"
                    value={formData.storage}
                    onChange={(e) => handleChange("storage", e.target.value)}
                    placeholder="e.g., 1TB NVMe SSD"
                  />
                </div>
                
                <div>
                  <Label htmlFor="display">Display</Label>
                  <Input
                    id="display"
                    value={formData.display}
                    onChange={(e) => handleChange("display", e.target.value)}
                    placeholder="e.g., 27-inch 4K"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
                placeholder="https://placehold.co/600x400.png"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {product ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}