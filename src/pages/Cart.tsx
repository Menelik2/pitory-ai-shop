import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Minus, Plus, Trash2, Phone, MapPin, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const itemLabel = totalItems === 1 ? "item" : "items";

  const openCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutOpen(true);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = customerName.trim();
    const loc = location.trim();
    const tel = phone.trim();

    if (!name || !loc || !tel) {
      toast({
        title: "Missing information",
        description: "Please enter your name, location, and phone number.",
        variant: "destructive",
      });
      return;
    }

    if (tel.replace(/\D/g, "").length < 8) {
      toast({
        title: "Invalid phone",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const shippingAddress = {
        customer_name: name,
        location: loc,
        phone: tel,
      };

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          total_amount: totalPrice,
          shipping_amount: 0,
          tax_amount: 0,
          status: "pending",
          shipping_address: shippingAddress,
          user_id: null,
        })
        .select("id")
        .single();

      if (orderError) throw orderError;
      if (!order?.id) throw new Error("Order was not created");

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      setCheckoutOpen(false);
      setCustomerName("");
      setLocation("");
      setPhone("");

      toast({
        title: "Order placed!",
        description: "We received your order. Our team will contact you soon.",
      });
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({
        title: "Could not place order",
        description:
          err?.message ||
          "Something went wrong. Please try again or call us.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={getTotalItems()} onSearch={() => {}} />
        <main className="container mx-auto px-4 py-20 text-center">
          <div
            className="
              max-w-md mx-auto p-10 rounded-3xl
              bg-white/70 backdrop-blur-[24px] backdrop-saturate-[180%]
              border border-black/[0.04] shadow-sm
            "
            style={{
              WebkitBackdropFilter: "saturate(180%) blur(24px)",
            }}
          >
            <h1 className="text-2xl font-semibold tracking-tight mb-3">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6 text-sm">
              Browse our collection and add something you love.
            </p>
            <Button asChild className="rounded-full">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={totalItems} onSearch={() => {}} />

      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-8">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            <div
              className="
                hidden md:grid grid-cols-4 gap-4 p-4 rounded-2xl text-[12px] font-semibold uppercase tracking-wider text-muted-foreground
                bg-white/50 backdrop-blur-md border border-black/[0.04]
              "
            >
              <div>Product</div>
              <div>Details</div>
              <div>Quantity</div>
              <div>Price</div>
            </div>

            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[15px] tracking-tight">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 w-8 p-0 border-black/[0.08] bg-white/50 backdrop-blur-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value, 10) || 1)
                        }
                        className="w-14 text-center h-8 rounded-lg"
                        min={1}
                        max={item.stock || undefined}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 w-8 p-0 border-black/[0.08] bg-white/50 backdrop-blur-sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="text-lg font-semibold tabular-nums">
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card className="border-primary/15">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="h-4 w-4" />
                  Call Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Our team is here to assist you.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 opacity-60" />
                    <a href="tel:+251918266383" className="font-semibold text-sm hover:text-primary">
                      +251 91 826 6383
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Call us to place an order or for any questions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({totalItems} {itemLabel})
                  </span>
                  <span className="tabular-nums">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-black/[0.06] pt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <Button className="w-full rounded-full h-11 mt-2" onClick={openCheckout}>
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* Checkout dialog: Name, Location, Phone → saved for admin */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Enter your details so we can confirm your order. Total:{" "}
              <span className="font-semibold text-foreground">
                ${totalPrice.toLocaleString()}
              </span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePlaceOrder} className="space-y-4 pt-1">
            <div className="space-y-2">
              <Label htmlFor="checkout-name" className="text-xs uppercase tracking-wider text-muted-foreground">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="checkout-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  className="pl-10 h-11 rounded-xl"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkout-location" className="text-xs uppercase tracking-wider text-muted-foreground">
                Location / Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="checkout-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, area, or full address"
                  className="pl-10 h-11 rounded-xl"
                  required
                  autoComplete="street-address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkout-phone" className="text-xs uppercase tracking-wider text-muted-foreground">
                Phone number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 ..."
                  className="pl-10 h-11 rounded-xl"
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setCheckoutOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full" disabled={submitting}>
                {submitting ? "Placing order..." : "Place Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
