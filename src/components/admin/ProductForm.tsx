import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { Product, categories, getCategorySpecs } from "@/data/mockProducts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
    description: product?.description || "",
    image: product?.image || "https://placehold.co/600x400.png",
    images: product?.images || ["https://placehold.co/600x400.png"],
    stock: product?.stock || 0,
    specifications: product?.specifications || {},
    // Legacy fields for backward compatibility
    cpu: product?.cpu || "",
    generation: product?.generation || "",
    ram: product?.ram || "",
    storage: product?.storage || "",
    display: product?.display || "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Update form data whenever product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        category: product.category || "",
        price: product.price || 0,
        description: product.description || "",
        image: product.image || "https://placehold.co/600x400.png",
        images: product.images || [product.image || "https://placehold.co/600x400.png"],
        stock: product.stock || 0,
        specifications: product.specifications || {},
        // Legacy fields
        cpu: product.cpu || "",
        generation: product.generation || "",
        ram: product.ram || "",
        storage: product.storage || "",
        display: product.display || "",
      });
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        brand: "",
        category: "",
        price: 0,
        description: "",
        image: "https://placehold.co/600x400.png",
        images: ["https://placehold.co/600x400.png"],
        stock: 0,
        specifications: {},
        cpu: "",
        generation: "",
        ram: "",
        storage: "",
        display: "",
      });
    }
  }, [product]);

  // Reset specifications when category changes
  useEffect(() => {
    if (formData.category) {
      const categorySpecs = getCategorySpecs(formData.category);
      const newSpecs: Record<string, string> = {};
      
      // Initialize empty specs for the new category
      Object.keys(categorySpecs).forEach(key => {
        newSpecs[key] = formData.specifications?.[key] || "";
      });
      
      setFormData(prev => ({ ...prev, specifications: newSpecs }));
    }
  }, [formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImages = [...formData.images];
    
    // Upload new files if any
    if (uploadedFiles.length > 0) {
      setUploading(true);
      try {
        const uploadPromises = uploadedFiles.map(async (file, index) => {
          const fileName = `${Date.now()}-${index}-${file.name}`;
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);
          
          if (error) throw error;
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          
          return publicUrl;
        });
        
        const uploadedUrls = await Promise.all(uploadPromises);
        finalImages = [...uploadedUrls, ...formData.images.filter(img => img !== "https://placehold.co/600x400.png")];
        
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload images. Please try again.",
          variant: "destructive",
        });
        return;
      } finally {
        setUploading(false);
      }
    }
    
    onSave({ ...formData, images: finalImages, image: finalImages[0] });
    onClose();
    setUploadedFiles([]);
  };

  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecificationChange = (specKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey]: value
      }
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages, image: newImages[0] }));
  };

  const addImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, "https://placehold.co/600x400.png"] 
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 10485760; // 10MB
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Some files were rejected. Only JPEG, PNG, WebP, GIF under 10MB are allowed.",
        variant: "destructive",
      });
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages, image: newImages[0] }));
    }
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
              <h3 className="font-semibold mb-4">
                {formData.category ? `${formData.category} Specifications` : "Specifications"}
              </h3>
              
              {formData.category && getCategorySpecs(formData.category) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(getCategorySpecs(formData.category)).map(([key, spec]) => (
                    <div key={key}>
                      <Label htmlFor={key}>{spec.label}</Label>
                      <Input
                        id={key}
                        value={formData.specifications?.[key] || ""}
                        onChange={(e) => handleSpecificationChange(key, e.target.value)}
                        placeholder={spec.placeholder}
                      />
                    </div>
                  ))}
                </div>
              ) : formData.category ? (
                <div className="text-sm text-muted-foreground p-4 border rounded-md">
                  Select a valid category to see relevant specification fields.
                </div>
              ) : (
                <div className="text-sm text-muted-foreground p-4 border rounded-md">
                  Please select a category first to see relevant specification fields.
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Product Images</Label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="flex items-center gap-2"
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Images
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addImage}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add URL
                  </Button>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Uploaded files preview */}
              {uploadedFiles.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm text-muted-foreground">Files to upload:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-2 text-sm">
                          <span className="truncate max-w-32">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUploadedFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing image URLs */}
              <div className="space-y-4">
                {formData.images.map((imageUrl, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        pattern="https?://.*"
                        title="Please enter a valid image URL"
                      />
                      {index === 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Main product image (displayed first)
                        </p>
                      )}
                    </div>
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Upload images directly to Supabase Storage or add URLs manually. 
                Uploaded images get permanent URLs that won't break.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : (product ? "Update Product" : "Add Product")}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}