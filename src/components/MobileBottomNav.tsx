import { Home, Search, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

export function MobileBottomNav() {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        <Link
          to="/"
          className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
            isActive("/") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <button
          className="flex flex-col items-center p-3 rounded-lg transition-colors text-muted-foreground"
          onClick={() => {
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              searchInput.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Search</span>
        </button>

        <Link
          to="/cart"
          className={`flex flex-col items-center p-3 rounded-lg transition-colors relative ${
            isActive("/cart") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div className="relative">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems}
              </Badge>
            )}
          </div>
          <span className="text-xs mt-1">Cart</span>
        </Link>

        <Link
          to="/auth"
          className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
            isActive("/auth") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Account</span>
        </Link>
      </div>
    </div>
  );
}