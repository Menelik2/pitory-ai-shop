import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, RefreshCw, Download, Star } from "lucide-react";
import { ProductForm } from "./ProductForm";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/mockProducts";
import { downloadCsv } from "@/lib/adminUtils";

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
  featured?: boolean | null;
}

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
  images?: string[];
  stock: number;
  specifications?: Record<string, string>;
}

type SortKey = "newest" | "name" | "price_asc" | "price_desc" | "stock_asc" | "stock_desc";

export function ProductTable() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<FormProduct | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = products.filter((p) => {
      if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
      const stock = p.stock_quantity ?? 0;
      if (stockFilter === "low" && !(stock > 0 && stock <= 3)) return false;
      if (stockFilter === "out" && stock > 0) return false;
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    });

    list = [...list];
    switch (sortKey) {
      case "name":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "price_asc":
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_desc":
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "stock_asc":
        list.sort((a, b) => (a.stock_quantity || 0) - (b.stock_quantity || 0));
        break;
      case "stock_desc":
        list.sort((a, b) => (b.stock_quantity || 0) - (a.stock_quantity || 0));
        break;
      default:
        break;
    }
    return list;
  }, [products, search, categoryFilter, stockFilter, sortKey]);

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: DBProduct) => {
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
      images: product.image_urls || [""],
      stock: product.stock_quantity,
      specifications: product.detailed_specs || {},
    };
    setSelectedProduct(formProduct);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({ title: "Product deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const adjustStock = async (product: DBProduct, delta: number) => {
    const next = Math.max(0, (product.stock_quantity || 0) + delta);
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: next })
        .eq("id", product.id);
      if (error) throw error;
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock_quantity: next } : p))
      );
    } catch {
      toast({ title: "Error", description: "Could not update stock", variant: "destructive" });
    }
  };

  const toggleFeatured = async (product: DBProduct) => {
    const next = !product.featured;
    try {
      const { error } = await supabase
        .from("products")
        .update({ featured: next })
        .eq("id", product.id);
      if (error) throw error;
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, featured: next } : p))
      );
      toast({ title: next ? "Marked featured" : "Removed from featured" });
    } catch {
      toast({
        title: "Error",
        description: "Could not update featured flag",
        variant: "destructive",
      });
    }
  };

  const exportCsv = () => {
    const rows: string[][] = [
      ["ID", "Name", "Brand", "Category", "Price", "Stock", "Featured"],
    ];
    filtered.forEach((p) => {
      rows.push([
        p.id,
        p.name,
        p.brand || "",
        p.category,
        String(p.price),
        String(p.stock_quantity ?? 0),
        p.featured ? "yes" : "no",
      ]);
    });
    downloadCsv(`products-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    toast({ title: "CSV downloaded", description: `${filtered.length} products exported.` });
  };

  const handleSaveProduct = async (formData: any) => {
    try {
      const specifications =
        formData.specifications && Object.keys(formData.specifications).length > 0
          ? formData.specifications
          : {
              cpu: formData.cpu,
              generation: formData.generation,
              ram: formData.ram,
              storage: formData.storage,
              display: formData.display,
            };

      const dbData = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: formData.price,
        description: formData.description,
        image_urls: formData.images || [formData.image],
        stock_quantity: formData.stock,
        detailed_specs: specifications,
        slug: formData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      };

      if (selectedProduct) {
        const { error } = await supabase
          .from("products")
          .update(dbData)
          .eq("id", selectedProduct.id);
        if (error) throw error;
        toast({ title: "Product updated" });
      } else {
        const { error } = await supabase.from("products").insert([dbData]);
        if (error) throw error;
        toast({ title: "Product added" });
      }

      setIsFormOpen(false);
      fetchProducts();
    } catch {
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  const stockBadge = (qty: number) => {
    if (qty <= 0)
      return (
        <Badge variant="destructive" className="text-[10px]">
          Out
        </Badge>
      );
    if (qty <= 3)
      return (
        <Badge className="text-[10px] bg-amber-100 text-amber-800 border-amber-200" variant="outline">
          Low
        </Badge>
      );
    return (
      <Badge className="text-[10px] bg-green-100 text-green-800 border-green-200" variant="outline">
        OK
      </Badge>
    );
  };

  return (
    <Card className="border-black/[0.04]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl">Product Management</CardTitle>
            <p className="text-sm text-muted-foreground">
              Search, sort, export, feature, and manage stock.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={exportCsv}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={fetchProducts}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={handleAddProduct} size="sm" className="rounded-full">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-4 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search name, brand, category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-full"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-full border border-input bg-background px-3 text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All categories" : c}
              </option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as "all" | "low" | "out")}
            className="h-9 rounded-full border border-input bg-background px-3 text-sm"
          >
            <option value="all">All stock</option>
            <option value="low">Low stock (≤3)</option>
            <option value="out">Out of stock</option>
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="h-9 rounded-full border border-input bg-background px-3 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="name">Name A–Z</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="stock_asc">Stock ↑</option>
            <option value="stock_desc">Stock ↓</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    {loading ? "Loading…" : "No products match your filters."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image_urls?.[0] || "https://placehold.co/80x80.png"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[140px]">
                      <div className="flex items-center gap-1 truncate">
                        {product.featured && (
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                        )}
                        <span className="truncate">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.brand}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      ${Number(product.price).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-full"
                            onClick={() => adjustStock(product, -1)}
                          >
                            −
                          </Button>
                          <span className="w-6 text-center text-sm tabular-nums">
                            {product.stock_quantity ?? 0}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-full"
                            onClick={() => adjustStock(product, 1)}
                          >
                            +
                          </Button>
                        </div>
                        {stockBadge(product.stock_quantity ?? 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full h-8 w-8 p-0"
                          title="Toggle featured"
                          onClick={() => toggleFeatured(product)}
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${
                              product.featured
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full h-8 w-8 p-0"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full h-8 w-8 p-0 text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Delete "{product.name}"? This cannot be undone.
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Showing {filtered.length} of {products.length} products
        </p>
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
