import { Home, Monitor, Laptop, Headphones } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function MobileBottomNav() {
  const location = useLocation();

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

        <Link
          to="/?category=Desktop"
          className="flex flex-col items-center p-3 rounded-lg transition-colors text-muted-foreground"
        >
          <Monitor size={24} />
          <span className="text-xs mt-1">Desktop</span>
        </Link>

        <Link
          to="/?category=Laptop"
          className="flex flex-col items-center p-3 rounded-lg transition-colors text-muted-foreground"
        >
          <Laptop size={24} />
          <span className="text-xs mt-1">Laptop</span>
        </Link>

        <Link
          to="/?category=Accessories"
          className="flex flex-col items-center p-3 rounded-lg transition-colors text-muted-foreground"
        >
          <Headphones size={24} />
          <span className="text-xs mt-1">Accessories</span>
        </Link>
      </div>
    </div>
  );
}